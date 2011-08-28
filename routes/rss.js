var output = require('../output'),
    dsutils = require('../dsutils'),
    nowDate = new Date(),
    content = {
      type: "text/xml",
      template: "rss.xml",
      data: {
        articles: [],
        feedDate: dsutils.rssFormattedDate(nowDate)
      }
    };

module.exports = function(app) {
  
  app.get('/', function(req, res) {
    // defaults to articles only in feed  
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
        dsutils.articlesHandler(req, res, content, "rss", articleIds, null, null, outputcb);
      } else {
        outputcb();
      }      
    });  
  
  });
  
  app.get('/:id', function(req, res) {
    
    var id = req.params.id;
    if (id == "activity") {
      // RSS feed of everything posted, articles, links, tweets, etc.
    } else {
      // Handle failure to specify correct sub-feed type
    }
    
  });
};