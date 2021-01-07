// const sgMail = require('@sendgrid/mail');
const { getDb } = require( '../helpers/databas' );

class UserInterests
{
	constructor (
		userId,
		interestId
	)
	{
		this.userId = userId;
		this.interestId = interestId;
		}

	save ()
	{
		const db = getDb();
		return new Promise( ( res, reject ) =>
		{
			db.query( 'INSERT INTO UserInterests(interestId, userId) VALUES(?, ?)'
				, [ this.interestId, this.userId ], ( err, result ) =>
				{
					if ( err )
					{
						reject( err );
					}
					this.id = result.insertId;
					res( result.insertId );
				} );
		} );
	}

	static DeleteProfile(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM UserInterests WHERE userId=?', [userId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findExisting ( userId, interestId )
	{
		const db = getDb();
		return new Promise( ( res ) =>
		{
			db.query( 'SELECT * FROM UserInterests where userId=? AND interestId=? ORDER BY ID DESC', [userId, interestId], ( err, results ) =>
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
			db.query( `SELECT * FROM UserInterests WHERE ${field}=?`, [data], ( err, results ) =>
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
				return db.query( `UPDATE UserInterests SET ${field}=? WHERE userId=?`, [data[ field ], userId ], ( err ) =>
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
			db.query( 'SELECT * FROM UserInterests', ( err, results ) =>
			{
				if ( err )
				{
					throw ( new Error( err ) );
				}
				res( results );
			} );

		} );
	}

	static deleteInterest (userId, interestId)
	{
		const db = getDb();
		return new Promise( ( res ) =>
		{
			db.query( 'DELETE FROM UserInterests WHERE userId=? AND interestId=?', [userId, interestId], ( err, results ) =>
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

module.exports = UserInterests;
