#!/usr/bin/env python3
"""Orthography checker for Farsi text.

Finds the script-level mistakes that are invisible when skimming but mark a
text as machine-made: Arabic look-alike letters, missing half-spaces (ZWNJ),
Latin punctuation and digits inside Persian text, stray characters from other
scripts. It does not judge wording or grammar.

    python3 farsi_lint.py translation.txt            # report
    python3 farsi_lint.py translation.txt --fix      # apply safe fixes in place, report the rest
    python3 farsi_lint.py translation.txt --fix --digits   # also convert Latin digits to Persian
    cat translation.txt | python3 farsi_lint.py -    # read stdin (with --fix, prints fixed text)

Code blocks, inline code, URLs, e-mail addresses and {placeholders} are never
checked or changed. Exit code is 1 when issues remain, 0 when the text is clean
(advisory notes are printed but do not count).
"""
import argparse
import bisect
import re
import sys

ZWNJ = "‌"
FA = "ء-غف-يپچژکگیۀٔ"  # Persian/Arabic letters
MASK = "￼"

PROTECTED = re.compile(
    r"```.*?```"                      # fenced code
    r"|`[^`\n]+`"                     # inline code
    r"|https?://\S+|www\.\S+"         # URLs
    r"|[\w.+-]+@[\w-]+\.[\w.-]+"      # e-mail
    r"|\{\{?[^{}\n]*\}\}?"            # {placeholder} / {{placeholder}}
    r"|%\d*\$?[sdif]|\$\d+",          # %s, %1$s, $1
    re.S,
)

# Characters that should never survive in a Farsi translation.
FOREIGN_SCRIPT = re.compile(
    "[Ͱ-ϿЀ-ӿ԰-֏א-תऀ-ॿ"
    "฀-๿Ⴀ-ჿ぀-ヿ一-鿿가-힯]+"
)

ARABIC_TO_PERSIAN = {
    "ي": "ی",  # ي -> ی
    "ى": "ی",  # ى -> ی
    "ك": "ک",  # ك -> ک
    **{chr(0x0660 + i): chr(0x06F0 + i) for i in range(10)},  # ٠-٩ -> ۰-۹
}
ARABIC_CHARS = re.compile("[" + "".join(ARABIC_TO_PERSIAN) + "]")

LATIN_PUNCT = {",": "،", ";": "؛", "?": "؟"}
STRAY_ZWNJ = re.compile(
    rf"(?:^|(?<=[\s«(])){ZWNJ}+|{ZWNJ}+(?=$|[\s.,،؛؟!:»)])|(?<={ZWNJ}){ZWNJ}+", re.M)
PLURAL_SUFFIX = "ها|های|هایی|هایم|هایت|هایش|هایمان|هایتان|هایشان"

# (code, pattern, message). Patterns run on text with protected spans masked.
CHECKS = [
    ("arabic-letter", ARABIC_CHARS,
     "Arabic character; use the Persian one (ی، ک، ۰-۹)"),
    ("foreign-script", FOREIGN_SCRIPT,
     "character from another script left in the Farsi; rewrite this word in Persian"),
    ("zwnj-mi", re.compile(rf"(?<![{FA}{ZWNJ}])(?:ن?می) (?=[{FA}])"),
     "«می/نمی» needs a half-space, not a space: «می‌روم»"),
    ("zwnj-plural", re.compile(rf"(?<=[{FA}]) (?:{PLURAL_SUFFIX})(?![{FA}{ZWNJ}])"),
     "plural «ها» needs a half-space, not a space: «کتاب‌ها»"),
    ("zwnj-superlative", re.compile(rf"(?<=[{FA}]) (?:ترین|تری)(?![{FA}{ZWNJ}])"),
     "«ترین» needs a half-space: «بزرگ‌ترین»"),
    ("zwnj-comparative", re.compile(rf"(?<=[{FA}]) تر(?![{FA}{ZWNJ}])"),
     "probably needs a half-space: «بزرگ‌تر» (ignore if this is the word «تر» = wet)"),
    ("stray-zwnj", STRAY_ZWNJ,
     "half-space at the edge of a word or doubled; it only belongs inside a word"),
    ("latin-punct", re.compile(rf"(?<=[{FA}»])\s*[,;?]"),
     "Latin punctuation after Persian text; use ، ؛ ؟"),
    ("space-before-punct", re.compile(r"[ \t]+[،؛؟]"),
     "no space before ، ؛ ؟"),
    ("straight-quotes", re.compile(rf"[\"“”](?=[{FA}])|(?<=[{FA}.؟!])[\"“”]"),
     "use « » for quotations in Persian"),
    ("latin-digit", re.compile(r"(?<![A-Za-z0-9_\-./:#@&%$])(?<![A-Za-z]\s)[0-9]+(?:[.,:/][0-9]+)*(?![A-Za-z0-9_\-&])"),
     "Latin digits in Persian text; use ۰-۹ (keep Latin only inside codes and model names)"),
]
FIXABLE = {"arabic-letter", "stray-zwnj", "latin-punct", "space-before-punct"}
ADVISORY = {"zwnj-comparative"}  # shown, but a legitimate reading exists, so not counted
HAS_FA = re.compile(f"[{FA}]")
TO_PERSIAN_DIGITS = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")


