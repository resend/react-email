#!/usr/bin/env bash

BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RESET='\033[0m'

echo -e $(date "+[%H:%M:%S]")"${CYAN} Repo Bootstrap\n${RESET}"

if [ -n "$($SHELL -c 'echo $ZSH_VERSION')" ]; then
  SHELL_PROFILE="$HOME/.zshrc"
elif [ -n "$($SHELL -c 'echo $BASH_VERSION')" ]; then
  SHELL_PROFILE="$HOME/.bashrc"
elif [ -n "$($SHELL -c 'echo $FISH_VERSION')" ]; then
  if [ -d "$XDG_CONFIG_HOME" ]; then
    SHELL_PROFILE="$XDG_CONFIG_HOME/fish/config.fish"
  else
    SHELL_PROFILE="$HOME/.config/fish/config.fish"
  fi
fi

# install nvm
echo -e $(date "+\n[%H:%M:%S]")"${BLUE} Installing NVM...\n${RESET}"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash >/dev/null
$SHELL -c "source $SHELL_PROFILE"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo -e $(date "+\n[%H:%M:%S]")"${BLUE} Installing Node v18...\n${RESET}"
nvm install 18 >/dev/null

# install pnpm
echo -e $(date "+\n[%H:%M:%S]")"${BLUE} Installing PNPM...\n${RESET}"
curl -fsSL https://get.pnpm.io/install.sh | bash -

# install moon
echo -e $(date "+\n[%H:%M:%S]")"${BLUE} Installing Moon...\n${RESET}"
pnpm add @moonrepo/cli@latest -g >/dev/null

# install Golang - https://github.com/canha/golang-tools-install-script
# kick out an extra newline into the profile so the golang script doesn't cause a syntax error
# https://github.com/canha/golang-tools-install-script/issues/68
echo "" >> $SHELL_PROFILE
echo -e $(date "+[%H:%M:%S]")"${BLUE} Installing Go...\n${RESET}"
curl -L https://git.io/vQhTU | bash >/dev/null
$SHELL -c "source $SHELL_PROFILE"

