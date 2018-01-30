var axios = require('axios');

var authKey = "366306612fc24be0bec30cd9e08c0fd7";

var nytHelper = {
    searchArticle: function (topic, startYear, endYear) {
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
            authKey + "&q=" + topic + "&begin_date=" + startYear + "0101" + "&end_date=" + endYear + "0101";
        return axios.get(queryURL).then(function (results) {
            if (results.data.response.docs.length === 0) {
                console.log("No records");
            } else {
                var NYTRecords = results.data.response;
                var NYTResultArray = [];
                for (var i = 0; i < NYTRecords.docs.length; i++) {
                    if (NYTRecords.docs[i].headline.main) {
                        var NYTResultObject = {};
                        NYTResultObject.title = NYTRecords.docs[i].headline.main;
                        if (NYTRecords.docs[i].byline && NYTRecords.docs[i].byline.original) {
                            NYTResultObject.author = NYTRecords.docs[i].byline.original;
                        }
                        if (NYTRecords.docs[i].pub_date) {
                            NYTResultObject.publish_date = NYTRecords.docs[i].pub_date;
                        }
                        if (NYTRecords.docs[i].snippet) {
                            NYTResultObject.snippet = NYTRecords.docs[i].snippet;
                        }
                        if (NYTRecords.docs[i].web_url) {
                            NYTResultObject.link = NYTRecords.docs[i].web_url;
                        }
                        NYTResultArray.push(NYTResultObject);
                    }
                }
                return NYTResultArray;
            }
        });
    },
    saveArticle: function (title, author, publish_date, snippet, link) {
        var newArticle = {
            title: title,
            author: author,
            published_date: publish_date,
            snippet: snippet,
            link: link
        };
        return axios.post("/save-article", newArticle);
    },
    getSavedArticle: function () {
        return axios.get("/saved-articles");
    },
    deleteArticle: function (articleID) {
        return axios.delete("/delete-article", {
            params: {
                'id': articleID
            }
        });
    }
}

module.exports = nytHelper;