var connect = require('connect'),
    fs = require('fs'),
    redis = require('redis'),
    admin = require('./routes/admin'),
    markdown = require('./utils/markdown'),
    articles = require('./routes/articles'),
    elsewhere = require('./routes/elsewhere'),
    rHome = require('./routes/home'),
    redirects = require('./routes/redirects'),
    specials = require('./routes/specials');    
    
client = redis.createClient();

APP = {};

(function () {
  var config = fs.readFileSync(__dirname + '/config/conf.json');
  APP.config = JSON.parse(config.toString());

  config = null;

  var rAdmin = connect(
        connect.router(admin)
      ),
      rArticles = connect(
        connect.router(articles)
      ),
      rElsewhere = connect(
        connect.router(elsewhere)
      ),
      rMarkdown = connect(
        connect.router(markdown)
      ),
      rRedirects = connect(
        connect.router(redirects)
      ),
      rSpecials = connect(
        connect.router(specials)
      );

  connect(
    connect.bodyParser(),
    connect.static(__dirname + '/s')
  )
    .use('/admin',rAdmin)
    .use('/aea', rSpecials)
    .use('/shakefon', rSpecials)
    .use('/fifty-states', rSpecials)
    .use('/about', rSpecials)
    .use('/article', rArticles)
    .use('/articles', rArticles)
    .use('/md', rMarkdown)
    .use('/elsewhere', rElsewhere)
    .use('/twitter', rRedirects)
    .use('/facebook', rRedirects)
    .use('/github', rRedirects)
    .use('/flickr', rRedirects)
    .use('/linkedin', rRedirects)
    .use(function(req,res){
      rHome(req,res);
    })
    .listen(8888);

}());