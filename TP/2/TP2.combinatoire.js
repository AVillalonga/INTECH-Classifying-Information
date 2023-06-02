
const { Cursor } = require('./class/cursor');
const { Dataset } = require('./class/dataset');
const { getFlights, getSolutionSpace, getMultiSolutionSpace } = require('./utils');

/************************************************/
/************************************************/
/* GLOBALS                                      */
/************************************************/
/************************************************/

var __DATASET__ = new Dataset();

var __CONFERENCE__  = {
    airport         : 'LHR',
    airportDistance : 50,

    startAt         : new Date(2010, 6, 27, 18, 0, 0, 0),
    maxBusStartAt   : new Date(2010, 6, 27, 17, 0, 0, 0), // Si nous voulons que les invités arrivent à l'heure

    endAt           : new Date(2010, 7, 3, 14, 0, 0, 0),
    minAirportArrival: new Date(2010, 7, 3, 15, 0, 0, 0), // Le temps de trajet jusqu'à l'aeroport

    bus             : {
        pricePerKm  : 1,
        rent        : 150,
        rentDeadline: 18,
        penality    : 100,
    }
};

var __CUSTOMERS__   = [ 'BER', 'CDG', 'MRS', 'LYS', 'MAN', 'BIO', 'JFK', 'TUN', 'MXP'];

var __SOLUTION_SPACE__ = getMultiSolutionSpace(__DATASET__, {
    origins             : __CUSTOMERS__,
    destination         : __CONFERENCE__.airport,
    originMaxDate       : __CONFERENCE__.maxBusStartAt,
    destinationMinDate  : __CONFERENCE__.minAirportArrival
});

var __CURSOR__ = new Cursor(__SOLUTION_SPACE__, 60, 0.5);
var __CURSOR2__ = new Cursor(__SOLUTION_SPACE__, 60, 0.5);

/************************************************/
/************************************************/
/* RECOMMENDATION COMBINATOIRE                  */
/************************************************/
/************************************************/

function randomHillClimbing() {

    let best = null;
    
    console.log('-'.repeat(24));
    console.log('Random Hill Climbing');
    console.log('-'.repeat(24));
    
    while(__CURSOR__.complete === false && __CURSOR__.index < 32) {
        const solution = __CURSOR__.nextRandom();
        if(best === null) best = solution
        else {
            if(best.at(-1).allTotalCost > solution.at(-1).allTotalCost) {
                console.log(`NEW BEST SOLUTION ⮕ ${best.at(-1).allTotalCost} → ${solution.at(-1).allTotalCost}`)
                best = solution;
            }
        }
    }
    
    console.log(best);

}

function simulatedAnnealing() {

    let TEMPERATURE = 10000;
    const COLD = 0.95;

    console.log('-'.repeat(24));
    console.log('(MIX) Simulated Annealing && Genetic algorithms');
    console.log('-'.repeat(24));

    best = null;

    while(__CURSOR2__.complete === false && __CURSOR2__.index < 32) {
        const solution = __CURSOR2__.nextRandom();
        const oldBest = best;

        if(best === null) best = solution
        else {

            for(let i=0; i < best.length -1; i++) {
                for(const customer of solution) {
                    if(best[i].customer === customer.customer && best[i].totalCost > customer.totalCost) {
                        console.log(`NEW BEST CUSTOMER ⮕ ${customer.customer} ${best[i].totalCost} → ${customer.totalCost}`)
                        best[i] = customer;
                    }
                }
            }

            best.at(-1).allTotalCost = best.filter(customer => 'totalCost' in customer).reduce((acc, cost) => acc += cost.totalCost , 0);
        }

        /*****************************************************************************************************************************/
        /* LA TEMPERATURE N'A AUCUN SENS ! POURQUOI REMONTER LE PENTE QUE L'ON CHERCHE A DESCENDRE (MON CODE SE COMPORTE MIEUX SANS) */
        /*****************************************************************************************************************************/
        if(oldBest !== null) {
            const exponent = (- best.at(-1).allTotalCost - oldBest.at(-1).allTotalCost) / TEMPERATURE;
            const probability = Math.pow(Math.E, exponent);
            if(probability > Math.random()) {
                best = oldBest;
            }
            TEMPERATURE *= COLD;
        }
        /*****************************************************************************************************************************/
    }

    console.log(best);
}

randomHillClimbing();
simulatedAnnealing();