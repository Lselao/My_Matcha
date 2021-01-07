// const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('../helpers/databas');
const Likes = require('./Likes');
const Connections = require('./Connections');
const ProfilePic = require('./profilePictures');
const UserInterests = require('./UserInterests');
const Picture = require('./Picture');
const Messages = require('./Messages');
const Notification = require('./Notifications');
const Views = require('./Views');
const Email = require('../middleware/email');
const UserLocation = require('./UserLocations')

class User {
	constructor(
		username,
		password,
		email,
		firstName,
		lastName,
		age,
		id,
		bio = '',
		profilePic = {
			id: 'default', picUrl: 'https://res.cloudinary.com/dadpusvz5/image/upload/v1593685775/default.png'
		},
		pageViewHistory = [],
		gender,
		pictures = [],
		interests = [],
		resetToken = null,
		resetTokenExpiration = null
	) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.id = id;
		this.pageViewHistory = pageViewHistory;
		this.pictures = pictures;
		this.interests = interests;
		if (bio) this.bio = bio;
		else this.bio = '';
		if (gender) this.gender = gender;
		else this.gender = '';
		if (age) this.age = age;
		else this.age = '18';
		if (profilePic) this.profilePic = profilePic;
		this.resetToken = resetToken;
		this.fameRating = 0;
		this.resetTokenExpiration = resetTokenExpiration;
	}

	save() {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query('INSERT INTO Users(username, password, email, firstName, lastName, bio, age, resetToken, resetTokenExpiration, onlineStatus, notificationCount, fameRating) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?)'
				, [this.username, this.password, this.email, this.firstName, this.lastName, this.bio, this.age, this.resetToken, this.resetTokenExpiration, 1, 0, 0], (err, result) => {
					if (err)
						reject(err);
					this.id = result.insertId;
					res(this);
				});
		});
	}

	static findById(userId) {
		return new Promise((res, reject) => {
			this.fetchFullProfile(userId).then((results, err) => {
				if (err) {
					reject(new Error(err));
				}
				res(results);
			})

		});
	}



	static findFirstByField(field, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query(`SELECT * FROM Users WHERE ${field}=?`, [data], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results[0]);
			});

		});
	}

	static findByField(field, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query(`SELECT * FROM Users WHERE ${field}=?`, [data], (err, results) => {
				if (err) {
					reject(new Error(err));
				}
				res(results);
			});

		});
	}

	static async findByName(name) {
		let result;
		result = await User.findByField('username', name)
		if (result.length > 0) {
			return result;
		}
		result = await User.findByField('firstName', name)
		if (result.length > 0) {
			return result;
		}
		result = User.findByField('lastName', name)
		if (result.length > 0) {
			return result;
		}
		return result
	}

	static async deleteFullProfile(userId) {
		try {
			await Connections.DeleteProfile(userId);
			await Likes.DeleteProfile(userId);
			await ProfilePic.DeleteProfile(userId);
			await Notification.DeleteProfile(userId);
			await UserInterests.DeleteProfile(userId);
			await Messages.DeleteProfile(userId);
			await Picture.DeleteProfile(userId);
			await UserLocation.DeleteProfile(userId);
			await this.deleteByUserId(userId);
		}
		catch (err) {
			throw new Error(err);
		}
	}

	static deleteByUserId(userId) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query('DELETE FROM Users WHERE id=?', [userId], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results);
			});
		});
	}

	static update(userId, data) {
		const db = getDb();
		let query = ''
		const placeholders = []
		return new Promise((res, reject) => {
			if (!data) {
				return;
			}
			Object.keys(data).map((field) => {
				query += `UPDATE Users SET ${field}=? WHERE id=?;`;
				placeholders.push(data[field], userId)
			});
			db.query(query, placeholders, (err) => {
				if (err)
					reject(err);
				res('updated')
			});
		});
	}

	static fetchAll() {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM Users', (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static async verifyDetails(field, data) {
			if (field.includes('Name')) {
				if (!/^[a-zA-Z]+$/.test(data[field])) {
					throw(new Error('Please give a valid name'));
				}
			}
			else if (field.includes('username')) {
				const user = await this.findByField('username', data[field])
				if (user.length !== 0) {
					throw(new Error('Username already taken'));
				}
				if (!/^[a-zA-Z0-9]+$/.test(data[field])) {
					throw(new Error('Please give a valid username'));
				}
			}
			else if (field.includes('email')) {
				const email = await this.findByField('email', data[field]);
				if (email.length !== 0) {
					throw(new Error('Email already taken'));
				}
				// eslint-disable-next-line no-useless-escape
				if (!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(data[field])) {
					throw(new Error('Please give a valid email'));
				}
			}
			else if (field.includes('age')) {
				if (!/^[0-9]+$/.test(data[field])) {
					throw(new Error('Please give a valid age'));
				}
				if ((parseInt(data[field]) >= 50) || (parseInt(data[field]) < 18)) {
					throw(new Error('Users can only be between 18 and 50 inclusive'));
				}
			}
			else if (field.includes('bio')) {
				if (!/^[0-9A-Za-z ]+$/.test(data[field])) {
					throw(new Error('Please give remove any non-alphanumeric characters'))
				}
				if (data[field].length >= 240) {
					throw(new Error('Please shorten the text t)o 240 characters or less'))
				}
			}
			else if (field.includes('password')) {
				if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(data[field])) {
					throw new Error('Password requires at least a lowercase letter, an uppercase letter, a number and must be 6 characters long')
				}
			}
			else {
				
				return('verified')
		}
	}

	static fetchFullProfile(userId) {
		const db = getDb()
		let userObject;
		const queries = {
			userFindById: 'SELECT * FROM Users where id=?',
			pictureFindByUserId: 'SELECT picId, picUrl FROM Pictures where userId=?',
			profilePicFindByUserId: 'SELECT picId, picUrl FROM profilePic where userId=?',
			interests: 'SELECT * FROM UserInterests INNER JOIN Interests ON UserInterests.interestId = Interests.id  WHERE userId=?',
			views: 'SELECT COUNT(*) FROM Views WHERE toUserId=?',
			likes: 'SELECT COUNT(*) FROM Likes WHERE toUserId=?',
			userLocations: 'SELECT * FROM UserLocations INNER JOIN AllLocations ON UserLocations.locationId=AllLocations.id WHERE userId=?',
			pageViewHistory: 'SELECT * FROM PageViewHistory'
		}
		return new Promise((resolve, reject) => {
			try {
				db.query(`${queries.userFindById}; ${queries.pictureFindByUserId}; ${queries.profilePicFindByUserId}; ${queries.interests}; ${queries.views}; ${queries.pageViewHistory}; ${queries.userLocations}`, [userId, userId, userId, userId, userId, userId], (err, results) => {
					userObject = { ...results[0][0], pictures: [...results[1]], profilePic: { ...results[2][0] }, interests: [], views: results[4][0]['COUNT(*)'], pageViewHistory: [], location: results[6][0] }
					results[3].map(interest => {
						return userObject.interests.push({ interestId: interest.interestId, interest: interest.interest })
					})
					if (userObject.lastSeen) {
						const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
						const lastSeen = userObject.lastSeen.toLocaleString('en-US', options)
						userObject.lastSeen = lastSeen;
					}
					resolve(userObject)
				})
			}
			catch (err) {
				reject(err)
			}

		})
	}

	static incrementNotify(userId) {
		const db = getDb()
		return new Promise((res) =>
			db.query('UPDATE Users SET notificationCount = notificationCount + 1 WHERE id=?', [userId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			})
		);
	}

	static resetNotify(userId) {
		const db = getDb()
		return new Promise((res) =>
			db.query('UPDATE Users SET notificationCount = 0 WHERE id=?', [userId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			})
		);
	}

	static async updateFameRating(userId) {
		let res
		try {
			let likes = await Likes.noOfLikes(userId);
			let views = await Views.noOfViews(userId);
			if (views.length === 0 || likes.length === 0) {
				res = this.update(userId, { fameRating: 0 });
			}
			else {
				likes = likes[0]['COUNT(*)']
				views = views[0]['COUNT(*)']
				const fameRating = ((likes / views) * 5).toFixed(2);
				res = await this.update(userId, { fameRating });
			}
			return res;
		}
		catch (err) {
			throw new Error(err);
		}
	}

	static async fetchFullProfiles() {
		const userList = [];
		try {
			const users = await this.fetchAll();
			const promises = users.map((user) => {
				return this.fetchFullProfile(user.id).then((userProfile) => {
					return userList.push(userProfile);
				})
			})
			return Promise.all(promises).then(() => {
				return (userList)

			})
		}
		catch (err) {
			throw new Error(err)
		}
	}
	
	// eslint-disable-next-line class-methods-use-this
	static resetPasswordHelper(){
		return new Promise((res, rej) => {
			crypto.randomBytes(32, (err, buffer) => {
				if (err) {
					rej(new Error(err));
				}
				res(buffer);
			})
		});
	}

	static async resetPassword(email) {
		try {
			if (typeof(email) !== 'undefined') {
				const buffer = await this.resetPasswordHelper();
				const token = buffer.toString('hex');
				const user = await User.findFirstByField('email', email)
				if (!user) {
					throw new Error('User not found');
				}
				const resetUser = { ...user };
				resetUser.resetToken = token;
				await User.update(user.id, { resetTokenExpiration: Date.now() + 3600000, resetToken: token });
				Email.PasswordResetEmail(email, token);
				return {message: 'success'}
			}
				throw new Error('Please enter an email')
		}
		catch (err){
			throw new Error(err);
		}
	}


}

module.exports = User;
