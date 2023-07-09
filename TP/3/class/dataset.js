
var fs = require('fs');
var path = require('path');
const { Article } = require('./article');

var __WIKI_PATH__ = path.join(__dirname, "..", "wiki");
var __DISABLED_CHARS__ = [ '.', ':', ';', '(', ')', '«', '»', ',', '/', '\\','\'', '’', '"', '@', '-', '—', '{', '}', '?', '=', '<', '>' ];

class Dataset {
    
    articles = [];
    matchWords = [];

    constructor() {
        this.initializeWiki();
        this.initializeAvailableWords();
    }

    initializeWiki() {
        for(const fileName of fs.readdirSync(__WIKI_PATH__)) {
            const filePath = path.join(__WIKI_PATH__, fileName);
            let words = fs.readFileSync(filePath, { encoding: 'utf-8' }).replaceAll('\r\n', ' ');

            for(const disabled of __DISABLED_CHARS__) {
                words = words.replaceAll(disabled, ' ');
            }

            words = words.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            
            words = words
                .split(' ')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length);
                
            const treeWords = {};

            for(const word of words) {
                if((word in treeWords) === false) treeWords[word] = 1;
                treeWords[word]++;
            }

            this.articles.push(new Article(fileName, treeWords));
        }

        console.log(`Articles ${this.articles.length} loaded`)
    }

    initializeAvailableWords() {
        const treeWords = {};
        let wordsCount = 0;

        for(const article of this.articles) {
            for(const word in article.words) {
                if((word in treeWords) === false) {
                    treeWords[word] = 1;
                } else {
                    treeWords[word] += 1;
                }
                wordsCount++;
            }
        }

        console.log(`Words ${wordsCount} loaded`);

        const excludeList = [];

        for(const word in treeWords) {
            if(treeWords[word] >= Math.floor(this.articles.length * 0.5)
            || treeWords[word] <= Math.floor(this.articles.length * 0.1)) {
                excludeList.push(word);
            }
        }

        console.log(`Removing ${excludeList.length} word`);
        
        for(const word of excludeList) delete treeWords[word];
        for(const article of this.articles)
            for(const word in article.words)
                if(Object.keys(excludeList).includes(word))
                    delete article.words[word];

        this.matchWords = treeWords;
    }
}

module.exports.Dataset = Dataset;