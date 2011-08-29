var Mu = require('mu'),
    pump = require('util').pump,
    templates = [
      'home.html',
      'admin.html',
      'article.html',
      'elsewhere.html',
      'problem.html',
      'error404.html',
      'login.html',
      'about.html',
      'specials.html',
      'rss.xml'
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
    if (!content.type && promotejs) { content.data.promotejs = promotejs; }
    res.writeHead(200, {'Content-Type' : content.type || "text/html"});
    content.data.pageTitle = content.data.pageTitle || APP.config.defaults.pageTitle;
    content.data.sections = content.data.sections || APP.config.sections || [];
    pump(Mu.render(content.template, content.data),res);
  }
}