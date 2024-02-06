
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
bindkey -v

typeset -A ZSH_HIGHLIGHT_STYLES
ZSH_HIGHLIGHT_STYLES[suffix-alias]=fg=blue,underline
ZSH_HIGHLIGHT_STYLES[precommand]=fg=blue,underline
ZSH_HIGHLIGHT_STYLES[arg0]=fg=blue

source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

eval "$(starship init zsh)"

function preexec {
  print -Pn "\e]0;${(q)1}\e\\"
}


function zle-keymap-select zle-line-init {
  case $KEYMAP in
      vicmd)      echo -ne "\e[1 q";;
      viins|main) echo -ne "\e[5 q";;
      *)          echo -ne "\e[3 q";;
  esac
  zle reset-prompt
  zle -R
}


zle -N zle-line-init
zle -N zle-keymap-select
