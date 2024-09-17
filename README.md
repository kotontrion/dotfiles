### dotfiles
my personal dotfiles, use at your own risk.
These files are always evolving, there are currently a few issues with them, which probably will be fixed eventually.

### showcase ( as of 2024-07-02 )

https://github.com/kotontrion/dotfiles/assets/141950090/9e1623b4-401f-432e-9d39-7134e9dc31dc


### Notes
This branch includes a version of highlight.js in the .config/ags/modules directory, which was modified to work with gjs.

### Dependencies
this list is probably incomplete.

<details>
  <summary>show dependency list</summary>
  
#### wm related
- Hyprland and River are supported
- GTK-theme:  adw-gtk3
- Icon-theme: MoreWaita
- Font:       Cascadia Code NF
- matugen for color generation (optional)


#### ags
- [ags](https://github.com/Aylur/ags): you need the git version, install all of its optional dependencies too
- dart-sass: needed to compile the scss files
- webkit2gtk-4.1: webview widget, needed for the rendering of the ChatGPT answers (optional)
- sptlrx: needed for the synced lyrics in the side bar (optional)
- vte3: terminal widget, needed for sptlrx display (optional)
- cava: audio visualizer (optional)
- brotab: firefox tab switcher (optional)
- [astal-river](https://github.com/astal-sh/river): for river status (optional)
- [astal-auth](https://github.com/astal-sh/auth): for the lockscreen
- gvfs: needed for the system monitor to work
- libgtop needed for the file manager to work

#### ags greeter
- greetd
- cage

#### ags lockscreen
- gtk-session-lock

#### zsh
- zsh
- starship
- eza (better ls, optional)
- bat (better cat, optional)
- zsh-autosuggestion
- zsh-syntax-highlighting

</details>

### Usage
the following commands assume you have placed the files their correct location
```bash
# setup ags
cd .config/ags
ags -c ~/.config/ags/config.js --init 
npm install
cp keys.template.js keys.js
#edit keys.js to your needs

# setup ags greetd
# copy .config/greetd to /etc/greetd
```

#### special thanks
- [Aylur](https://www.github.com/Aylur) for making ags and his config
- [end-4](https://www.github.com/end-4) for the awesome config, which inspired parts of mine (i also stole some parts of it)
