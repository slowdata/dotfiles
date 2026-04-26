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
# OMZP::ubuntu removido — este sistema é Arch, não Ubuntu
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

# Omarchy (aliases + envs + funções utilitárias, actualizados com omarchy-update)
export OMARCHY_PATH="${OMARCHY_PATH:-$HOME/.local/share/omarchy}"
[[ ":$PATH:" != *":$OMARCHY_PATH/bin:"* ]] && export PATH="$OMARCHY_PATH/bin:$PATH"
export SUDO_EDITOR="$EDITOR"
export BAT_THEME=ansi
source $OMARCHY_PATH/default/bash/aliases
source $OMARCHY_PATH/default/bash/envs
unalias ga 2>/dev/null  # fns/worktrees define ga() como função; limpar o alias primeiro
for f in $OMARCHY_PATH/default/bash/fns/*; do source "$f"; done

# Aliases e funções pessoais (sobrepõem-se aos defaults do Omarchy acima)
source ~/.aliases

# Override de format-drive com sintaxe zsh (read -rp não funciona em zsh)
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

# Evitar Ctrl+S congelar o terminal (para tmux leader)
if [[ -o interactive ]]; then
  stty -ixon -ixoff 2>/dev/null
fi

# Selector de sessões sesh (Alt+S) — função definida em ~/.aliases
zle -N sesh-sessions
bindkey -M emacs '\es' sesh-sessions
bindkey -M vicmd '\es' sesh-sessions
bindkey -M viins '\es' sesh-sessions

# Keybindings clássicos (emacs style)
bindkey -e
bindkey '^A' beginning-of-line       # Ctrl+A → início
bindkey '^E' end-of-line             # Ctrl+E → fim
bindkey '^P' history-beginning-search-backward  # Ctrl+P → histórico acima (prefixo)
bindkey '^N' history-beginning-search-forward   # Ctrl+N → histórico abaixo (prefixo)
bindkey "\e[3~" delete-char          # Delete → apaga à direita
bindkey "\e[1~" beginning-of-line    # Home
bindkey "\e[4~" end-of-line          # End

export PATH="$HOME/.local/bin:$PATH"
export PATH="$PATH:$HOME/go/bin"
export PATH="$PATH:$HOME/.composer/vendor/bin"
export EDITOR=nvim

[[ -f ~/.proxyenv ]] && source ~/.proxyenv



export GRAVAR_ONLY_RECORD=true

# Config específica por máquina (SSH keys, paths locais, proxy...)
[[ -f ~/.zshrc.local ]] && source ~/.zshrc.local
