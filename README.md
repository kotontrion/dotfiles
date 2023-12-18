### dotfiles
my personal dotfiles, use at your own risk.
These files are always evolving, there are currently a few issues with them, which probably will be fixed eventually.

### showcase ( as of 2023-12-18 )

https://github.com/kotontrion/dotfiles/assets/141950090/1f3b9f4c-1836-4530-9597-9d68792b9641


### Notes
This branch includes a version of highlight.js in the modules directory, which was modified to work with gjs.

### Dependencies
this list is probably incomplete, I won't list themes here.
- Hyprland
- ags (install all of its optional dependencies too)
- sassc

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
- [Aylur](https://www.github.com/Aylur) for making ags
- [end-4](https://www.github.com/end-4) for the awesome config, which inspired parts of mine (i also stole some parts of it)
