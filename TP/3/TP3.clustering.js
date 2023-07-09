const { Article } = require("./class/article");
const { Dataset } = require("./class/dataset");

/**
 * Retourne le nombre de mots différents
 *
 * @param {Article} a 
 * @param {Article} b 
 */
function compareArticle(a, b) {

    const aWords = Object.keys(a.words);
    const bWords = Object.keys(b.words);
    const total  = aWords.length + bWords.length;

    const na = aWords.reduce((acc, wordA) => {
        acc += (bWords.includes(wordA)) ? 0 : 1;
        return acc;
    }, 0);

    const nb = bWords.reduce((acc, wordB) => {
        acc += (aWords.includes(wordB)) ? 0 : 1;
        return acc;
    }, 0);

    return [
        na,
        nb,
        total
    ];
}

function fakePearsonCorrelation(articleA, articleB) {
    const [ aSum, bSum, total ] = compareArticle(articleA, articleB);
    return (aSum + bSum) / total;
}

/************************************************/
/************************************************/
/* CLUSTERING                                   */
/************************************************/
/************************************************/

const dataset = new Dataset();

let oldArticle = null;

const matrix = [];

for(const articleA of dataset.articles) {
    for(const articleB of dataset.articles) {
        const key = `${articleA.title}_${articleB.title}`;
        if(articleA.title !== articleB.title && matrix.filter(m => m.key !== key)) {
            matrix.push({ key: key, correlation: fakePearsonCorrelation(articleA, articleB) });
        }
    }
}

matrix.sort((a, b) => { return a.correlation - b.correlation; });

console.log(matrix);

console.log('Je n\'ai pas réussi à réimplémenter la méthode de pearson pour cette example :(.');

