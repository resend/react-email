from typing import Any
import subprocess
import json
import os
import urllib.parse
import extism

wasm_path = urllib.parse.urljoin(__file__, "./plugin.wasm")
manifest = { "wasm": [{ "path": wasm_path }] }
plugin = extism.Plugin(manifest, wasi=True)

def render(template_path: str, props: Any):
    template_code = subprocess.run(
        ["esbuild", template_path, "--bundle", "--target=es2020", "--format=cjs"],
        capture_output=True
    ).stdout.decode();

    return plugin.call(
        "render",
        json.dumps({
            "props": props,
            "templateCode": template_code,
            "env": dict(os.environ)
        })
    )

extism.set_log_custom(print, level="debug");