def mask(text):
    return PROTECTED.sub(lambda m: re.sub(r"[^\n]", MASK, m.group()), text)


def find_issues(text):
    masked = mask(text)
    lines = masked.split("\n")
    starts, pos = [], 0
    for ln in lines:
        starts.append(pos)
        pos += len(ln) + 1
    issues = []
    for code, pattern, message in CHECKS:
        for m in pattern.finditer(masked):
            line_no = bisect.bisect_right(starts, m.start()) - 1
            if code == "latin-digit" and not HAS_FA.search(lines[line_no]):
                continue  # a line with no Persian text is not Farsi prose
            issues.append((line_no + 1, m.start() - starts[line_no] + 1, code, message,
                           text[max(0, m.start() - 12):m.end() + 12].replace("\n", " ")))
    if "هٔ" in text and f"ه{ZWNJ}ی " in text:
        issues.append((0, 0, "ezafe-mixed",
                       "both «هٔ» and «ه‌ی» are used for ezafe; pick one style", ""))
    return sorted(issues)


def fix_segment(seg, digits):
    seg = ARABIC_CHARS.sub(lambda m: ARABIC_TO_PERSIAN[m.group()], seg)
    seg = STRAY_ZWNJ.sub("", seg)
    seg = re.sub(rf"(?<=[{FA}»])\s*([,;?])", lambda m: LATIN_PUNCT[m.group(1)], seg)
    seg = re.sub(r"[ \t]+([،؛؟])", r"\1", seg)
    if digits:
        pattern = CHECKS[-1][1]
        seg = "\n".join(
            pattern.sub(lambda m: m.group().translate(TO_PERSIAN_DIGITS)
                        .replace(".", "٫").replace(",", "٬"), ln)
            if HAS_FA.search(ln) else ln
            for ln in seg.split("\n")
        )
    return seg


def fix(text, digits=False):
    out, last = [], 0
    for m in PROTECTED.finditer(text):
        out.append(fix_segment(text[last:m.start()], digits))
        out.append(m.group())
        last = m.end()
    out.append(fix_segment(text[last:], digits))
    return "".join(out)


def main():
    ap = argparse.ArgumentParser(description="Check Farsi text for orthography problems.")
    ap.add_argument("file", help="text file to check, or - for stdin")
    ap.add_argument("--fix", action="store_true",
                    help="apply the safe mechanical fixes (letters, punctuation, stray half-spaces)")
    ap.add_argument("--digits", action="store_true",
                    help="with --fix, also convert Latin digits in Persian lines to ۰-۹")
    args = ap.parse_args()

    from_stdin = args.file == "-"
    if from_stdin:
        text = sys.stdin.read()
    else:
        with open(args.file, encoding="utf-8") as fh:
            text = fh.read()

    report = sys.stderr if (from_stdin and args.fix) else sys.stdout
    if args.fix:
        fixed = fix(text, args.digits)
        if from_stdin:
            sys.stdout.write(fixed)
        elif fixed != text:
            with open(args.file, "w", encoding="utf-8") as fh:
                fh.write(fixed)
        before = len(find_issues(text))
        text = fixed
        print(f"fixed {before - len(find_issues(text))} issue(s)", file=report)

    issues = find_issues(text)
    for line, col, code, message, snippet in issues:
        where = f"{line}:{col}" if line else "file"
        print(f"{where}  [{code}]  {message}" + (f"   …{snippet}…" if snippet else ""), file=report)
    issues = [i for i in issues if i[2] not in ADVISORY]
    if issues:
        hint = "" if args.fix else "  (--fix handles: " + ", ".join(sorted(FIXABLE)) + ")"
        print(f"\n{len(issues)} issue(s) remaining{hint}", file=report)
        return 1
    print("clean", file=report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
