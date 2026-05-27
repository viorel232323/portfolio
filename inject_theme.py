"""
Run this script inside your portfolio folder (next to index.html).
It finds all Notion-exported HTML files in the subfolder and injects
the _portfolio.js theme script into each one.

Usage:
  python inject_theme.py
"""

import os
import re

SUBFOLDER = "Viorel Grozea - Data Analyst Portfolio"
SCRIPT_TAG = '<script src="../_portfolio.js"></script>'
MARKER = '_portfolio.js'

def inject(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    if MARKER in content:
        print(f"  already injected: {os.path.basename(filepath)}")
        return

    # inject just before </head> or </body> or at end
    if '</head>' in content:
        content = content.replace('</head>', SCRIPT_TAG + '\n</head>', 1)
    elif '</body>' in content:
        content = content.replace('</body>', SCRIPT_TAG + '\n</body>', 1)
    else:
        content += '\n' + SCRIPT_TAG

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✓ injected: {os.path.basename(filepath)}")

def main():
    if not os.path.isdir(SUBFOLDER):
        print(f"ERROR: folder '{SUBFOLDER}' not found.")
        print("Make sure you run this script from inside your portfolio folder (where index.html lives).")
        return

    html_files = [
        os.path.join(SUBFOLDER, fn)
        for fn in os.listdir(SUBFOLDER)
        if fn.endswith('.html')
    ]

    if not html_files:
        print("No HTML files found in the subfolder.")
        return

    print(f"Found {len(html_files)} HTML files. Injecting theme...\n")
    for f in sorted(html_files):
        inject(f)

    print(f"\nDone! Now commit and push to GitHub.")

if __name__ == '__main__':
    main()
