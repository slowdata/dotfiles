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
zinit snippet OMZP::git
zinit snippet OMZP::ubuntu
zinit snippet OMZP::sudo
zinit snippet OMZP::laravel
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

# Aliases
#
# File system
alias ls='eza -lh --group-directories-first --icons=auto'
alias lsa='ls -a'
alias lt='eza --tree --level=2 --long --icons --git'
alias lta='lt -a'
alias ff="fzf --preview 'bat --style=numbers --color=always {}'"
#
# Directories
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
#
alias n='nvim'
alias c='clear'
alias phpshell='/usr/bin/php -a'
alias art='artisan'
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'

alias open='xdg-open'

# Shell integrations
eval "$(fzf --zsh)"
eval "$(zoxide init --cmd cd zsh)"

# Setting Mise
eval "$(mise activate zsh)"

# Oh-my-posh
eval "$(oh-my-posh init zsh --config ~/.config/ohmyposh/zen.omp.json)"

# --- SSH Agent via keychain ---
if [[ -o interactive ]]; then
  export KEYCHAIN_DIR="$HOME/.cache/keychain"
  key="$HOME/.ssh/dias_pgr_wsl_rsa"
  if [[ -f "$key" ]]; then
    eval "$(keychain --quiet --eval --timeout 480 "$key")"
  fi
fi

# --- Evitar Ctrl+S congelar o terminal (tmux leader) ---
if [[ -o interactive ]]; then
  stty -ixon -ixoff 2>/dev/null
fi

function sesh-sessions() {
  {

    exec </dev/tty
    exec <&1
    local session
    session=$(sesh list -t -c | fzf --height 40% --reverse --border-label ' sesh ' --border --prompt '⚡  ')
    zle reset-prompt > /dev/null 2>&1 || true
    [[ -z "$session" ]] && return
    sesh connect $session

  }
}

zle     -N             sesh-sessions
bindkey -M emacs '\es' sesh-sessions
bindkey -M vicmd '\es' sesh-sessions
bindkey -M viins '\es' sesh-sessions


# eval "$(zellij setup --generate-auto-start zsh)"



# --- Keybindings clássicos (emacs style) ---
bindkey -e
bindkey '^A' beginning-of-line       # Ctrl+A → início
bindkey '^E' end-of-line             # Ctrl+E → fim
bindkey '^P' history-beginning-search-backward  # Ctrl+P → histórico acima (prefixo)
bindkey '^N' history-beginning-search-forward   # Ctrl+N → histórico abaixo (prefixo)
# bindkey '^R' history-incremental-search-backward # Ctrl+R → pesquisa no histórico
# bindkey '^S' history-incremental-search-forward  # Ctrl+S → pesquisa para a frente
bindkey "\e[3~" delete-char          # Delete → apaga à direita
bindkey "\e[1~" beginning-of-line    # Home
bindkey "\e[4~" end-of-line          # End

export PATH=$HOME/.local/bin:$PATH

[ -f "$HOME/.local/bin/env" ] && source "$HOME/.local/bin/env"
export PATH=$PATH:$HOME/go/bin

# Proxy settings
#export http_proxy="http://172.20.15.100:3128"
#export https_proxy="http://172.20.15.100:3128"
#export HTTP_PROXY="http://172.20.15.100:3128"
#export HTTPS_PROXY="http://172.20.15.100:3128"
#export no_proxy="localhost,127.0.0.1,::1,janus.dv,dev.localhost,*.pgr.pt,*.portalcos.pt,10.176.0.0/16,172.20.0.0/16"
#export NO_PROXY="localhost,127.0.0.1,::1,janus.dv,dev.localhost,*.pgr.pt,*.portalcos.pt,10.176.0.0/16,172.20.0.0/16"


# Composer packages
export PATH="$HOME/.config/composer/vendor/bin:$PATH"

[ -f "$HOME/.local/bin/env" ] && source "$HOME/.local/bin/env"

# Atalho para criar/entrar em sessões tmux
tmx () {
  if [ -z "$1" ]; then
    echo "Uso: tmx <nome-da-sessao>"
    return 1
  fi

  if [ -n "$TMUX" ]; then
    tmux switch-client -t "$1" 2>/dev/null || tmux new-session -d -s "$1" \; switch-client -t "$1"
  else
    tmux attach -t "$1" 2>/dev/null || tmux new -s "$1"
  fi
}

