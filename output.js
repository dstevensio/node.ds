var Mu = require('mu'),
    pump = require('util').pump,
    templates = [
      'home.html',
      'admin.html',
      'article.html',
      'elsewhere.html',
      'specials.html'
    ],
    tlen = templates.length;

Mu.root = './templates';

while (tlen--) { 
  Mu.compile(templates[tlen], function(err, compiled){
    if (err) throw err;
  });
}

module.exports = function(req,res,content) {
  if (content.type && content.type == 'application/json') {
    res.writeHead(200, {'Content-Type':content.type});
    res.end(content.data);
  } else {      
    res.writeHead(200, {'Content-Type' : content.type || "text/html"});
    content.data.pageTitle = content.data.pageTitle || "Dave Stevens (shakefon) is not your #1 enemy";
    content.data.sections = content.data.sections || APP.config.sections || [];
    pump(Mu.render(content.template, content.data),res);
  }
}