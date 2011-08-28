var output = require('../output'),
    md = require('node-markdown').Markdown,
    dsutils = require('../dsutils'),
    util = require('util'),
    content = {template:"article.html",data:{stylesheets:[{"stylesheet":"/styles/article.css"}],articles:[]}};

module.exports = function(app) {
  
  app.get('/',function(req,res) {
    
    content.data.articleListing = true;
    content.data.article = null;
    client.zrange("items","0","-1", function (err, r) {
      if (err) {
        throw err;
      }

      var i = r.length,
          multi = client.multi(),
          articleIds = [],
          articleList = [];

      

      while (i--) {
        var m = r[i].match(/article\:([0-9+])/);
        if (m) {
          articleIds.push(m[1]);
        }
      }
      
      var outputcb = function() {
        output(req, res, content);
      };
      if (r.length) {
        dsutils.articlesHandler(req, res, content, "articles", articleIds, null, null, outputcb);
      } else {
        outputcb();
      }      
    });
      
  });
  
  app.get('/:title', function (req,res) {
    
    content.data.articleListing = false;
    var multi = client.multi(),
        displayArticle;
    client.get("article-title:"+req.params.title+":id", function (err, id) {
      if (!err && id) {
        multi.get("article:" + id + ":title");
        multi.get("article:" + id + ":content");
        multi.get("article:" + id + ":datetime-created");
        multi.get("article:" + id + ":datetime-modified");
        multi.get("article:" + id + ":hidden");
        multi.get("article:" + id + ":description");
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
              content.data.article = article;
              output(req,res,content);
            };            
            
            displayArticle(req, res, {
              "title":replies[0],
              "content":md(replies[1]),
              "created":dsutils.readableDate(replies[2]),
              "modified":dsutils.readableDate(replies[3]),
              "description":replies[5]
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
//TODO: get a short URL domain like dste.vn and in the comment on Twitter bar at foot of article, have it suggest they reference that short URL when replying
// e.g https://twitter.com/intent/tweet?source=webclient&text=@shakefon+re:+http://dste.vn/jr3R+