var express = require( 'express' );
var app = express();

var test = require('./demo/test.js');
app.get( '/test', test.show);
// (function(app){

// })()

app.listen( 3001 );

//plugin -  headline