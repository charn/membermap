#!/usr/bin/sh

INPUT='kuntarajat/TietoaKuntajaosta_2015_4500k/SuomenKuntajako_2015_4500k.xml'
OUTPUT='kuntarajat.geojson'

[ -f "${OUTPUT}" ] && rm "${OUTPUT}"
ogr2ogr -f 'GeoJSON' -s_srs EPSG:3067 -t_srs EPSG:4326 "${OUTPUT}" "${INPUT}"
