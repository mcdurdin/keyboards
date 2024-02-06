#!/usr/bin/env bash
# Prevents 'clear' on exit of mingw64 bash shell
SHLVL=0

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/resources/builder.inc.sh"
# END STANDARD BUILD SCRIPT INCLUDE

# script runs from repo root
cd "$THIS_SCRIPT_PATH"

. "./tools/jq.inc.sh"

ki=($(find release experimental -mindepth 3 -maxdepth 3 -name '*.keyboard_info'))
# echo ==================================================================

for kb in "${ki[@]}"; do
  kbdir=$(dirname $kb)
  base=$(basename $kb .keyboard_info)
  # font="$("JQ" '.languages | to_entries | .[].value.font? // null' $kb)"

  if [[ $base == fv_all ]]; then continue; fi
  exit_code=0
  value=$(node add-example-to-kps.js "$kb" "$kbdir/source/$base.kps") || exit_code=$?
  if [[ $exit_code -eq 99 ]]; then
    continue;
  fi

  echo -e "$COLOR_BLUE$base$COLOR_RESET"
  echo "$value"

  # if [[ "$font" == null ]]; then continue; fi


  # echo -e "$COLOR_GREY$font$COLOR_RESET"
  # md="$(echo "$description" | tr '\r\n' ' ' | pandoc --from=html --to=markdown | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  # echo "$md"
  echo -e "$COLOR_BLUE------------------------------------------------------------------------------------------------------------------------------------$COLOR_RESET"
  # node x.js "$kbdir/source/$base.kps" "$md"
  # break
done