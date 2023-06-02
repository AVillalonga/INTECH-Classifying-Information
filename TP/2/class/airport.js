
class Airport {
    
    code        = null;
    name        = null;
    country     = null;
    company     = null;
    allCountry  = false;
    subAirports = null;
    flights     = [];

    constructor(code, name, country, company) {
        this.code       = code;
        this.name       = name;
        this.country    = country;
        this.company    = company;
        this.allCountry = (this.name === 'All airports');
    }

    getSubCodes() {
        return this.subAirports.map(subAirport => subAirport.code);
    }

}

module.exports.Airport = Airport;