// const sgMail = require('@sendgrid/mail');
const { getDb } = require( '../helpers/databas' );

class Interests
{
	constructor (
		interest
	)
	{
		this.interest = interest;
		}

	save ()
	{
		const db = getDb();
		return new Promise( ( res, reject ) =>
		{
			db.query( 'INSERT INTO Interests(interest) VALUES(?)'
				, [ this.interest], ( err, result ) =>
				{
					if ( err )
					{
						reject( err );
					}
					this.id = result.insertId;
					res( this.id );
				} );
		} );
	}

	static findByField ( field, data )
	{
		const db = getDb();
		return new Promise( ( res, reject ) =>
		{
			db.query( `SELECT * FROM Interests WHERE ${field}=?`, [data ], ( err, results ) =>
			{
				if ( err )
				{
					reject( err );
				}
				res( results );
			} );

		} );
	}

	static fetchAll ()
	{
		const db = getDb();
		return new Promise( ( res ) =>
		{
			db.query( 'SELECT * FROM Interests', ( err, results ) =>
			{
				if ( err )
				{
					throw ( new Error( err ) );
				}
				res( results );
			} );

		} );
	}
}

module.exports = Interests;
