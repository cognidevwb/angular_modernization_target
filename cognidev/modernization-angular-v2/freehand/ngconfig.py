"""The compile configs for the generated target: every app entry plus every generated file."""
import json, sys
W, O = sys.argv[1:]
g = json.load(open(f"{W}/.cognidev/modernization-angular-v2/tsconfig.generated.json"))
files = [f"{W}/{f[6:]}" for f in g["files"]]
entries = [f"{W}/{e}" for e in ("main.ts", "admin-main.ts", "runner-main.ts")]
json.dump({"extends": f"{W}/tsconfig.json",
           "compilerOptions": {"outDir": f"{O}/ngc-out", "skipLibCheck": True, "types": []},
           "files": entries + files, "include": [f"{W}/src/client/q-app/**/*.d.ts"]},
          open(f"{O}/tsconfig.ng.json", "w"), indent=1)
entry = f"{W}/.cognidev/modernization-angular-v2/generated-entry.ts"
open(entry, "w").write("".join(f"import '{f[:-3]}';\n" for f in files if not f.endswith(".d.ts")))
open(f"{O}/webpack.generated.js", "w").write(f"""const base = require('{W}/webpack.config.js');
module.exports = (env, argv) => {{ const c = base(env, argv); c.entry = {{ generated: '{entry}' }};
  c.plugins = (c.plugins || []).filter(p => p.constructor.name !== 'HtmlWebpackPlugin');
  c.output.path = '{O}/dist'; c.cache = false; return c; }};
""")
