// const sgMail = require('@sendgrid/mail');
const cloudinary = require( 'cloudinary' );
const { getDb } = require('../helpers/databas');

class ProfilePic {
	constructor(
		userId,
		picId = 'default',
		picUrl = 'https://res.cloudinary.com/dadpusvz5/image/upload/v1593685775/default.png',
	) {
		this.userId=userId
		this.picId = picId;
		this.picUrl = picUrl;
	}

	save() {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query('INSERT INTO profilePic(picId, picUrl, userId) VALUES(?, ?, ?)'
				, [this.picId, this.picUrl, this.userId], (err, result) => {
					if ( err )
					{
						reject( err )
					}
					this.id = result.insertId;
					res(this);
				})
		})
	}
	
	static findByUserId(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT picId, picUrl FROM profilePic where userId=?', [userId], (err, results) => {
				if (err) {
					throw (new Error(err))
				}
				res(results[0]);
			})

		})
	}

	static DeleteProfile(userId) {
		const db = getDb();
		this.findByUserId(userId).then(
			originalProfilePic => {
				if (originalProfilePic && originalProfilePic.id !== 'default') {
					cloudinary.v2.uploader.destroy(originalProfilePic.picId, { invalidate: true }, (err, result) => {
						if (err) {
							if (err.message !== 'not found') {
								throw new Error(err);
								
							}
						}
					});
				}
				return new Promise((res, reject) => {
					db.query(`DELETE FROM profilePic WHERE userId=${userId}`, (err, results) => {
						if (err) {
							reject(new Error(err));
						}
						res(results);
					});
				});
			})
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


	static findByField(field, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query(`SELECT * FROM profilePic WHERE ${field}=?`, [data], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results);
			})

		})
	}

	static findFirstByField(field, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query(`SELECT * FROM profilePic WHERE ${field}=?`, [data], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results[0]);
			})

		})
	}

	static update(userId, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			if (!data) {
				return;
			}
			Object.keys(data).map((field) => {
				return db.query(`UPDATE profilePic SET ${field}=? WHERE userId=?`, [data[field], userId], (err) => {
					if (err)
						reject(err);
				})
			});
			res('updated');
		})
	}

	static fetchAll() {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM profilePic', (err, results) => {
				if (err) {
					throw (new Error(err))
				}
				res(results);
			})

		})
	}
}

module.exports = ProfilePic;
