# hypr-viarchy

Pacote Stow para ficheiros Hyprland específicos do `viarchy`.

Objetivo:
- `input.conf`
- `monitors.conf`

Quando estiveres no `viarchy`, copia a config atual para:

- `hypr-viarchy/.config/hypr/input.conf`
- `hypr-viarchy/.config/hypr/monitors.conf`

Depois aplica:

```bash
cd ~/dotfiles
stow hypr-common hypr-viarchy
```
