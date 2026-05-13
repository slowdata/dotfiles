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
Fica em `hypr-common/`, mas **apenas quando é override teu real**.

Exemplo típico:
- `bindings.conf`

### O que é específico da máquina
Fica em `hypr-<hostname>/`, mas **apenas quando é override teu real**.

Exemplos típicos:
- `input.conf`
- `monitors.conf`

### O que não vai para o repo
Os defaults do Omarchy ficam fora do repo e vêm de:

```bash
~/.local/share/omarchy/config/hypr/
```

Esses ficheiros só devem ser versionados se tiverem personalização tua real.

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
> O `dotfiles-stow-hypr` é o caminho preferido porque também repara symlinks Hypr antigos/partidos para defaults do Omarchy.

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

Usar quando queres passar para o modelo correto:

- defaults do Omarchy fora do repo
- só overrides pessoais dentro do repo

### 1. Identificar o que é mesmo teu
Normalmente:
- `bindings.conf` → se tens atalhos teus
- `input.conf` → se tens layout/teclado teu
- `monitors.conf` → se tens layout de monitores teu

### 2. Fazer backup local
```bash
mkdir -p ~/.config/hypr.backup
cp -a ~/.config/hypr/. ~/.config/hypr.backup/
```

### 3. Repor defaults do Omarchy nos ficheiros base
Exemplo:

```bash
cp ~/.local/share/omarchy/config/hypr/hyprland.conf ~/.config/hypr/hyprland.conf
cp ~/.local/share/omarchy/config/hypr/looknfeel.conf ~/.config/hypr/looknfeel.conf
cp ~/.local/share/omarchy/config/hypr/hypridle.conf ~/.config/hypr/hypridle.conf
cp ~/.local/share/omarchy/config/hypr/hyprlock.conf ~/.config/hypr/hyprlock.conf
cp ~/.local/share/omarchy/config/hypr/hyprsunset.conf ~/.config/hypr/hyprsunset.conf
cp ~/.local/share/omarchy/config/hypr/xdph.conf ~/.config/hypr/xdph.conf
cp ~/.local/share/omarchy/config/hypr/autostart.conf ~/.config/hypr/autostart.conf
```

### 4. Deixar nos dotfiles só os overrides reais
Exemplo:
- `hypr-common/.config/hypr/bindings.conf`
- `hypr-<hostname>/.config/hypr/input.conf`
- `hypr-<hostname>/.config/hypr/monitors.conf` (apenas se houver customização real)

### 5. Aplicar Stow só para esses overrides
```bash
cd ~/dotfiles
dotfiles-stow-hypr
```

### 6. Garantir diretoria de toggles do Omarchy
```bash
mkdir -p ~/.local/state/omarchy/toggles/hypr
touch ~/.local/state/omarchy/toggles/hypr/00-empty.conf
```

### 7. Recarregar Hyprland
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

### Caso 3: depois do `git pull` o Hypr fica sem tema / barra / layout / teclado
Isto costuma indicar que havia symlinks antigos em `~/.config/hypr/` para ficheiros que entretanto saíram do repo.

Resolver com:

```bash
cd ~/dotfiles
dotfiles-stow-hypr
```

O helper faz duas coisas:
1. repara symlinks Hypr partidos que apontavam para `~/dotfiles/hypr-*`, restaurando os defaults correspondentes do Omarchy
2. volta a aplicar `hypr-common` + `hypr-$(hostname)`

Se ainda houver sessão gráfica estranha após isso, reaplica o tema atual:

```bash
omarchy theme set "$(omarchy theme current)"
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

> O `dotfiles-stow-hypr` aplica automaticamente `hypr-common` + `hypr-<hostname>` e tenta reparar symlinks Hypr antigos/partidos.
> Se tiver havido uma mudança estrutural no repo, usa este helper em vez de `stow hypr-common hypr-$(hostname)`.

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

### Hypr no estado esperado
```bash
ls -l ~/.config/hypr
```

O esperado:
- ficheiros base/default → ficheiros normais em `~/.config/hypr/`
- overrides globais → symlink para `hypr-common`
- overrides específicos → symlink para `hypr-<hostname>`

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
- defaults base vindos do Omarchy
- overrides via `hypr-common` + `hypr-ossoarchy`
- scripts de reuniões via `localbin`

### `viarchy`
- defaults base vindos do Omarchy
- overrides via `hypr-common` + `hypr-viarchy`
- scripts de reuniões via `localbin`

### `omarchy-pgr`
- defaults base vindos do Omarchy
- overrides via `hypr-common` + `hypr-omarchy-pgr`
- scripts de reuniões via `localbin`

---

## Regra final
Quando houver dúvida:

1. ver `git status`
2. perceber se a alteração é global ou específica da máquina
3. só depois commit/push

Mais vale um `stash` temporário do que misturar mudanças sem querer.
