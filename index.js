const express = require('express');
const app = express();
const data = require('./articles.json');
const {PAGE_SIZE_DEFAULT} = require("./constants");
const cors = require('cors')

function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

app.get('/', cors(), (req, res) => {
    res.send(
        'Welcome To News API | Tran Dinh Thang'
    )
})

app.get('/articles', cors(), function (req, res) {
    const {
        q,
        pageSize,
        page
    } = req.query;
    const pageSizeParseInt = Number.parseInt(pageSize);
    const hasPageSize = !!pageSizeParseInt && Number.isInteger(pageSizeParseInt);
    const pageParseInt = Number.parseInt(page);
    const hasPage = !!pageParseInt && Number.isInteger(pageParseInt);
    const pageSizeReal = hasPageSize ? pageSizeParseInt : PAGE_SIZE_DEFAULT;
    const pageReal = hasPage ? pageParseInt : 1;
    // filter q
    const dataArticlesFilter = q ? data.filter(article => {
        return (article.title + " " + article.description + " " + article.content).includes(q)
    }) : data;
    const dataArticles = paginate(dataArticlesFilter, pageSizeReal, pageReal);
    const maxPerPage = Math.ceil(data.length/pageSizeReal);
    res.status(200).json({
        articles: dataArticles,
        pageSize: pageSizeReal,
        maxPerPage: maxPerPage,
        currentPage: pageReal <= maxPerPage ? pageReal : maxPerPage
    });
})
app.listen(process.env.PORT || 5000);
