var output = require('../output'),
    content = {template:"home.html"};

module.exports = function(req,res) {
  
  client.zrevrange("items","0","-1", function (err, items) {
    var i = items.length,
        feed = [];
    
    while (i--) {
//      feed.push({
//        "title":
//      });
    }
  });
  
  content.data = {
    pageContent:'<p>Home is where the heart is</p>'
  };
  output(req,res,content);
};

//TODO: For links, pull in delicious links as they're saved as a link unless marked private