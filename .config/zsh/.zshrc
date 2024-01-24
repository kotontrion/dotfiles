
. $ZDOTDIR/.zshalias

zstyle ":completion:*" sort false
zstyle ":completion:*" list-colors "${LS_COLORS}"
zstyle ":completion:*" menu select
zstyle ":completion:*" special-dirs true
zstyle ":completion:*" ignored-patterns
zstyle ":completion:*" completer _complete
zstyle ":completion:*:*:kill:*:processes" list-colors "=(#b) #([0-9]#) ([0-9a-z-]#)*=01;34=0=01"
zstyle ":completion:*:*:*:*:processes" command "ps -u "$USER" -o pid,user,cmd -w -w"
zstyle ":completion:*" matcher-list "m:{a-zA-Z}={A-Za-z}" "r:|=*" "l:|=* r:|=*"
_comp_options+=(globdots)

setopt completealiases

autoload -Uz compinit
compinit

HISTFILE=$ZDOTDIR/.zsh_history
HISTSIZE=1000
SAVEHIST=1000
setopt autocd nobeep
bindkey -e

typeset -A ZSH_HIGHLIGHT_STYLES
ZSH_HIGHLIGHT_STYLES[suffix-alias]=fg=blue,underline
ZSH_HIGHLIGHT_STYLES[precommand]=fg=blue,underline
ZSH_HIGHLIGHT_STYLES[arg0]=fg=blue

source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

eval "$(starship init zsh)"

if [ "$(fgconsole 2>/dev/null || echo -1)" -eq 1 ]; then
    exec Hyprland
fi


