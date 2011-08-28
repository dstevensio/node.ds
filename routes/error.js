var output = require('../output');

module.exports = function(req, res) {
  var content = {
    template:"error404.html",
    data:{}
  };
  output(req,res,content);
};