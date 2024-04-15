from typing import Any
import subprocess
import json
import os
import urllib.parse
import extism

wasm_path = urllib.parse.urljoin(__file__, "../render.wasm")
manifest = { "wasm": [{ "path": wasm_path }] }
plugin = extism.Plugin(manifest, wasi=True)

def render(template_path: str, props: Any):
    # using #this while https://github.com/bellard/quickjs/issues/261 doesn't get fixed
    template_code = subprocess.run(["node", urllib.parse.urljoin(__file__, "./build.mjs"), template_path], capture_output=True).stdout.decode()

    return plugin.call(
        "render",
        json.dumps({
            "props": props,
            "templateCode": template_code,
            "env": dict(os.environ)
        })
    )

extism.set_log_file('testing.log', level="debug");

template_path = urllib.parse.urljoin(__file__, "./email.tsx");
print(
    render(
        template_path, 
        {
            "username": "Gabriel Miranda"
        }
    )
)

