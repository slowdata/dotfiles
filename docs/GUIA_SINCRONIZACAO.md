# Guia de sincronização dos dotfiles

Guia prático para manter `ossoarchy`, `viarchy` e `omarchy-pgr` sincronizados sem partir configurações específicas de cada máquina.

---

## Princípios

### 1. Fonte de verdade
A fonte de verdade é sempre o repositório:

```bash
~/dotfiles
```

Alterações que queres propagar para outras máquinas devem ser feitas **dentro do repo** e depois publicadas com:

```bash
git add ...
git commit -m "..."
git push
```

Depois, nas outras máquinas:

```bash
cd ~/dotfiles
git pull
```

---

### 2. Regra de ouro
Antes de alterar uma máquina, distingue sempre:

- **config global** → deve entrar nos dotfiles
- **config específica da máquina** → deve ficar só em `hypr-<hostname>` ou em ficheiros locais não versionados

---

## Estrutura atual

### Pacotes globais
- `zsh/`
- `tmux/`
- `ghostty/`
- `ohmyposh/`
- `localbin/`
- `pi/`
- `hypr-common/`

### Pacotes Hyprland por máquina
- `hypr-ossoarchy/`
- `hypr-viarchy/`
- `hypr-omarchy-pgr/`

### O que é comum em Hyprland
Fica em `hypr-common/`:
- `hyprland.conf`
- `bindings.conf`
- `looknfeel.conf`
- `autostart.conf`
- `hypridle.conf`
- `hyprlock.conf`
- `hyprsunset.conf`
- `xdph.conf`

### O que é específico da máquina
Fica em `hypr-<hostname>/`:
- `input.conf`
- `monitors.conf`

---

## Fluxo normal: alterar algo global

Exemplo: atalhos Hypr, tmux, zsh, scripts em `~/.local/bin`.

### Na máquina onde fazes a alteração
```bash
cd ~/dotfiles
# editar ficheiros no repo

git add ...
git commit -m "..."
git push
```

### Nas outras máquinas
```bash
cd ~/dotfiles
git pull
stow tmux zsh localbin
```

Se a alteração incluir Hyprland comum:
```bash
cd ~/dotfiles
git pull
dotfiles-stow-hypr
```

> Nota: normalmente não é preciso re-stow tudo após `git pull`, mas é seguro quando adicionaste pacotes novos ou mudaste a estrutura.

---

## Fluxo normal: alterar algo específico de uma máquina

Exemplo: monitor layout ou teclado/input de uma máquina.

### 1. Descobrir o hostname
```bash
hostname
```

### 2. Editar o pacote correto
Exemplo para `viarchy`:

```bash
~/dotfiles/hypr-viarchy/.config/hypr/input.conf
~/dotfiles/hypr-viarchy/.config/hypr/monitors.conf
```

### 3. Commit e push
```bash
cd ~/dotfiles
git add hypr-viarchy
git commit -m "feat(hypr): update viarchy machine config"
git push
```

### 4. Nas outras máquinas
As outras máquinas só fazem `git pull`. Não precisam aplicar o pacote `hypr-viarchy`, porque não é o delas.

---

## Migrar Hyprland de uma máquina para os dotfiles

Usar quando uma máquina ainda tem ficheiros normais em `~/.config/hypr/` em vez de symlinks para o repo.

### 1. Guardar a config específica da máquina no repo
Exemplo para `viarchy`:

```bash
mkdir -p ~/dotfiles/hypr-viarchy/.config/hypr
cp ~/.config/hypr/input.conf ~/dotfiles/hypr-viarchy/.config/hypr/input.conf
cp ~/.config/hypr/monitors.conf ~/dotfiles/hypr-viarchy/.config/hypr/monitors.conf
```

### 2. Fazer backup local
```bash
mkdir -p ~/.config/hypr.backup
cp -a ~/.config/hypr/. ~/.config/hypr.backup/
```

### 3. Remover os ficheiros que vão passar a ser geridos por Stow
```bash
rm -f ~/.config/hypr/hyprland.conf \
      ~/.config/hypr/bindings.conf \
      ~/.config/hypr/looknfeel.conf \
      ~/.config/hypr/autostart.conf \
      ~/.config/hypr/hypridle.conf \
      ~/.config/hypr/hyprlock.conf \
      ~/.config/hypr/hyprsunset.conf \
      ~/.config/hypr/xdph.conf \
      ~/.config/hypr/input.conf \
      ~/.config/hypr/monitors.conf
```

