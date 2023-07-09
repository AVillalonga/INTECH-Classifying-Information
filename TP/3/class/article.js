
class Article {

    words = {}
    title = null;
    
    constructor(title, words) {
        this.title = title;
        this.words = words;
    }

}

module.exports.Article = Article;