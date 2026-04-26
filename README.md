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
├── ohmyposh/
│   └── .config/ohmyposh/           # Tema zen do oh-my-posh
├── pi/
│   └── .pi/agent/
│       ├── AGENTS.md               # Contexto global (máquinas, SSH, etc.)
│       └── skills/omarchy/         # Skill omarchy para o pi
├── localbin/
│   └── .local/bin/
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

### Primeira vez

```bash
# 1. Clonar o repositório
git clone git@github.com:slowdata/dotfiles.git ~/dotfiles
cd ~/dotfiles

# 2. Aplicar com stow (cria symlinks em ~)
stow ghostty ohmyposh tmux zsh pi localbin

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
# Os symlinks já apontam para os ficheiros actualizados — não é necessário re-fazer stow.
```

### Adicionar/alterar config

1. Editar o ficheiro **dentro de `~/dotfiles/`** (não em `~` directamente)
2. `git add`, `git commit`, `git push`
3. Nas outras máquinas: `git pull`

---

## Estado actual por máquina

| Máquina       | Stow aplicado | Actualizado |
|---------------|:-------------:|:-----------:|
| `ossoarchy`   | ✅ Sim        | ✅ Sim      |
| `viarchy`     | ?             | ?           |
| `omarchy-pgr` | ?             | ?           |

> **ossoarchy** tem os ficheiros como cópias directas (não symlinks). Precisa de
> apagar os ficheiros actuais e correr `stow` para ficar em sincronia com o repo.

---

## Terminal: Ghostty (principal)

Ghostty é o terminal primário. A ideia é usá-lo **em substituição do tmux** para uso
diário, tirando partido dos splits nativos.

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
- Quando se quer a barra de status Catppuccin com informação de sessão

### Config relevante

- **Prefix:** `Ctrl+S`
- **Splits:** `prefix + |` (vertical) · `prefix + -` (horizontal)
- **Navegação panes:** `prefix + h/j/k/l`
- **Tema:** Catppuccin (via plugin `catppuccin/tmux`)
- **Gestor de sessões:** `sesh` com selector fzf (`Alt+S` no zsh)

### Função rápida `t`

```bash
t           # abre/retoma sessão "main"
t nome      # abre/retoma sessão com nome
t .         # usa o nome da pasta actual como sessão
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
| `sesh`       | Gestor de sessões tmux com fzf             |
| `bat`        | cat com syntax highlight (tema: ansi)      |
| `unison`     | Sync bidirecional Sync↔Dropbox             |
| `typora`     | Editor Markdown visual                     |
| `opencode`   | AI CLI (alias `o`)                         |
| `stow`       | Gestão de dotfiles via symlinks            |
| `todoist-add`| Criar tarefas na Todoist via API REST      |

---

## wezterm (Windows/WSL)

Config mantida no repo para uso no workstation Windows com WSL Ubuntu.
Não é usada nas máquinas Linux.

---

## Todoist helper

Script incluído em `~/.local/bin/todoist-add` (via pacote `localbin/`).

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
```

---

## TODO / Pendente

- [ ] Aplicar stow em **ossoarchy** (apagar ficheiros locais, correr `stow`)
- [ ] Verificar estado de stow em **viarchy** e **omarchy-pgr**
- [ ] Avaliar solução de persistência para Ghostty (alternativa ao tmux)
- [ ] Considerar script `install.sh` para automatizar setup em máquina nova