### 4. Aplicar Stow
```bash
cd ~/dotfiles
stow hypr-common hypr-$(hostname)
```

ou:

```bash
cd ~/dotfiles
dotfiles-stow-hypr
```

### 5. Garantir diretoria de toggles do Omarchy
Isto evita erro no reload se a pasta estiver vazia/inexistente:

```bash
mkdir -p ~/.local/state/omarchy/toggles/hypr
touch ~/.local/state/omarchy/toggles/hypr/00-empty.conf
```

### 6. Recarregar Hyprland
Dentro da sessão gráfica:

```bash
hyprctl reload
```

Se der:

```text
HYPRLAND_INSTANCE_SIGNATURE not set!
```

quer apenas dizer que não estás dentro da sessão Hyprland.

---

## Scripts em `localbin/`

Scripts globais devem viver em:

```bash
~/dotfiles/localbin/.local/bin/
```

Exemplos atuais:
- `gravar-reuniao`
- `transcrever-reuniao`
- `dotfiles-stow-hypr`
- scripts Todoist

### Se uma máquina tiver um script local antigo
Fazer backup e trocar por symlink do repo:

```bash
mv ~/.local/bin/gravar-reuniao ~/.local/bin/gravar-reuniao.bak 2>/dev/null || true
mv ~/.local/bin/transcrever-reuniao ~/.local/bin/transcrever-reuniao.bak 2>/dev/null || true

cd ~/dotfiles
stow localbin
```

### Verificar
```bash
ls -l ~/.local/bin/gravar-reuniao ~/.local/bin/transcrever-reuniao
```

---

## Quando `git pull` falha

### Caso 1: alterações locais tracked
Exemplo:

```text
error: cannot pull with rebase: You have unstaged changes.
```

Primeiro ver o que mudou:

```bash
git status --short
git diff -- <ficheiro>
```

Depois decidir:

#### A. Quero manter e propagar
```bash
git add ...
git commit -m "..."
git push
```

#### B. Não quero decidir já
```bash
git stash push -u -m "tmp before pull"
git pull
```

#### C. É só ruído local
```bash
git restore <ficheiro>
```

---

### Caso 2: push rejeitado no estilo “fetch first”
Exemplo:

```text
! [rejected] main -> main (fetch first)
```

Resolver com:

```bash
git pull --rebase
git push
```

---

## Checklist rápido por máquina

### `ossoarchy`
```bash
cd ~/dotfiles
git pull
stow tmux zsh localbin
dotfiles-stow-hypr
```

### `viarchy`
```bash
cd ~/dotfiles
git pull
stow tmux zsh localbin
dotfiles-stow-hypr
```

### `omarchy-pgr`
```bash
cd ~/dotfiles
git pull
stow tmux zsh localbin
dotfiles-stow-hypr
```

> O `dotfiles-stow-hypr` aplica automaticamente `hypr-common` + `hypr-<hostname>`.

---

## Verificações úteis

### Repo limpo
```bash
git -C ~/dotfiles status --short
```

### Scripts em symlink
```bash
ls -l ~/.local/bin/gravar-reuniao ~/.local/bin/transcrever-reuniao
```

### Hypr ligado ao repo
```bash
ls -l ~/.config/hypr
```

O esperado:
- ficheiros comuns → `hypr-common`
- `input.conf` e `monitors.conf` → `hypr-<hostname>`

---

## O que não deve entrar nos dotfiles sem pensar

Exemplos típicos:
- `pi/.pi/agent/settings.json`
- ficheiros de sessão/runtime/cache
- segredos/tokens
- ajustes muito específicos de uma máquina que não queres replicar

Regra prática:
- se queres em todas as máquinas → repo
- se depende da máquina → `hypr-<hostname>` ou `~/.zshrc.local`
- se é runtime/state → não versionar

---

## Estado atual esperado

### `ossoarchy`
- usa `hypr-common` + `hypr-ossoarchy`
- scripts de reuniões via `localbin`

### `viarchy`
- usa `hypr-common` + `hypr-viarchy`
- scripts de reuniões via `localbin`

### `omarchy-pgr`
- usa `hypr-common` + `hypr-omarchy-pgr`
- scripts de reuniões via `localbin`

---

## Regra final
Quando houver dúvida:

1. ver `git status`
2. perceber se a alteração é global ou específica da máquina
3. só depois commit/push

Mais vale um `stash` temporário do que misturar mudanças sem querer.
