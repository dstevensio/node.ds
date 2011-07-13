var output = require('../output'),
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
    content.data.pageContent = '<p>You are so special</p>';
    output(req,res,content);
  });
};