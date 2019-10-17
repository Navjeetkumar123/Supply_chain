var express = require('express')
   , routes = require(__dirname+'/routes')
   , http = require('http')
   , path = require('path')
   , bodyParser = require('body-parser')
   , multipart = require('connect-multiparty')
   , session = require('express-session')
   , cookieParser = require('cookie-parser')
   , mongodb = require('mongojs');
   var MongoClient = require('mongodb').MongoClient
    , format = require('util').format
    , request = require('request');
//var kMeans = require('node-kmeans');
//var bootbox = require('bootbox');
var app = express();
var multipartMiddleware = multipart();

app.set('port', process.env.PORT || 3000);
/*app.set('views', __dirname + '/views');
app.engine('jade', require('jade').renderFile);
app.set('view engine', 'jade');*/
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
//app.use('/photos',  express.static(__dirname + '/uploads/Photos'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.locals.pretty = true;

app.use(cookieParser('secret'));
app.use(session({
  secret:'yoursecret',   
  resave: true,
  saveUninitialized: true, 
  cookie:{maxAge:30*60*1000}
}));

app.use(express.Router());
require(__dirname+'/routes/index')(app);
require(__dirname+'/routes/crud')(app);
//require(__dirname+'/routes/supplierCrud')(app);
require(__dirname+'/routes/manufacturerCrud')(app);
require(__dirname+'/routes/logisticsCrud')(app);
require(__dirname+'/routes/retailerCrud')(app);
//require(__dirname+'/routes/distributorCrud')(app);

//require('./routes/crud2')(app);

http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));

});