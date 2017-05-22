# marauder
Marauder net visualization. This tool can compile the Marauder net [database](https://docs.google.com/spreadsheets/d/1jTyE6Qg1jxwTCrYRHz3FON3dpXysV_TA1ywteBH1VDU) to [KML](https://developers.google.com/kml/).

## Use with Google Earth
To integrate with Google Earth, copy the KML [NetworkLink](https://developers.google.com/kml/documentation/kmlreference#networklink) below and paste it to "My Places". You can right click the generated entry to refresh after making changes to the database.
``` xml
<NetworkLink>
  <name>Marauder net</name>
  <flyToView>0</flyToView>
  <Link>
    <href>https://marauder.smpc.tv</href>
    <viewRefreshMode>onRequest</viewRefreshMode>
  </Link>
</NetworkLink>
```

## Installation
To use the tool locally or hack on the code, you will need to install some dependencies and create a configuration file:
* Clone the repo and cd into the directory
* Run `npm install`
* Copy `env.sample.sh` to `env.sh` and edit to suit

## At the command line:
``` shell
$ npm run build  # writes npm debug log and kml to stdout
```
``` shell
$ npm run --silent build > marauder.kml  # writes kml to a file
```

## As a service
An http server is included that can be started by running:
``` shell
$ PORT=80 npm run start
```

## License
MIT
