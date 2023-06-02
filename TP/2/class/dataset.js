
var fs = require('fs');
var path = require('path');
var xml2js = require('xml-js').xml2js;
const { Airport } = require('./airport');
const { Flight } = require('./flight');

var __PATHS__ = {
    airports: path.join(__dirname, "..", "dataset", "airports.txt"),
    schedule: path.join(__dirname, "..", "dataset", "2010"),
};

class Dataset {
    
    airports    = [];
    flights     = [];

    constructor() {
        this.initializeAirports();
        this.initializeFlights();
    }

    initializeAirports() {
        const airports = fs.readFileSync(__PATHS__.airports, { encoding: 'utf-8' }).split('\r\n');
        
        for(const airport of airports) {
            const [code, name, country, , company] = airport.split('|');
            this.airports.push(new Airport(code, name, country, company));
        }

        console.log(`[ airports loaded ] ${this.airports.length}`);

        let inc = 0;
        for(const airport of this.airports) {
            if(airport.allCountry === true) {
                airport.subAirports = this.airports.filter(subAirport => 
                    subAirport.country === airport.country 
                    && subAirport.code !== airport.code
                );
                inc++;
            }
        }

        console.log(`[ airports relation ] ${inc}`);
    }

    initializeFlights() {
        for(const directory of fs.readdirSync(__PATHS__.schedule)) {
            const subDirectory = path.join(__PATHS__.schedule, directory);

            for(const filename of fs.readdirSync(subDirectory)) {
                const file      = fs.readFileSync(path.join(subDirectory, filename), { encoding: 'utf-8' });
                const flights   = xml2js(file, { compact: true, spaces: 2 }).flights.flight;
                
                for(const flight of flights) {
                    this.flights.push(new Flight(
                        flight.price._text,
                        flight.stops._text,
                        flight.orig._text,
                        flight.dest._text,
                        new Date(flight.depart._text),
                        new Date(flight.arrive._text),
                        flight.airline_display._text
                    ));
                }
            }
        }

        console.log(`[ flights loaded ] ${this.flights.length}`);
    }

}

module.exports.Dataset = Dataset;