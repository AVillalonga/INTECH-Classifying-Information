var __DATASET__ = require("./TP1.DATASET.recommendation.json").dataset;

/************************************************/
/************************************************/
/* FUNCTIONS                                    */
/************************************************/
/************************************************/

function formatDataset() {
    return __DATASET__.reduce((result, user, index) => {

        for(const feedback of user.feedbacks) {

            if((feedback.name in result) === false)
                result[feedback.name] = {};

            result[feedback.name][user.name] = feedback.value;

        }

        return result;

    }, {});
}

function pearsonCorrelation(usernameA, usernameB) {
    let userASum       = 0;
    let userBSum       = 0;
    let userASquare    = 0;
    let userBSquare    = 0;
    let product        = 0;
    let count          = 0;

    for(const item in __FORMATTED_DATASET__) {
        if((usernameA in __FORMATTED_DATASET__[item]) 
        && (usernameB in __FORMATTED_DATASET__[item])) {
            const userAValue    = __FORMATTED_DATASET__[item][usernameA];
            const userBValue    = __FORMATTED_DATASET__[item][usernameB];

            userASum            += userAValue; 
            userASquare         += Math.pow(userAValue, 2);
            userBSum            += userBValue;
            userBSquare         += Math.pow(userBValue, 2);
            product             += (userAValue * userBValue);
            count               += 1;
        }
    }

    if(count === 0) return 0;

    const n = product - (userASum * userBSum / count);
    const variance = Math.sqrt(
        (userASquare - Math.pow(userASum, 2) / count)
        *
        (userBSquare - Math.pow(userBSum, 2) / count)
    );

    return variance === 0
        ? 0
        : (n/variance);
}

function recommend(target) {
    const usernames     = __DATASET__.map(user => user.name);
    const exclude       = __DATASET__.find(user => user.name === target)
                                        .feedbacks
                                        .map(feedback => feedback.name);
    
    const similarities  = [];
    for(const username of usernames) {
        similarities[username] = pearsonCorrelation(target, username);
    }

    const result        = [];
    
    for(const movie in __FORMATTED_DATASET__) {
        
        if(exclude.includes(movie) === false) {
            result[movie]           = {};
            result[movie].deltaSum  = 0;
            result[movie].simSum    = 0;
            result[movie].score     = 0;
    
            for(const feedback in __FORMATTED_DATASET__[movie]) {
                result[movie].deltaSum  += __FORMATTED_DATASET__[movie][feedback];
                result[movie].simSum    += similarities[feedback];
            }
    
            result[movie].score         = (result[movie].deltaSum / result[movie].simSum);
        }
        
    }
    
    return result;
}

/************************************************/
/************************************************/
/* RECOMMENDATION                               */
/************************************************/
/************************************************/

var __FORMATTED_DATASET__ = formatDataset();

console.log("Recommendation pour Toby :", recommend("Toby"));