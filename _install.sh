#!/usr/bin/env bash
replace="@"
SRC=$1
LINE=$2
UUID=$(echo $LINE | sed "s#012345678901234567890123456789#$replace#g")
EXT="$HOME/.local/share/gnome-shell/extensions"
echo "\n\nGNOME extensions : $EXT"
echo "UUID : $UUID"
echo "SRC  : $SRC"
echo "installing to $EXT/$UUID\n\n"
mkdir -p "$EXT/$UUID" 2>/dev/null
cd "$EXT/$UUID"
unzip "$SRC/bin/$UUID"
rm gschemas.compiled
sh compile.sh
echo "\nPlease restart GNOME shell (Alt-F2, r)\n"
