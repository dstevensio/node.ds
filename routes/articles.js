var output = require('../output'),
    md = require('node-markdown').Markdown,
    dsutils = require('../dsutils'),
    util = require('util'),
    content = {template:"article.html",data:{}};

module.exports = function(app) {
  
  app.get('/',function(req,res) {
    
    client.zrange("articles","0","-1", function (err, r) {
      
      var i = r.length,
          multi = client.multi(),
          articleList = [];

      while (i--) {
        multi.get("article:" + r[i] + ":title");
      }
      
      multi.exec(function(err, replies) {
        replies.forEach(function (reply, index) {
          if (reply) {
            articleList.push({"uri":reply,"title":reply.replace("-"," ")});
          }
          
          if (index == replies.length-1) {
            content.data.articles = {"articleList":articleList};
            output(req,res,content);
          }
        });        
      });
      
    });
      
  });
  
  app.get('/:title', function (req,res) {
    
    var multi = client.multi(),
        displayArticle;
    client.get("article-title:"+req.params.title+":id", function (err, id) {
      if (!err && id) {
        multi.get("article:" + id + ":title");
        multi.get("article:" + id + ":content");
        multi.get("article:" + id + ":datetime-created");
        multi.get("article:" + id + ":datetime-modified");
        multi.get("article:" + id + ":hidden");
        multi.exec(function (err, replies) {
          
          var noArticle = function noArticle(req, res) {
            content.data = {
              article:{title:"Article Not Found","content":'<p>No such article, yo.</p>'}
            };
            output(req,res,content);  
          };

          
          if (err || !replies.length || (replies.length == 5 && replies[4] == "true")) {
            noArticle(req, res);
          } else {
          
            var displayArticle = function displayArticle(req, res, article) {
              content.data = {
                article:article
              };
              output(req,res,content);
            };            
            
            displayArticle(req, res, {
              "title":replies[0],
              "content":md(replies[1]),
              "created":dsutils.readableDate(replies[2]),
              "modified":dsutils.readableDate(replies[3])
            });
          }
        });
      } else {
        var noArticle = function noArticle(req, res) {
          content.data = {
            article:{title:"Article Not Found","content":'<p>No such article, yo.</p>'}
          };
          output(req,res,content);  
        };
        
        noArticle(req, res);
      }
    });
  });  
};