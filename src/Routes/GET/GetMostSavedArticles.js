const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-most-saved-articles', async (req, res) => {
    try{
        const [savedArticles] = await db.execute(
            'SELECT * FROM saved_articles'
        );

        const [articles] = await db.execute(
            'SELECT * FROM articles'
        );

        let temp = [];

        savedArticles.forEach((savedArticle) => {                                     //we count the quantity of every article in the saved_articles table
            const articleAlreadyExists = temp.some((currentArticle) => {
                if(currentArticle.id === savedArticle.articleId){
                    currentArticle.quantity += 1;
                    return true;
                }
                else 
                    return false; 
            });
             
            if(!articleAlreadyExists)
                temp.push({id: savedArticle.articleId, quantity: 1});
        });

        temp.sort((articleA, articleB) => {                                 //we sort all the articles with their quantity in descending order
            if(articleA.quantity > articleB.quantity)
                return -1;
            else
                return 1;
        });

        temp = temp.slice(0, 10);

        const sortedArticlesBasedOnSaved  = temp.map((currentArticle) => {
            return articles.filter((article) => article.id === currentArticle.id)[0];
        });
        
        res.status(200).json(sortedArticlesBasedOnSaved);
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
});

module.exports = router;