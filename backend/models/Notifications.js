// const sgMail = require('@sendgrid/mail');
const { getDb } = require( '../helpers/databas' );

class Notifications
{
	constructor (
		userId,
		message
	)
	{
		this.userId = userId;
		this.message = message;
		}

	save ()
	{
		const db = getDb();
		return new Promise( ( res, reject ) =>
		{
			db.query( 'INSERT INTO Notifications(message, userId) VALUES(?, ?)'
				, [ this.message, this.userId ], ( err, result ) =>
				{
					if ( err )
					{
						reject( err );
					}
					this.id = result.insertId;
					res( this );
				} );
		} );
	}

	static DeleteProfile(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM Notifications WHERE userId=?', [userId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findByUserId ( userId )
	{
		const db = getDb();
		return new Promise( ( res ) =>
		{
			db.query( 'SELECT * FROM Notifications where userId=? ORDER BY ID DESC', [userId], ( err, results ) =>
			{
				if ( err )
				{
					throw ( new Error( err ) );
				}
				res( results );
			} );

		} );
	}

	static findByField ( field, data )
	{
		const db = getDb();
		return new Promise( ( res, reject ) =>
		{
			db.query( `SELECT * FROM Notifications WHERE ${field}=?`, [data], ( err, results ) =>
			{
				if ( err )
				{
					reject( err );
				}
				res( results );
			} );

		} );
	}

	static update ( userId, data )
	{
		const db = getDb();
		return new Promise( ( res, reject ) =>
		{
			if ( !data )
			{
				return;
			}
			Object.keys( data ).map( ( field ) =>
			{
				return db.query( `UPDATE Notifications SET ${field}=? WHERE userId=?`, [data[ field ], userId ], ( err ) =>
				{
					if ( err )
						reject( err );
				} );
			} );
			res( 'updated' );
		} );
	}

	static fetchAll ()
	{
		const db = getDb();
		return new Promise( ( res ) =>
		{
			db.query( 'SELECT * FROM Notifications', ( err, results ) =>
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

module.exports = Notifications;
