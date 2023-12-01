#!/bin/sh

tmp_file="/tmp/qr.png"

slurp | grim -g - "$tmp_file"

scanresult=$(zbarimg --quiet --raw "$tmp_file" | tr -d '\n')

if [ -z "$scanresult" ]; then
    notify-send -t 10000 --app-name "QR-code" "QR-code" "No scan data found"
else
    wl-copy "$scanresult"
    convert $tmp_file -resize 75x75 "$tmp_file"
    notify-send -t 10000 -i "$tmp_file" --app-name "QR-Code" "QR-Code" "$scanresult"

fi

rm "$tmp_file"
