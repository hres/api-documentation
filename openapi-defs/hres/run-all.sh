#!/bin/bash

# /home/alex/dev/api-tools/packages/cli/cli.js test --help
LOCATION=$1

if [[ -z "$LOCATION" ]]; then
  echo "Need to provide a location"
  exit 1
fi

DATE=$(date -I)
EXEC=/home/alex/dev/api-tools/packages/cli/cli.js

declare -a APIS=("cnf" "cta" "cvp" "dpd" "lnhpd" "mdall" "noc" "sr")

for API in "${APIS[@]}"; do
   $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/avg --average 10 --format file -F

   $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/50 --vus 50 --duration 1m --format file -F

   $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/100 --vus 100 --duration 1m --format file -F

   $EXEC test -s tests/$API/**/*.test.js -o tests/$API/$LOCATION/$DATE/200 --vus 200 --duration 1m --format file -F
done