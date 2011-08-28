var connect = require('connect'),
    fs = require('fs'),
    redis = require('redis'),
    admin = require('./routes/admin'),
    markdown = require('./utils/markdown'),
    articles = require('./routes/articles'),
    elsewhere = require('./routes/elsewhere'),
    rHome = require('./routes/home'),
    rError = require('./routes/error'),
    rProblem = require('./routes/problem'),
    rss = require('./routes/rss'),
    redirects = require('./routes/redirects'),
    specials = require('./routes/specials');    

APP = {};  
knownIds = {
  "home":{},
  "articles":{},
  "rss":{}
};
client = redis.createClient(6379);
  
(function(){
  
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
      rRss = connect(
        connect.router(rss)
      ),
      rSpecials = connect(
        connect.router(specials)
      ),
      authCheck = require('./utils/auth');

  connect(    
    connect.favicon(__dirname + '/s/favicon.ico'),
    connect.bodyParser(),
    connect.static(__dirname + '/s'),
    connect.cookieParser(),
    connect.session({ secret: 'backbagdanielloughborough' }),
    authCheck
  )
    .use('/admin',rAdmin)
    .use('/aea', rSpecials)
    .use('/shakefon', rSpecials)
    .use('/fifty-states', rSpecials)
    .use('/about', rSpecials)
    .use('/article', rArticles)
    .use('/articles', rArticles)
    .use('/md', rMarkdown)
    .use('/work-with-me', rSpecials)
    .use('/elsewhere', rElsewhere)
    .use('/twitter', rRedirects)
    .use('/facebook', rRedirects)
    .use('/github', rRedirects)
    .use('/flickr', rRedirects)
    .use('/linkedin', rRedirects)
    .use('/rss', rRss)
    .use('/feed', rRss)
    .use(function(req,res){
      if (req.originalUrl == '/') {
        rHome(req,res);
      } else {
        rError(req,res);
      }
    })
    .listen(32879);

}());
// add a try/catch to each block file, catching errors and using error500.html to display there's a problem