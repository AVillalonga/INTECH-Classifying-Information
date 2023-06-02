const { Dataset } = require("./class/dataset");
const { Flight } = require("./class/flight");

/**
 * @param {Dataset} dataset 
 * @param {string} origin 
 * @param {string} destination 
 * @returns {Array<Flight>}
 */
function getFlights(dataset, origin, destination) {
    let originAirport       = dataset.airports.find(airport => airport.code === origin);
    let destinationAirport  = dataset.airports.find(airport => airport.code === destination);
    
    originAirport = originAirport.allCountry === true
        ? originAirport.getSubCodes()
        : originAirport.code;

    destinationAirport = destinationAirport.allCountry === true
        ? destinationAirport.getSubCodes()
        : destinationAirport.code;

    return dataset.flights.filter(
        flight  => {
            const origin = Array.isArray(originAirport)
                ? originAirport.includes(flight.origin)
                : flight.origin === originAirport;

            const destination = Array.isArray(destinationAirport)
                ? destinationAirport.includes(flight.destination)
                : flight.destination === destinationAirport;

            return origin && destination;
    });
}

/**
 * cardinalité de l’espace des solutions
 * 
 * @param {Dataset} dataset
 * @param { { origin: string, destination: string, originMaxDate: Date|null, destinationMinDate: Date|null } } options
 */
function getSolutionSpace(dataset, options) {
    const originFlights         = getFlights(dataset, options.origin, options.destination);
    const destinationFlights    = getFlights(dataset, options.destination, options.origin);

    return [
        originFlights.filter( flight  => flight.endAt.getTime() <= options.originMaxDate.getTime() )
        .map( flight =>  {
            const cpFlight = structuredClone(flight);
            cpFlight.delay = options.originMaxDate.getTime() - flight.endAt.getTime();
            return cpFlight;
        } ),
        
        destinationFlights.filter( flight  =>  flight.startAt.getTime() >= options.destinationMinDate.getTime())
        .map( flight => {
            const cpFlight = structuredClone(flight);
            cpFlight.delay = flight.startAt.getTime() - options.destinationMinDate.getTime();
            return cpFlight;
        })
    ];
}

/**
 * cardinalité de l’espace des solutions
 * 
 * @param {Dataset} dataset
 * @param { { origins: Array<string>, destination: string, originMaxDate: Date|null, destinationMinDate: Date|null } } options
 */
function getMultiSolutionSpace(dataset, options) {
    return options.origins.map(origin => {
        return { customer: origin, tickets: getSolutionSpace(dataset, { origin, ...options }) }
    });
}

module.exports.getFlights = getFlights;
module.exports.getSolutionSpace = getSolutionSpace;
module.exports.getMultiSolutionSpace = getMultiSolutionSpace;