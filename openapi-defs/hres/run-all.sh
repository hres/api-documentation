#!/bin/bash

# /home/alex/dev/api-tools/packages/cli/cli.js test --help
LOCATION=$1

if [[ -z "$LOCATION" ]]; then
  echo "Need to provide a location"
  exit 1
fi

DATE=$(date -I)
EXEC=/home/alex/dev/api-tools/packages/cli/cli.js

declare -a APIS=(\
# "dpd" \
# "lnhpd" \
# "mdall" \
# "cnf" \
# "cta" \
# "cvp" \
# "noc" \
"sr"\
)

declare -a FOLDERS=(\
"avg" \
# "1",
# "50",
# "200"
)

for API in "${APIS[@]}"; do
   $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/avg -f file -w 1 --average 10

  #  $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/1 --vus 1 --duration 1m --format file -F

  #  $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/50 --vus 50 --duration 1m --format file -F

  #  $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/100 --vus 100 --duration 1m --format file -F

  #  $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/200 --vus 200 --duration 1m --format file -F

  for FOLDER in "${FOLDERS[@]}"; do
    $EXEC report -s "tests/$API/$LOCATION/$DATE/*" -o tests/$API/$LOCATION/$DATE/report.json
  done;
done