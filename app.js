var express = require( 'express' );
var app = express();

require("fs").readdirSync("./demo").forEach(function(file) {
  require("./demo/" + file)(app);
});

app.listen( 3001 );
