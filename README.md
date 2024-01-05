### dotfiles
my personal dotfiles, use at your own risk.
These files are always evolving, there are currently a few issues with them, which probably will be fixed eventually.

### showcase ( as of 2024-01-03 )


https://github.com/kotontrion/dotfiles/assets/141950090/f3d7dfbc-b228-47cb-a29a-290d819050d8



### Notes
This branch includes a version of highlight.js in the .config/ags/modules directory, which was modified to work with gjs.

### Dependencies
this list is probably incomplete, I won't list themes here.
- Hyprland
- [ags](https://github.com/Aylur/ags): you need the git version, install all of its optional dependencies too
- dart-sass: needed to compile the scss files
- webkit2gtk-4.1: needed for the rendering of the ChatGPT answers
- sptlrx: needed for the synced lyrics in the side bar
- vte3: needed to display sptlrx
- Nerdfont

### Usage
the following commands assume you have placed the files their correct location
```bash
cd .config/ags

#generate types for the ags config (optional) and installs npm dependencies. (This will not work if you haven't put the files into  ~/.config/ags)
./setup.sh
#if you don't want the types do this instead (setup.sh will do this for you)
npm install

#setup variables
cp keys.template.js keys.js
#edit keys.js to your needs
```

#### special thanks
- [Aylur](https://www.github.com/Aylur) for making ags and his config
- [end-4](https://www.github.com/end-4) for the awesome config, which inspired parts of mine (i also stole some parts of it)
