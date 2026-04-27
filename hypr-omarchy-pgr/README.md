# hypr-omarchy-pgr

Pacote Stow para ficheiros Hyprland específicos do `omarchy-pgr`.

Objetivo:
- `input.conf`
- `monitors.conf`

Quando estiveres no `omarchy-pgr`, copia a config atual para:

- `hypr-omarchy-pgr/.config/hypr/input.conf`
- `hypr-omarchy-pgr/.config/hypr/monitors.conf`

Depois aplica:

```bash
cd ~/dotfiles
stow hypr-common hypr-omarchy-pgr
```
