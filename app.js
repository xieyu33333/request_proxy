var express = require( 'express' );
var app = express();

var test = require('./test.js');
app.get( '/test', test.show);

app.listen( 3001 );