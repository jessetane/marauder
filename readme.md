# marauder
Marauder net visualization. The database is a Google spreadsheet that can be edited [here](https://docs.google.com/spreadsheets/d/1jTyE6Qg1jxwTCrYRHz3FON3dpXysV_TA1ywteBH1VDU). Current functionality is limited to generating GeoJSON or KML output for use with Google Maps/Earth. A deployment should be up and running at https://marauder.smpc.tv.

## Usage
* Clone the repo and cd into the directory
* Run `npm install`
* Copy `env.sample.sh` to `env.sh` and edit to configure
* Make some change to the database (if you want) and do:
``` shell
$ npm run --silent build > marauder.kml
```

## As a service
An http server is included that can be started by running:
``` shell
$ PORT=80 npm run start
```

## License
MIT
