var output = require('../output'),
    dsUtils = require('../dsutils'),
    redisWrite = require('../rediswrite'),
    content = {template:"home.html"};

module.exports = function(app) {

  app.get('/',function(req,res) {
    
    var where = (req.originalUrl || '').replace('/',''),
        callback = function (err, id) {
          var mainStr = "redirects:" + where + ":" + id + ":";
          client.set(mainStr+"datetime",dsUtils.dateFormat());
          client.set(mainStr+"page",req.originalUrl);
          client.set(mainStr+"ip",req.remoteAddress);
          client.set(mainStr+"user-agent",req.headers["user-agent"]);          
        };    
    redisWrite.writeNew(where, callback);
    
    res.writeHead(301, {
      "Location":APP.config.redirects[where]
    });
    res.on("error", function() {
      content.data = {
        pageContent:'<p>Oh darn. Magical web trickery that neither you or I truly understand was meant to automatically whisk you away to <a href="' + APP.config.redirects[where] + '">' + APP.config.redirects[where] + '</a> but the fact that you\'re reading this shows it hasn\'t worked. Why not live like it\'s the heady days of 1996 and click the link to go there directly.</p><p>If you\'re wondering, yes I am ashamed.</p>'
      };
      output(req,res,content);      
    });
    res.end();    
  });
  
};