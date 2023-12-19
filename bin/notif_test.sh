#!/bin/bash

icons=(face-angel face-angry face-cool face-crying face-devilish face-embarrassed face-kiss face-laugh face-monkey face-plain face-raspberry face-sad face-sick face-smile face-smile-big face-smirk face-surprise face-tired face-uncertain face-wink face-worried)

nid=$(notify-send -h string:synchronous:test-progress "Progress ${number}%" "showing ${icon}" -p)
seq 100 | while read number
do
  icon=${icons[$RANDOM % ${#icons[@]}]};
  nid=$(notify-send --replace-id=$nid -i $icon -h int:value:$number -h string:synchronous:test-progress "Progress ${number}%" "showing ${icon}" -p)
  sleep 0.1
done
