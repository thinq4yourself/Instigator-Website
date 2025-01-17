if(process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'Unmistakable Website'
  });
}
if(process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}
var cluster = require('cluster');
var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var compression = require('compression');
var app = express();


/* this is used to force SSL - required for security */
// app.use(function(req, res, next) {
//     if (req.headers['x-forwarded-proto'] != 'https') {
//         res.redirect('https://' + req.headers.host + req.path);
//     }
//     else {
//         return next();
//     }
// });
// 

/* a badass prerender engine for Angular apps - prerender.io style */
app.use(require('prerender-node').set('prerenderToken', 'process.env.PRERENDER_TOKEN'));

// Use gzip compression
app.use(compression());

/* a badass express based router middleware (rewrites) for html5Mode angular apps - fedora style */
app.use(serveStatic(__dirname + '/dist'));
app.set('views', __dirname + '/dist/views');
app.get('/*', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + "/dist"});
});

app.use(morgan('app'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);