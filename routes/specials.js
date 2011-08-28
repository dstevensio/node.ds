var output = require('../output'),
    md = require('node-markdown').Markdown,
    content = {
      template:"specials.html",
      data: {
        stylesheets:[
          {stylesheet:"/styles/specials.css"}
        ],
        js:[
          {filename:"/js/specials.js",wait:true}
        ]
      }
    };

module.exports = function(app) {
  app.get('/',function(req,res) {
    
    var key = req.originalUrl.replace('/','');
    
    var multi = client.multi();
    
    multi.get("special:"+key+":template");
    multi.get("special:"+key+":stylesheet");
    multi.get("special:"+key+":title");
    multi.get("special:"+key+":content");
    
    multi.exec(function(err,replies) {
      if (err) {
        throw err;
      }
      content.template = replies[0];
      content.data.stylesheets.push({stylesheet:replies[1]});
      content.data.pageTitle = replies[2];
      content.data.pageContent = md(replies[3]);
      output(req,res,content);
      
    });        
  });
};