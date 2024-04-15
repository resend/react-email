from setuptools import setup, find_packages
import shutil

VERSION = "0.0.1"
DESCRIPTION = "Render React Email templates right from your Python code"
LONG_DESCRIPTION = "Render REact Email templates without any templating language right from your Python code"

shutil.copyfile("../../plugin.wasm", "./react_email/plugin.wasm")

setup(
    name="react_email",
    version=VERSION,
    author="Resend",
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    package_data={"": [
        "build.mjs",
        "plugin.wasm"
    ]},
    include_package_data=True,
    packages=find_packages(),
    keywords=['React Email', 'email', 'wasm', 'extism', 'rendering']
)
