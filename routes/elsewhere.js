var output = require('../output'),
    content = {template:"elsewhere.html"};

module.exports = function(app) {
  app.get('/',function(req,res) {
    content.data = {
      stylesheets:[{"stylesheet":"/styles/elsewhere.css"}]
    };
    output(req,res,content);
  });
};