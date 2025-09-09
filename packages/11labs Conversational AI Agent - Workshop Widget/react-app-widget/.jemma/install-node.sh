#!/usr/bin/env bash
set -euo pipefail

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Format for https://nodejs.org/dist
os="unknown"
arch="unknown"
case "$(uname -s)" in
    Linux*)               os="linux";;
    Darwin*)              os="darwin";;
    CYGWIN*|MINGW*|MSYS*) os="win";;
esac

case "$(uname -m)" in
    aarch64|arm64) arch="arm64";;
    armv7l)        arch="armv7l";;
    ppc64le)       arch="ppc64le";;
    s390x)         arch="s390x";;
    x86_64)        arch="x64";;
esac

node_arch="${os}-${arch}"
echo "Detected platform: ${node_arch}"

mkdir -p .node-installation
pushd .node-installation

node_version=v${NODE_INSTALLATION_VERSION}
base_url="${NODE_DIST_URI%/}/${node_version}"
filename="node-${node_version}-${node_arch}.tar.gz"
url="${base_url}/${filename}"

echo "Downloading nodejs from ${url}"
$script_dir/download-node.py $url $filename $FOUNDRY_TOKEN
echo "Download completed: ${filename}"

tar -xzf ${filename}
if [ $? -ne 0 ]; then
    echo "Extracting archive failed"
    exit 1
fi
echo "Extracting archive completed"

echo "Setting up PATH"
install_dir="$(pwd)/node-${node_version}-${node_arch}"
export PATH=${install_dir}/bin:$PATH
echo "Setting up PATH completed"

popd
