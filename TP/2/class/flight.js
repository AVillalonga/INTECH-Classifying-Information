
class Flight {

    price       = null;
    stops       = null;
    origin      = null;
    destination = null;
    startAt     = null;
    endAt       = null;
    display     = null;
    delay       = 0;

    constructor(price, stops, origin, destination, startAt, endAt, display) {
        this.price          = price;
        this.stops          = stops;
        this.origin         = origin;
        this.destination    = destination;
        this.startAt        = startAt;
        this.endAt          = endAt;
        this.display        = display;

        for(const value of Object.values(this)) {
            if(value === null || value === undefined) {
                console.log(this);
                throw new Error('Not implemented error');
            }
        }
    }

}

module.exports.Flight = Flight;