# Zsh CONFIG

# Set the directory we want to store zinit and plugins
ZINIT_HOME="${XDG_DATA_HOME:-${HOME}/.local/share}/zinit/zinit.git"

# Download Zinit, if it's not there yet
if [ ! -d "$ZINIT_HOME" ]; then
	mkdir -p "$(dirname $ZINIT_HOME)"
	git clone https://github.com/zdharma-continuum/zinit.git "$ZINIT_HOME"
fi

# Source/Load zinit
source "${ZINIT_HOME}/zinit.zsh"

# Add in zsh plugins
zinit light zsh-users/zsh-syntax-highlighting
zinit light zsh-users/zsh-completions
zinit light zsh-users/zsh-autosuggestions
zinit light Aloxaf/fzf-tab

ZSH_DISABLE_COMPFIX=true

# Add in snippets
# OMZP::git removido — define 'ga' como alias e conflitua com fns/worktrees do Omarchy
# OMZP::ubuntu removido — este sistema e Arch, nao Ubuntu
zinit snippet OMZP::sudo
zinit snippet OMZP::command-not-found

# Load completions
autoload -U compinit && compinit

zinit cdreplay -q

# History
HISTSIZE=5000
HISTFILE=~/.zsh_history
SAVEHIST=$HISTSIZE
HISTDUP=erase
setopt appendhistory
setopt sharehistory
setopt hist_ignore_space
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_ignore_dups
setopt hist_find_no_dups

# Completion styling
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' menu no
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'ls --color $realpath'
zstyle ':fzf-tab:complete:__zoxide_z:*' fzf-preview 'ls --color $realpath'

# Omarchy (aliases + envs + funcoes utilitarias, actualizados com omarchy-update)
export OMARCHY_PATH="${OMARCHY_PATH:-$HOME/.local/share/omarchy}"
[[ ":$PATH:" != *":$OMARCHY_PATH/bin:"* ]] && export PATH="$OMARCHY_PATH/bin:$PATH"
export SUDO_EDITOR="$EDITOR"
export BAT_THEME=ansi
unalias open 2>/dev/null  # evitar conflito: bash/aliases define open() como funcao
unalias n 2>/dev/null    # bash/aliases define n() como funcao
source $OMARCHY_PATH/default/bash/aliases
source $OMARCHY_PATH/default/bash/envs
unalias ga 2>/dev/null  # fns/worktrees define ga() como funcao
unalias gd 2>/dev/null  # fns/worktrees define gd() como funcao
for f in $OMARCHY_PATH/default/bash/fns/*; do source "$f"; done

# Aliases e funcoes pessoais (sobrepoem-se aos defaults do Omarchy acima)
source ~/.aliases

# Override de format-drive com sintaxe zsh (read -rp nao funciona em zsh)
format-drive() {
  if (( $# != 2 )); then
    echo "Usage: format-drive <device> <name>"
    echo "Example: format-drive /dev/sda 'My Stuff'"
    echo -e "\nAvailable drives:"
    lsblk -d -o NAME -n | awk '{print "/dev/"$1}'
  else
    echo "WARNING: This will completely erase all data on $1 and label it '$2'."
    read "confirm?Are you sure you want to continue? (y/N): "
    if [[ $confirm =~ ^[Yy]$ ]]; then
      sudo wipefs -a "$1"
      sudo dd if=/dev/zero of="$1" bs=1M count=100 status=progress
      sudo parted -s "$1" mklabel gpt
      sudo parted -s "$1" mkpart primary 1MiB 100%
      sudo parted -s "$1" set 1 msftdata on
      partition="$([[ $1 == *"nvme"* ]] && echo "${1}p1" || echo "${1}1")"
      sudo partprobe "$1" || true
      sudo udevadm settle || true
      sudo mkfs.exfat -n "$2" "$partition"
      echo "Drive $1 formatted as exFAT and labeled '$2'."
    fi
  fi
}

# Shell integrations
eval "$(fzf --zsh)"
eval "$(zoxide init zsh)"

# Setting Mise
eval "$(mise activate zsh)"

# Oh-my-posh
eval "$(oh-my-posh init zsh --config ~/.config/ohmyposh/zen.omp.json)"

# SSH Agent via keychain (so em shells interativos)
if [[ -o interactive ]]; then
  key="$HOME/.ssh/dias_pgr_wsl_rsa"
  if [[ -f "$key" ]]; then
    eval "$(keychain --quiet --eval --timeout 480 "$key")"
  fi
fi

# Evitar Ctrl+S congelar o terminal (para tmux leader)
if [[ -o interactive ]]; then
  stty -ixon -ixoff 2>/dev/null
fi

# Selector de sessoes sesh (Alt+S) — funcao definida em ~/.aliases
zle -N sesh-sessions
bindkey -M emacs '\es' sesh-sessions
bindkey -M vicmd '\es' sesh-sessions
bindkey -M viins '\es' sesh-sessions

# Keybindings classicos (emacs style)
bindkey -e
bindkey '^A' beginning-of-line
bindkey '^E' end-of-line
bindkey '^P' history-beginning-search-backward
bindkey '^N' history-beginning-search-forward
bindkey "\e[3~" delete-char
bindkey "\e[1~" beginning-of-line
bindkey "\e[4~" end-of-line

export PATH="$HOME/.local/bin:$PATH"
export PATH="$PATH:$HOME/go/bin"
export PATH="$PATH:$HOME/.config/composer/vendor/bin"
export EDITOR=nvim

[ -f "$HOME/.local/bin/env" ] && . "$HOME/.local/bin/env"

# Proxy settings (desativado)
#export http_proxy="http://172.20.15.100:3128"
#export https_proxy="http://172.20.15.100:3128"
#export HTTP_PROXY="http://172.20.15.100:3128"
#export HTTPS_PROXY="http://172.20.15.100:3128"
#export no_proxy="localhost,127.0.0.1,::1,janus.dv,dev.localhost,*.pgr.pt,*.portalcos.pt,10.176.0.0/16,172.20.0.0/16"
#export NO_PROXY="localhost,127.0.0.1,::1,janus.dv,dev.localhost,*.pgr.pt,*.portalcos.pt,10.176.0.0/16,172.20.0.0/16"
