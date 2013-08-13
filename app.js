
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
    , graph = require('./routes/graph')
  , http = require('http')
  , path = require('path');

var app = express();
var context = '/navi';

app.engine('.html', require('ejs').__express);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(context, express.static(path.join(__dirname, '/public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get(path.join(context,'/'), routes.index);
app.get(path.join(context,'/graph'), graph.graph);
app.get(path.join(context,'/users'), user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
