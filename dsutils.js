var output = require('./output'),
    md = require('node-markdown').Markdown;

module.exports = {
  rssFormattedDate: function rssFormattedDate (dt) {
    var dt = dt || new Date();
    if (!dt.hasOwnProperty("toUTCString")) {
      dt = new Date(dt); 
    }    
    var formattedDate = dt.toUTCString();

    return formattedDate;
  },
  dateFormat: function dateFormat (dt) {
    var dt = dt || new Date(),
        formattedDate = dt.getUTCFullYear() + "-",
        month = (dt.getUTCMonth()+1),
        day = dt.getUTCDate(),
        hours = dt.getUTCHours(),
        mins = dt.getUTCMinutes(),
        secs = dt.getUTCSeconds();
        
    formattedDate += ((month < 10) ? "0" : "") + month + "-";
    formattedDate += ((day < 10) ? "0" : "") + day + " ";
    formattedDate += ((hours < 10) ? "0" : "") + hours + ":";
    formattedDate += ((mins < 10) ? "0" : "") + mins + ":";
    formattedDate += ((secs < 10) ? "0" : "") + secs + " UTC";
        
    return formattedDate;
  },
  readableDate: function readableDate (dtStr) {
    var dt = new Date(dtStr);    
    return dt.toString();
  },
  fetchArticleContent: function fetchArticleContentFn (itemId, caller, cb) {
    var multi = client.multi();
    multi.get("article:"+itemId+":title");
    multi.get("article:"+itemId+":description");
    multi.get("article:"+itemId+":uri");
    if (caller == "rss") {
      multi.get("article:"+itemId+":content");
      multi.get("article:"+itemId+":datetime-created");
      multi.get("article:"+itemId+":datetime-modified");
    }
    multi.exec(function (err, replies) {
      if (err) {
        throw err;
      }
      var articleTitle = replies[0],
          returnArticle = {
            "title":articleTitle,
            "description":replies[1] || "",
            "uri":replies[2]
          };
      
      if (replies.length > 3) {
        returnArticle.content = md(replies[3]);
        returnArticle.created = replies[4];
        returnArticle.modified = replies[5];
      }
                
      return cb(returnArticle);
    });              
  },
  articlesHandler: function articlesHandlerFn (req, res, content, caller, articles, feed, feedTypes, callback) {
    var n = articles.length;
    
    function addArticle(itemId) {
      module.exports.fetchArticleContent(itemId, caller, function(dataObj) {
        if (!dataObj) {
          throw new Error("Oh shit no dataObj");
        }
        var articleTitle = dataObj.title || "untitled",
            thisArticle = {
              "title":articleTitle.replace(/[\-]/g," "),
              "uri":"/articles/"+dataObj.uri,
              "description":dataObj.description              
            };
        if (dataObj.content) {
          thisArticle.content = dataObj.content;
          thisArticle.created = (caller == "rss") ? module.exports.rssFormattedDate(dataObj.created) : module.exports.readableDate(dataObj.created);
          thisArticle.modified = (caller == "rss") ? module.exports.rssFormattedDate(dataObj.modified) : module.exports.readableDate(dataObj.modified);
        }
        if (caller == "rss") { thisArticle.uri = APP.config.baseURI + thisArticle.uri; }
        content.data.articles.push(thisArticle);
        if (-- n === 0) {
          if (feed) {
            callback(feed, feedTypes, function() {
              output(req,res,content);
            });
          } else {
            output(req,res,content);            
          }
        }
      });
    }
    articles.forEach(function(l) {
      if (!knownIds[caller][l]) {
        knownIds[caller][l] = true;
        addArticle(l);
      } else {
        if (-- n === 0) {
          if (feed) {
            callback(feed, feedTypes, function() {
              output(req,res,content);
            });
          } else {
            callback();
          }
        }
      }
    });
  }  
};