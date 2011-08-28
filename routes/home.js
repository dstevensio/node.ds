var output = require('../output'),
    dsutils = require('../dsutils'),
    req = null,
    res = null,
    content = {
      template:"home.html",
      data: {
        articles: [],
        feed: [],
        stylesheets:[{stylesheet:"/styles/home.css"}]
      }
    },
    fetchFeedItem = function fetchFeedItemFn (itemId, itemType, cb) {
      var multi = client.multi();
      multi.get(itemType+":"+itemId+":title");
      multi.get(itemType+":"+itemId+":uri");
      multi.get(itemType+":"+itemId+":source");
      multi.exec(function (err, replies) {
        return cb({"title":replies[0],"uri":replies[1],"source":replies[2] || ""});
      });
    },
    feedHandler = function feedHandlerFn (feed, feedTypes, callback) {
      if (typeof feed == "undefined" || feed.length === 0) {
        return callback();
      }
      var n = feed.length;
      
      function addFeedItem(itemId) {
        fetchFeedItem(itemId, feedTypes["f"+itemId], function(dataObj) {
          content.data.feed.push(dataObj);
          if (-- n === 0) {
            callback();
          }
        });
      }
      feed.forEach(function(l){
        if (!knownIds["home"][l]) {
          knownIds["home"][l] = true;
          addFeedItem(l);
        } else {
          if (--n === 0) {
            callback();
          }
        }
      });
    };

module.exports = function(request,response) {
  
  req = request;
  res = response;
  
  client.zrevrange("items","0","-1", function (err, items) {
    var i = items.length,
        articleIds = [],
        feedIds = [],
        feedTypes = {};
    
    while (i--) {
      var components = items[i].match(/(article|link|photo|tweet)\:([0-9+])/);
      if (components) {
        var itemType = components[1],
            itemId = components[2];
        
        if (itemType == "article") {
          articleIds.push(itemId);
        } else { 
          feedIds.push(itemId);
          feedTypes["f"+itemId] = itemType;
        }
      }
    }
    
    if (items.length) {
      dsutils.articlesHandler(req, res, content, "home", articleIds, feedIds, feedTypes, feedHandler);
    } else {
      output(req,res,content);
    }
  });
  
};

//TODO: For links, pull in delicious links as they're saved as a link unless marked private
//TODO: Scrape tweets for RT's that contain links and denote them as such
//TODO: Have interstitial page for links so when sharing dste.vn/sisor2 on twitter it first lands on a page on dsus that explains why I liked it etc - optional