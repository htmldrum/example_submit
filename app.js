var http = require( 'http' );
var express = require( 'express' );
var fs = require( 'fs' ); // Requiring fs module to write to file
var app = express();
var config = require( './config.json' )[ app.get( 'env' )];
var _ = require( 'lodash' );

console.log( config.db_host );
console.log( config.db_user );
console.log( config.db_pass );

app.use( express.logger({
  format : 'tiny', // options: default, short, tiny, dev
  stream : fs.createWriteStream( 'app.log', { 'flags' : 'w' } )
}));

app.set( 'view engine', 'jade' );
app.set( 'views', './views' );

// Adding static middlewear to serve resources
app.use( express.static( './public' ));

// Adding the responseTime middleware
// Adds X-Reponse-Time header
app.use( express.responseTime() );
// Interpreting bodies of multi-part forms
app.use( express.bodyParser() );

// Adding errorHandler middlware
// Needs to be added after the router middleware
// Without including the router, just prints stdout message
// to HTML without parsing it through express' default template
app.use( app.router );

if( 'production' == app.get( 'env' )){
  app.get( '/', function( req, res ){
    res.render( 'index', { title : 'Prod', message : 'Welcome to prod' });
  });
}
if( 'development' == app.get( 'env' )){

  // Only wish to use the error handler in development
  app.use( express.errorHandler() );

  app.get( '/', function( req, res ){
    res.render( 'index', { 
      title : 'Image Upload Example'
    });
  });
}

app.get( '/', function( req, res ){
  res.render( 'index' );
});

app.post( '/multipart_submit', function( req, res ){

  res.json( req.files.image );

});

app.post( '/json_submit', function( req, res ){

  res.json( _.reduce( req.files, function( result, val, key ){

    result.push( key );
    return result;
  
  }, [] ) );

});


http.createServer( app ).listen( 3000, function(){
  console.log( 'Express app started.' );
});
