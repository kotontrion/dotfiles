### dotfiles
my personal dotfiles, use at your own risk.
These files are always evolving, there are currently a few issues with them, which probably will be fixed eventually.

### showcase ( as of 2024-01-03 )


https://github.com/kotontrion/dotfiles/assets/141950090/f3d7dfbc-b228-47cb-a29a-290d819050d8



### Notes
This branch includes a version of highlight.js in the .config/ags/modules directory, which was modified to work with gjs.

### Dependencies
this list is probably incomplete.
- Hyprland
- [ags](https://github.com/Aylur/ags): you need the git version, install all of its optional dependencies too
- dart-sass: needed to compile the scss files
- webkit2gtk-4.1: needed for the rendering of the ChatGPT answers
- sptlrx: needed for the synced lyrics in the side bar
- vte3: needed to display sptlrx
- cava
- swaylock effects
- eza
- zsh-autosuggestion
- zsh-syntax-highlighting

- GTK-theme:  Catppuccin
- Icon-theme: MoreWaita
- Font:       Cascadia Code NF

### Usage
the following commands assume you have placed the files their correct location
```bash
# setup ags
cd .config/ags
ags -c ~/.config/ags/config.js --init 
npm install
cp keys.template.js keys.js
#edit keys.js to your needs
```

#### special thanks
- [Aylur](https://www.github.com/Aylur) for making ags and his config
- [end-4](https://www.github.com/end-4) for the awesome config, which inspired parts of mine (i also stole some parts of it)
