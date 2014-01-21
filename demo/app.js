var express = require( 'express' );
var shipIt = require( '../src/shipIt' );
var app = express();
var mongo = require( 'mongodb' );
var contactsJson = require( './contacts.json' );

var MONGO_URI = 'mongodb://localhost';

var mongoClient = mongo.MongoClient;



prepareMongo( function( err, mongoDb ) {
	app.set( 'views', __dirname + '/views');
	app.set( 'view engine', 'jade');

	// app.use( shipIt.middleware( {
	// 	contacts : new shipIt.Containers.MongoCollection( { collection : mongoDb.collection( 'contacts' ) } )
	// } ) );

	app.use( shipIt.middleware( [ {
		containerName : 'contacts',
		type : shipIt.Containers.MongoCollection,
		options : { collection : mongoDb.collection( 'contacts' ) }
	} ] ) );

	app.use( app.router );

	app.get( '/', function( req, res ) {
		// req.darsy.add( {
		// 	contacts : {
		// 		fields : 'firstName'
		// 	},
		// 	bulk : 'whatever'
		// } );

		req.ssData.add( {
			contacts : {
				fields : [ 'firstName', 'lastName' ],
				skip : 1,
				limit : 5
			}
		} );

		// darsy.stuff( function( err, cargo ) {
		// 	res.send( cargo );
		// } );

		res.render( 'index' );
	} );
} );

app.listen( 3000 );

function prepareMongo( callback ) {
	mongoClient.connect( MONGO_URI, {}, function( err, dbServer ) {
		if( err ) throw err;

		var mongoDb = dbServer.db( 'shipItTest' );

		mongoDb.dropDatabase( function( err ) {
			if( err ) return callback( err );

			mongoDb.collection( 'contacts' ).insert( contactsJson, function( err, result ) {
				if( err ) return callback( err );

				callback( null, mongoDb );
			} );
		} );
	} );
}