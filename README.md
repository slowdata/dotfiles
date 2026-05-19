# dotfiles · slowdata

Dotfiles pessoais geridos com [GNU Stow](https://www.gnu.org/software/stow/).
Desenhados para correr em **Linux (Omarchy/Arch)** de forma idêntica em todas as máquinas.

---

## Máquinas

| Hostname      | Tipo                         | OS             |
|---------------|------------------------------|----------------|
| `ossoarchy`   | PC pessoal (casa)            | Omarchy (Arch) |
| `viarchy`     | Portátil trabalho            | Omarchy (Arch) |
| `omarchy-pgr` | Workstation trabalho         | Omarchy (Arch) |
| *(sem nome)*  | Workstation trabalho Windows | Windows 11     |

> Cada máquina pode ter um ficheiro `~/.zshrc.local` para configuração específica
> (SSH keys, paths locais, proxies, etc.). Este ficheiro está no `.gitignore` e
> **nunca deve ser versionado**.

---

## Repositório

```
git@github.com:slowdata/dotfiles.git
```

- **Branch principal:** `main` — sempre o mais atualizado
- Branch `cleanup-2026-01` existe mas está atrás do `main` (já incorporado)

---

## Estrutura

```
dotfiles/
├── ghostty/
│   └── .config/ghostty/config      # Config do terminal principal
├── foot/
│   └── .config/foot/foot.ini       # Config do foot + shell integration
├── hypr-common/
│   └── .config/hypr/               # Apenas overrides pessoais globais (ex: bindings)
├── hypr-ossoarchy/
│   └── .config/hypr/               # Overrides específicos do ossoarchy
├── hypr-viarchy/
│   └── .config/hypr/               # Overrides específicos do viarchy
├── hypr-omarchy-pgr/
│   └── .config/hypr/               # Overrides específicos do omarchy-pgr
├── ohmyposh/
│   └── .config/ohmyposh/           # Tema zen do oh-my-posh
├── pi/
│   └── .pi/agent/
│       ├── AGENTS.md               # Contexto global (máquinas, SSH, etc.)
│       └── skills/omarchy/         # Skill omarchy para o pi
├── localbin/
│   └── .local/bin/
│       ├── dotfiles-terminal       # Launcher terminal Hypr/Omarchy com fallback XDG
│       └── todoist-add             # Helper CLI para criar tarefas via API Todoist
├── tmux/
│   └── .config/tmux/tmux.conf     # Config tmux (uso secundário)
├── wezterm/
│   └── wezterm.lua                 # Config wezterm (Windows/WSL)
├── zsh/
│   ├── .zshrc                      # Config principal do zsh
│   └── .aliases                    # Aliases e funções pessoais
├── _quarantine/                    # Configs antigas / referência
└── README.md
```

O Stow mapeia cada pasta para `$HOME`, respeitando a estrutura interna.
Exemplo: `ghostty/.config/ghostty/config` → `~/.config/ghostty/config`

---

## Instalar / Actualizar numa máquina

> Guia operativo detalhado: ver `docs/GUIA_SINCRONIZACAO.md`


### Primeira vez

```bash
# 1. Clonar o repositório
git clone git@github.com:slowdata/dotfiles.git ~/dotfiles
cd ~/dotfiles

# 2. Aplicar com stow (cria symlinks em ~)
stow ghostty foot ohmyposh tmux zsh pi localbin

# 2b. Hyprland / Omarchy
stow hypr-common hypr-$(hostname)

# 3. (Opcional) wezterm — só em Windows/WSL
stow wezterm

# 4. Criar config local da máquina se necessário
touch ~/.zshrc.local
```

> **Atenção:** se já existirem ficheiros (não symlinks) nos destinos, o stow vai dar
> conflito. Apaga ou faz backup primeiro:
> ```bash
> rm ~/.zshrc ~/.aliases ~/.tmux.conf
> rm -rf ~/.config/ghostty ~/.config/ohmyposh
> ```

### Actualizar após `git pull`

```bash
cd ~/dotfiles
git pull
# Re-aplica os overrides Hypr da máquina atual.
# O helper também repara symlinks Hypr antigos/partidos para defaults do Omarchy.
dotfiles-stow-hypr
```

### Adicionar/alterar config

1. Editar o ficheiro **dentro de `~/dotfiles/`** (não em `~` directamente)
2. `git add`, `git commit`, `git push`
3. Nas outras máquinas: `git pull`
4. Se a alteração for de Hyprland e envolver novo pacote específico por máquina: `dotfiles-stow-hypr`

---

## Hyprland / Omarchy

A regra atual é:

- **defaults do Omarchy ficam fora do repo**
- **dotfiles guardam apenas overrides pessoais**

Isto evita drift e conflitos com updates do Omarchy.

### Como funciona

- `~/.local/share/omarchy/config/hypr/` → template/default atual do Omarchy
- `~/.config/hypr/` → config live da máquina
- `~/dotfiles/hypr-common/` → apenas overrides globais teus
- `~/dotfiles/hypr-<hostname>/` → apenas overrides específicos da máquina

### Regra prática

- **não versionar** no repo ficheiros que são apenas cópia dos defaults do Omarchy
- sincronizar globalmente apenas overrides reais (ex: `bindings.conf`)
- manter por máquina apenas o que é realmente específico (ex: `input.conf`, `monitors.conf` quando necessário)

### Aplicar numa máquina

```bash
cd ~/dotfiles
stow hypr-common hypr-$(hostname)
# ou (preferível)
dotfiles-stow-hypr
```

### Se quiseres repor defaults da última atualização do Omarchy

```bash
cp ~/.local/share/omarchy/config/hypr/<ficheiro>.conf ~/.config/hypr/<ficheiro>.conf
```

Ou usar os comandos `omarchy-refresh-*` / `omarchy-refresh-config` quando apropriado.

## Estado actual por máquina

| Máquina       | Hypr via Stow | Scripts `localbin` | Observações |
|---------------|:-------------:|:------------------:|-------------|
| `ossoarchy`   | ✅ Sim        | ✅ Sim             | usa `hypr-ossoarchy` |
| `viarchy`     | ✅ Sim        | ✅ Sim             | usa `hypr-viarchy` |
| `omarchy-pgr` | ✅ Sim        | ✅ Sim             | usa `hypr-omarchy-pgr` |

---

## Terminal launcher: `dotfiles-terminal`

O `Super+Enter` do Hyprland chama `dotfiles-terminal` em vez de hardcoding um
terminal específico.

Fluxo:
- a preferência continua a ser gerida pelo Omarchy via `omarchy default terminal`
- por baixo, esse comando escreve `~/.config/xdg-terminals.list`
- se o terminal preferido for `foot.desktop`, o wrapper usa `footclient -N` com
  o socket systemd (`$XDG_RUNTIME_DIR/foot.sock`) para arranque rápido
- como o `foot --server` não recarrega `foot.ini`, o wrapper injeta as cores do
  tema Omarchy actual como overrides em cada nova janela Foot
- se mudares para outro terminal, o wrapper cai automaticamente para
  `xdg-terminal-exec`

Mudar terminal depois:

```bash
omarchy default terminal foot
omarchy default terminal ghostty
omarchy default terminal kitty
omarchy default terminal alacritty
```

Para Foot em modo servidor, activar uma vez por máquina:

```bash
systemctl --user enable --now foot-server.socket
```

---

## Terminal: Ghostty (alternativo)

Ghostty continua configurado e pode voltar a ser o terminal preferido com
`omarchy default terminal ghostty`. A ideia original era usá-lo **em substituição
do tmux** para uso diário, tirando partido dos splits nativos.

### Filosofia actual

- **Splits verticais e horizontais** para múltiplos painéis (como tmux, mas nativo)
- Sem barra de título (titlebar desactivada) — interface limpa
- Tema dinâmico via Omarchy: `config-file = ?"~/.config/omarchy/current/theme/ghostty.conf"`

### Atalhos configurados

| Atalho                              | Acção                        |
|-------------------------------------|------------------------------|
| `Shift+Insert`                      | Colar da clipboard           |
| `Ctrl+Insert`                       | Copiar para clipboard        |
| `Super+Ctrl+Shift+Alt+↑/↓/←/→`     | Redimensionar split          |

### Limitação conhecida

O Ghostty **não tem persistência de sessão** (ao contrário do tmux).
Workaround actual: ferramentas de AI CLI (opencode, etc.) que mantêm algum contexto.
Para sessões que precisem mesmo de persistência → usar tmux.

---

## Terminal: tmux (secundário)

Usado quando a persistência é crítica, principalmente:
- **Sessões SSH** em servidores remotos
- Tasks longas em background
- Quando se quer persistência para sessões/projetos

### Config relevante

- **Config tmux:** workflow pessoal do Dias, não substituir pelo default Omarchy
- **Prefix:** `Ctrl+S`
- **Prefix secundário:** desativado (`prefix2 None`) para `Ctrl+B` não interferir
- **Reload:** `Ctrl+Q` global ou `prefix + q`
- **Splits:** `prefix + |` (horizontal) · `prefix + -` (vertical)
- **Navegação panes:** `prefix + h/j/k/l` ou `Ctrl+Alt+setas`
- **Tema:** Omarchy dinâmico via `tmux-omarchy-theme`
- **Aliases:** `t`/`tmux` ficam nos defaults do Omarchy; não redefinir nos dotfiles
- **Gestor de sessões:** `sesh` com selector fzf (`Alt+S` no zsh)
- **Verificação:** `dotfiles-tmux-doctor`

### Função rápida `t`

```bash
t           # alias default do Omarchy: tmux attach || tmux new -s Work
Alt+S       # selector sesh/fzf, se `sesh` estiver instalado
```

---

## Shell: zsh

### Stack

- **Plugin manager:** [zinit](https://github.com/zdharma-continuum/zinit)
- **Prompt:** [oh-my-posh](https://ohmyposh.dev/) com tema `zen`
- **Plugins:** `zsh-syntax-highlighting`, `zsh-completions`, `zsh-autosuggestions`, `fzf-tab`
- **Snippets OMZ:** `sudo`, `command-not-found`
  - `git` e `ubuntu` removidos intencionalmente (conflitos com Omarchy)

### Relação com Omarchy

O Omarchy fornece aliases, envs e funções base em bash (`~/.local/share/omarchy/default/bash/`).
O `.zshrc` carrega-os e depois aplica **overrides pessoais** via `~/.aliases`.

Ordem de precedência:
1. Omarchy aliases/envs/fns (base)
2. `~/.aliases` (overrides pessoais — têm prioridade)

Exemplo de override: `c='clear'` substitui o `c='opencode'` do Omarchy.

### Integrações

- `fzf` — fuzzy search no shell
- `zoxide` — navegação inteligente de directorias (`z`)
- `mise` — gestão de versões de linguagens (Node, Ruby, PHP, etc.)

### Config local por máquina

```bash
# ~/.zshrc.local (não versionado)
# Exemplos:
export DOCKER_HOST=...
source ~/.ssh/agent.sh
export HTTP_PROXY=...
export TODOIST_API_TOKEN=...
```

---

## Ferramentas instaladas (fora do Omarchy)

| Ferramenta   | Uso                                        |
|--------------|--------------------------------------------|
| `nvim`       | Editor principal                           |
| `oh-my-posh` | Prompt (tema zen)                          |
| `fzf`        | Fuzzy finder                               |
| `zoxide`     | cd inteligente                             |
| `mise`       | Gestão de versões (node, ruby, php…)       |
| `sesh`       | Gestor de sessões tmux com fzf (`yay -S sesh-bin`) |
| `bat`        | cat com syntax highlight (tema: ansi)      |
| `unison`     | Sync bidirecional Sync↔Dropbox             |
| `typora`     | Editor Markdown visual                     |
| `opencode`        | AI CLI (alias `o`)                         |
| `stow`            | Gestão de dotfiles via symlinks            |
| `todoist-add`     | Criar tarefas na Todoist via API REST      |
| `todoist-list`    | Listar tarefas ativas / por filtro         |
| `todoist-today`   | Listar tarefas de hoje                     |
| `todoist-overdue` | Listar tarefas atrasadas                   |
| `todoist-urgent`  | Listar tarefas urgentes (today/overdue/p1) |
| `todoist-projects`| Listar projetos da Todoist                 |
| `todoist`         | Atalho principal para a TUI da Todoist     |
| `todoist-tui`     | TUI simples para navegar e gerir tarefas   |

---

## wezterm (Windows/WSL)

Config mantida no repo para uso no workstation Windows com WSL Ubuntu.
Não é usada nas máquinas Linux.

---

## Todoist helpers

Scripts incluídos em `~/.local/bin/` (via pacote `localbin/`).

### Configuração
Definir o token da API na config local da máquina:

```bash
export TODOIST_API_TOKEN="..."
```

Sugestão: guardar em `~/.zshrc.local`.

### Exemplos

```bash
todoist-add "Rever follow-up goAML/PROGEST em PROD" \
  --desc "Ver logs temporários, remover debug, apertar permissões e fechar documentação" \
  --due "in 1 week"

todoist-add "Preparar relatório semanal" --due "tomorrow" --priority 3

todoist-list
todoist-list --filter "today | overdue"
todoist-today
todoist-overdue
todoist-urgent
todoist-projects
todoist       # atalho principal
todoist-tui   # nome explícito
```

### `todoist` / `todoist-tui`

TUI simples em bash + gum, inspirada no `reunioes`, para:
- ver Hoje / Atrasadas / Esta semana / P1-P2 / Sem data / Inbox
- navegar por projeto
- aplicar filtro custom
- captura rápida via Quick Add
- adicionar tarefa detalhada
- concluir tarefa
- adiar / alterar data
- mudar prioridade
- ver detalhes

---

## TODO / Pendente

- [ ] Aplicar stow em **ossoarchy** (apagar ficheiros locais, correr `stow`)
- [ ] Verificar estado de stow em **viarchy** e **omarchy-pgr**
- [ ] Avaliar solução de persistência para Ghostty (alternativa ao tmux)
- [ ] Considerar script `install.sh` para automatizar setup em máquina nova
