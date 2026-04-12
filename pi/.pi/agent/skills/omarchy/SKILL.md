---
name: omarchy
description: Contexto completo do sistema Linux do utilizador (Dias). Usar sempre que for pedida qualquer alteração a configurações, dotfiles, terminal, shell, tmux, ghostty, temas, ferramentas de sistema, ou qualquer outra configuração do ambiente de trabalho Linux. Cobre todas as máquinas (ossoarchy, viarchy, omarchy-pgr) e a estrutura dos dotfiles.
---

# Omarchy — Contexto do Sistema do Utilizador

## O Sistema

**Omarchy** é uma distribuição Linux opinionada baseada em Arch Linux, criada por DHH.
- Path: `~/.local/share/omarchy/`
- Versão actual: 3.5.0
- Documentação para agentes: `~/.local/share/omarchy/AGENTS.md`
- Actualização: `omarchy-update`

## Máquinas

| Hostname      | Tipo                        | OS             | Estado dotfiles     |
|---------------|-----------------------------|----------------|---------------------|
| `ossoarchy`   | PC pessoal (casa)           | Omarchy (Arch) | stow aplicado ✅    |
| `viarchy`     | Portátil trabalho           | Omarchy (Arch) | estado desconhecido |
| `omarchy-pgr` | Workstation trabalho        | Omarchy (Arch) | estado desconhecido |
| *(sem nome)*  | Workstation Windows         | Windows 11     | wezterm via WSL     |

Cada máquina pode ter `~/.zshrc.local` para config específica (gitignored).

## Dotfiles

- **Repo:** `git@github.com:slowdata/dotfiles.git` — branch `main`
- **Localização:** `~/dotfiles/`
- **Gestão:** GNU Stow
- **Backup local:** `~/.dotfiles-backup/`

### Estrutura

```
~/dotfiles/
├── ghostty/.config/ghostty/config     # Terminal principal
├── ohmyposh/.config/ohmyposh/         # Tema zen do prompt
├── tmux/.config/tmux/tmux.conf        # Config tmux (uso secundário)
├── wezterm/wezterm.lua                # Só para Windows/WSL
├── zsh/.zshrc                         # Config zsh
└── zsh/.aliases                       # Aliases e funções pessoais
```

### Aplicar stow numa máquina nova

```bash
git clone git@github.com:slowdata/dotfiles.git ~/dotfiles
cd ~/dotfiles
stow ghostty ohmyposh tmux zsh
```

### Actualizar após mudanças

```bash
cd ~/dotfiles && git pull
# Symlinks já apontam para o repo — não precisa de re-fazer stow
```

## Terminal: Ghostty (principal)

Config: `~/.config/ghostty/config` → symlink para `~/dotfiles/ghostty/.config/ghostty/config`

- **Fonte:** JetBrainsMono Nerd Font, tamanho 9
- **Tema:** dinâmico via Omarchy (`~/.config/omarchy/current/theme/ghostty.conf`)
- **Reload config:** `Ctrl+Shift+,` (default Ghostty)
- **Quick terminal:** `Super+\`` ou `F12`

### Splits (prefixo `Ctrl+Space`)

| Atalho | Acção |
|--------|-------|
| `Ctrl+Space` → `v` | Split vertical (novo painel à direita) |
| `Ctrl+Space` → `s` | Split horizontal (novo painel abaixo) |
| `Ctrl+Space` → `h/j/k/l` | Navegar entre splits |
| `Ctrl+Space` → `Shift+↑/↓/←/→` | Redimensionar split |
| `Ctrl+Space` → `z` | Zoom no split actual |
| `Ctrl+Space` → `x` | Fechar split |
| `Ctrl+Space` → `=` | Equalizar splits |

### Outros atalhos

| Atalho | Acção |
|--------|-------|
| `Shift+Insert` | Colar da clipboard |
| `Ctrl+Insert` | Copiar para clipboard |
| `Ctrl+Shift+P` | Command palette |

## Terminal: tmux (secundário)

Config: `~/.config/tmux/tmux.conf` → symlink para `~/dotfiles/tmux/.config/tmux/tmux.conf`

Usado principalmente para: SSH em servidores remotos, persistência de sessão.

