#!/bin/bash

if [ -z "$1" ]; then
    echo "No image supplied"
fi

declare -A colors

load_colors() {
  local json=$1
  keys=$(jq -r ".colors.dark | keys[]" <<< "$json")
  for key in $keys; do
    value=$(jq -r ".colors.dark[\"$key\"]" <<< "$json")
    colors["$key"]="$value"
  done
}


json=$(matugen -j strip image "$1")

load_colors "$json"

#set river colors
~/.config/river/colors.sh

#set gtk theme
gsettings set org.gnome.desktop.interface gtk-theme ""
gsettings set org.gnome.desktop.interface gtk-theme adw-gtk3
