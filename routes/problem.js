var output = require('../output'),
    content = {template:"problem.html", data:{"pageTitle":"Dave Stevens: Uh-oh."}};
    
module.exports = function (req, res) {
  content.data.message = "Shhh... don't tell anyone but we're having a problem. This is not the full site. Something has gone wrong behind the scenes so you're seeing this tiny info page to tide you over until it's fixed. Sorry.";
  output(req, res, content);
};