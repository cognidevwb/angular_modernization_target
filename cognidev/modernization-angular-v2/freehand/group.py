"""Group the generated target's diagnostics by shape: `group.py <out-dir> <code> [n]`."""
import json, re, sys, collections
O, code = sys.argv[1], sys.argv[2]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 12
e = [r for r in json.load(open(f"{O}/errors.json")) if r['code'] == code]
def shape(m):
    m = re.sub(r" in /.*", "", m); m = re.sub(r"\[.*\]", "[…]", m); m = re.sub(r"at column \d+", "", m)
    return re.sub(r"'[^']*'", "'…'", m)[:90]
for k, c in collections.Counter(shape(r['message']) for r in e).most_common(n):
    ex = [r for r in e if shape(r['message']) == k][:2]
    print(f"{c:5} {k}")
    for x in ex:
        m = re.search(r"\[(.*)\] in /", x['message'])
        print(f"        {x['file'].split('/')[-1]}:{x['line']}  {(m.group(1) if m else x['message'])[:150]}")
