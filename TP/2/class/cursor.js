const { Flight } = require("./flight");

class Cursor {

    solutions               = null;
    penalityPerHour         = null;
    history                 = [];
    index                   = 0;
    complete                = false;
    delayWithoutPenality    = 0;

    constructor(solutions, penalityPerHour, delayWithoutPenality) {
        this.solutions              = solutions;
        this.penalityPerHour        = penalityPerHour;
        this.delayWithoutPenality   = delayWithoutPenality;
        this.history                = solutions.map(cu => { return []; });
    }

    nextIndex() {
        const next = this.solutions.map(customer => {
            const ia = this.index < customer.tickets[0].length ? this.index : customer.tickets[0].length - 1;
            const ib = this.index < customer.tickets[1].length ? this.index : customer.tickets[1].length - 1;

            if(this.index >= customer.tickets[0].length && this.index >= customer.tickets[1].length) {
                this.complete = true;
            }
            
            return {
                customer: customer.customer,
                tickets: [
                    customer.tickets[0][ia],
                    customer.tickets[1][ib],
                ] 
            };
        });

        next.forEach(this.cost.bind(this));
        this.index++;
        return next;
    }

    nextRandom() {
        const next      = [];
        const maxTries  = 7;
        let randomIndexes = null;
        let uuid        = null;
        let incTries    = 0;

        do {
            randomIndexes = this.solutions.map((customer) => {
                const indexA = Math.floor(Math.random() * customer.tickets[0].length);
                const indexB = Math.floor(Math.random() * customer.tickets[1].length);
                return [ indexA, indexB ];
            });

            if(incTries > maxTries) {
                this.complete = true;
                break;
            } else incTries++; 

            uuid = randomIndexes.map(index => { return index.join(':'); }).join("-")
        } while(this.history.includes(uuid) === true);
        this.history.push(uuid);

        for(let i=0; i < this.solutions.length; i++) {
            const singleSolution = {
                customer: this.solutions[i].customer,
                tickets: [
                    this.solutions[i].tickets[0][randomIndexes[i][0]],
                    this.solutions[i].tickets[1][randomIndexes[i][1]]
                ]
            };

            next.push(singleSolution);
        }

        next.forEach(this.cost.bind(this));
        next.push({ allTotalCost: next.reduce((a, c) => a += c.totalCost, 0)  });
        this.index++;
        return next;
    }

    /**
     * 
     * @param { { customer: string, tickets: [Flight, Flight] } } customerSolution 
     */
    cost(customerSolution) {
        customerSolution.totalCost = customerSolution.tickets.reduce((result, flight) => {
            result += Number(flight.price);
            const delayInHours = flight.delay / 1000 / 60 / 60;
            if(delayInHours > this.delayWithoutPenality) result += delayInHours * this.penalityPerHour;
            return result;
        }, 0);
    }

}

module.exports.Cursor = Cursor;