#!/bin/sh
#
# csvjson is from csvkit, installed through pip

INPUT='members.csv'
OUTPUT='located_members.json'

tail -n +2 "${INPUT}" | \
    sed '1s/^/name,residence\n/' | \
    csvjson > \
    "${OUTPUT}"

#tail -n +4 "${INPUT}" | \
#    sed '1s/^/name,municipality\n/' | \
#    grep -v ',$' | \
#    csvjson > \
#    "${OUTPUT}"
