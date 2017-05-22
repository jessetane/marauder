# marauder
Marauder net visualization. The database is a Google spreadsheet and can be edited here: https://docs.google.com/spreadsheets/d/1jTyE6Qg1jxwTCrYRHz3FON3dpXysV_TA1ywteBH1VDU

## Usage
* Clone the repo and cd into the directory
* Run `npm install`
* Copy `env.sample.sh` to `env.sh` to configure
* Make some change to the database, then run:
``` shell
$ npm run --silent build > marauder.kml
```

## License
MIT