- **Prefix:** `Ctrl+Space` (igual ao Ghostty, por coerência)
- **Reload:** `prefix + q`
- **Splits:** `prefix + v` (vertical) · `prefix + h` (horizontal)
- **Navegação panes:** `Ctrl+Alt+←/→/↑/↓`
- **Tema:** Catppuccin Mocha
- **Gestor de sessões:** `sesh` com fuzzy finder

### Função `t` (alias pessoal)

```bash
t           # abre/retoma sessão "main"
t nome      # abre/retoma sessão com nome
t .         # usa nome da pasta actual
```

### Funções Omarchy para tmux

- `tdl <ai>` — layout dev: nvim + AI + terminal
- `tdlm <ai>` — múltiplas janelas por subdirectória
- `tsl <n> <cmd>` — n painéis com o mesmo comando (swarm)

## Shell: zsh

Config: `~/.zshrc` → symlink para `~/dotfiles/zsh/.zshrc`
Aliases: `~/.aliases` → symlink para `~/dotfiles/zsh/.aliases`

### Stack

- **Plugin manager:** zinit
- **Prompt:** oh-my-posh com tema zen (`~/.config/ohmyposh/zen.omp.json`)
- **Plugins:** zsh-syntax-highlighting, zsh-completions, zsh-autosuggestions, fzf-tab
- **Snippets OMZ activos:** sudo, command-not-found
- **Snippets OMZ removidos:** git (conflito com worktrees Omarchy), ubuntu (é Arch)

### Relação com Omarchy

O Omarchy fornece aliases/envs/funções base em bash. O zshrc carrega-os e depois
os aliases pessoais (`~/.aliases`) sobrepõem-se. Ordem de precedência:

1. `~/.local/share/omarchy/default/bash/aliases` (base)
2. `~/.local/share/omarchy/default/bash/envs`
3. `~/.local/share/omarchy/default/bash/fns/*`
4. `~/.aliases` (overrides pessoais — têm prioridade)

Nota: `unalias ga` no zshrc é intencional — o Omarchy define `ga()` como função para
worktrees e o snippet OMZ::git criava conflito.

### Aliases e funções pessoais relevantes

```bash
c         # clear (override do c='opencode' do Omarchy)
o         # opencode
t         # gestor rápido de sessões tmux
md        # abre ficheiro no Typora
teams()   # abre Microsoft Teams em janela Chromium isolada
open()    # override: .md→Typora, text→nvim, resto→xdg-open
ghelp()   # ajuda contextual git
sesh-sessions()  # selector Alt+S de sessões tmux
```

### Integrações shell

- `fzf` — fuzzy search (`Alt+S` para sessões sesh)
- `zoxide` — navegação inteligente (`z` / `zd`)
- `mise` — gestão de versões (node, ruby, php, java...)

## Ferramentas instaladas

| Ferramenta   | Comando | Notas |
|--------------|---------|-------|
| Neovim       | `nvim` / `n` | Editor principal |
| oh-my-posh   | — | Prompt, tema zen |
| fzf          | `ff` | Fuzzy finder |
| zoxide       | `z` / `zd` | cd inteligente |
| mise         | — | Versões de linguagens |
| sesh         | — | Gestor sessões tmux |
| bat          | — | cat com highlight (tema: ansi) |
| eza          | `ls` | ls moderno com ícones |
| unison       | — | Sync Logseq/Obsidian ↔ Dropbox |
| Typora       | `md` | Editor Markdown visual |
| opencode     | `o` | AI CLI principal |
| lazygit      | — | Git TUI |
| stow         | — | Gestão dotfiles via symlinks |

## Omarchy: comandos úteis

```bash
omarchy-update              # actualizar o Omarchy
omarchy-pkg-add <pkg>       # instalar pacote (pacman + AUR)
omarchy-refresh-config <f>  # repor config default de um componente
omarchy-theme-*             # gestão de temas
```

## Convenções de código (Omarchy/bash)

- 2 espaços de indentação, sem tabs
- `[[ ]]` para testes de string/ficheiro, `(( ))` para numérico
- Shebang sempre `#!/bin/bash`
- Comandos Omarchy começam com `omarchy-`

## Config específica por máquina

Ficheiro `~/.zshrc.local` (gitignored) para:
- SSH keys e agentes
- Proxies corporativos
- Paths locais específicos
- Qualquer config que não deva ir para o repo
