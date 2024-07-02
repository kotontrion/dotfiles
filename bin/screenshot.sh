#!/bin/sh

. ~/.config/user-dirs.dirs

file="${XDG_SCREENSHOTS_DIR}/$(date -Ins).jpg"

case "$1" in

    screen) grim $file ;;
    output) slurp -o -r | grim -g - $file ;;
    area) slurp | grim -g - $file ;;
    output-area) slurp -o | grim -g - $file ;;

    *)  echo "invalid argument"
        notify-send -t 10000 --app-name "Screenshot" "Screenshot" "something went wrong."
        exit;;
esac

notify-send -t 10000 --app-name "Screenshot" "Screenshot" "saved as $file"
echo $file
