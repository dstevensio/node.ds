var output = require('../output'),
    content = {template:"elsewhere.html"};

module.exports = function(app) {
  app.get('/',function(req,res) {
    content.data = {
      pageContent:'<p>Where does this boy hang yo</p>'
    };
    output(req,res,content);
  });
};