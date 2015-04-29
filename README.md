# membermap

Visualize the municipalities where the members of OKFFI reside.

## Dependencies

- POSIX utilities
- [gdal](http://www.gdal.org/)
- [csvkit](https://github.com/onyxfish/csvkit)
- node
- npm

## Data

- [List of OKFFI members](https://docs.google.com/spreadsheets/d/1EKGZ6_XRW51oElvgACeq7LfW0QuHWfpYQ67m0OVG5Qc/edit#gid=0)
- [Finnish municipality borders](http://kartat.kapsi.fi/files/kuntajako/kuntajako_4500k/etrs89) (or the complicated-to-download [official source](https://tiedostopalvelu.maanmittauslaitos.fi/tp/kartta))

## Publishing

### Clone the repository

```sh
git clone https://github.com/okffi/membermap
cd membermap
```

### Prepare the municipal boundaries

1. Download and extract the data into a specific directory.
  Peek into `gml_to_geojson.sh` for the path.
2. Run `./gml_to_geojson.sh` to transform the municipal boundaries from GML to GeoJSON and into the right spatial reference system.
3. Copy the transformed file into `leaflet/app/images/`.

### Prepare the member list

1. Download the data into a specific file.
  Peek into `member_csv_to_json.sh` for the filename.
2. Run `./member_csv_to_json.sh` to transform the CSV file into a JSON file.
3. Copy the transformed file into `leaflet/app/images/`.

### Build and publish the map

1. Run the following:
```sh
cd leaflet
npm install
bower install
node_modules/.bin/gulp
```
2. Publish the contents of `dist/`.
  The directory contains static files only.

### What should publishing look like?
```sh
git clone https://github.com/okffi/membermap
cd membermap
npm install
npm install -g gulp
bower install
gulp
./publish
```

## Note

- Only members with the domicile set to a name of a Finnish municipality, in Finnish or in Swedish, are counted.
    - This excludes members who live abroad.
    - This excludes members who made a typo.
    - This excludes members who put more specific location information into the field.
    - This excludes members who did not report their domicile at all.
- The total count of all OKFFI members, visible on clicking any municipality, includes all members regardless of domicile.
- Humans and legal entities, e.g. other NGOs, are not separated in the calculations.
- The coloring algorithm is quite ad-hoc.
  It is meant to visually separate where there are many, few or no members.
  The colors are not meant for reading absolute numbers or proportions.

## Todo

- Here are the [members as a CSV](https://docs.google.com/spreadsheets/d/1EKGZ6_XRW51oElvgACeq7LfW0QuHWfpYQ67m0OVG5Qc/export?gid=0&format=csv).
    - Use papaparse to parse the CSV in the browser.
        - `"papaparse": "~4.1.0",` into bower.json
