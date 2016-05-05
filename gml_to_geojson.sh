#!/usr/bin/sh

INPUT='kuntarajat/TietoaKuntajaosta_2016_4500k/SuomenKuntajako_2016_4500k.dbf'
OUTPUT='kuntarajat.geojson'

[ -f "${OUTPUT}" ] && rm "${OUTPUT}"
ogr2ogr -f 'GeoJSON' -s_srs EPSG:3067 -t_srs EPSG:4326 "${OUTPUT}" "${INPUT}"
