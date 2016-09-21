var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routeHelper = require("./util/routeHelper");
var proxySettingHelper = require("./util/proxySettingHelper");
var arguments = require("./util/argsParser")();
var proxyRouteHandler = require("./routes/proxyRouter");

var proxySettings = proxySettingHelper.loadIntitialSettings();
var routesData = routeHelper.loadIntitialRoutes();
var lastRouteID = routeHelper.getMaxIDValue(routesData);
var routRouter = require("./routes/rout.js")(routesData, lastRouteID);
var proxySettingRouter = require("./routes/proxySettingRouter")(proxySettings);

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/setup-routes",express.static(path.join(__dirname, 'public')));
app.use(express.static(arguments.dirPath));

app.use("/routes", routRouter);
app.use("/proxy-setting", proxySettingRouter);
app.use(proxyRouteHandler(routesData));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// module.exports = app;

app.listen(arguments.portNumber);
