// const sgMail = require('@sendgrid/mail');
const { getDb } = require( '../helpers/databas' );

class Pictures
{
	constructor (
		userId,
		picId,
		picUrl
	)
	{
		this.userId = userId;
		this.picId = picId;
		this.picUrl = picUrl;
	}

	async save ()
	{
		const db = getDb();
		const pictures = await Pictures.findByUserId(this.userId)
		return new Promise( ( res, reject ) =>
		{
			if (pictures.length >= 4) {
				return reject(new Error('Please delete an image only 4 are allowed'))
			}
			db.query( 'INSERT INTO Pictures(picId, picUrl, userId) VALUES(?, ?, ?)'
				, [ this.picId, this.picUrl, this.userId ], ( err, result ) =>
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

	static async upload(file, userId) {
		if (file.mimetype.includes('image') && pictures.length < 4){
			const image = await cloudinary.uploader.upload(file.path)
			const picture = new Picture(userId, image.public_id, image.secure_url);
			await picture.save(picture)
			return res.status(200).json(image);
		}
		
	}

	static async DeleteProfile(userId) {
		const db = getDb();
		const pictures = await this.findByUserId(userId);
		await Promise.all(pictures.map((picture) => {
			this.deleteByPicId(picture.picId)
		}));
		return new Promise((res) => {
			db.query('DELETE FROM Pictures WHERE userId=?', [userId], (err, results) => {
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
			db.query( 'SELECT * FROM Pictures where userId=?', [userId], ( err, results ) =>
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
			db.query( `SELECT * FROM Pictures WHERE ${field}=?`, [data], ( err, results ) =>
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
				return db.query( `UPDATE Pictures SET ${field}=? WHERE userId=?`, [data[ field ], userId ], ( err ) =>
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
			db.query( 'SELECT * FROM Pictures', ( err, results ) =>
			{
				if ( err )
				{
					throw ( new Error( err ) );
				}
				res( results );
			} );

		} );
	}

	static findByPicId ( picId )
	{
		const db = getDb();
		return new Promise( ( res ) =>
		{
			db.query( 'SELECT * FROM Pictures WHERE picId=?', [picId] , ( err, results ) =>
			{				
				if ( err )
				{
					throw ( new Error( err ) );
				}
				return res( results[0] );
			});

		});
	}

	static async deleteByPicId ( picId )
	{

		const db = getDb();
		try
		{
			const result = await this.findByPicId( picId );			
			return db.query( 'DELETE FROM Pictures WHERE id=?',[result.id], ( err, results ) =>
			{
				if ( err )
				{
					throw ( new Error( err ) );
				}
				return results
			});
		}
		catch ( err )
		{
			throw new Error(err)
		}

	}
}

module.exports = Pictures;
