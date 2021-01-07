// const sgMail = require('@sendgrid/mail');
const { getDb } = require('../helpers/databas');
const Messages = require('./Messages');

class Connections {
	constructor(
		fromUserId,
		toUserId
	) {
		this.fromUserId = fromUserId;
		this.toUserId = toUserId;
	}

	save() {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query('INSERT INTO Connections(ownerUserId, contactUserId) VALUES(?, ?); INSERT INTO Connections(ownerUserId, contactUserId) VALUES(?, ?)'
				, [this.fromUserId, this.toUserId, this.toUserId, this.fromUserId], (err, result) => {
					if (err) {
						reject(err);
					}
					res([result[0].insertId, result[1].insertId]);
				});
		});
	}

	static findByUserId(ownerUserId, contactUserId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM Connections WHERE ownerUserId=? OR contactUserId=?', [ownerUserId, contactUserId] ,(err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static delete(fromUserId, toUserId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM Connections WHERE ownerUserId=? AND contactUserId=?', [toUserId, fromUserId] , (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static DeleteProfile(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM Connections WHERE ownerUserId=? OR contactUserId=?', [userId, userId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findAllContactsByUserId(ownerUserId) {
		const db = getDb();
		const contacts = [];
		let messages = []
		return new Promise((res) => {
			db.query('SELECT * FROM Connections INNER JOIN Users ON Connections.contactUserId = Users.id INNER JOIN profilePic ON Connections.contactUserId = profilePic.userId WHERE ownerUserId=?', [ownerUserId], async (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				Promise.all(results.map(async (connection) => {
						const messagesArr = 
						await this.findAllMessagesByUserId(connection.id, ownerUserId)
							messages = messagesArr;
							return contacts.push({ id: connection.id, username: connection.username, socketId: connection.socketId, onlineStatus: connection.onlineStatus, messages, picUrl: connection.picUrl })
					})).then(() => {
						res(contacts);
					})
				});
			})
		}

	static findAllMessagesByUserId(ownerUserId, senderUserId) {

		const messageArr = []
		return new Promise((res) => {
			Messages.findAllMessagesForUser(ownerUserId, senderUserId).then((messages) => {
				messages.map((record) => {
					return messageArr.push({ message: record.message, user: record.username })
				})
				res(messageArr);
			})
		})
	}

	static findByField(field, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query(`SELECT * FROM Connections WHERE ${field}=?`, [data], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results);
			});

		});
	}

	static update(userId, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			if (!data) {
				return;
			}
			Object.keys(data).map((field) => {
				return db.query(`UPDATE Connections SET ${field}=? WHERE fromUserId=?`, [data[field], userId], (err) => {
					if (err)
						reject(err);
				});
			});
			res('updated');
		});
	}

	static fetchAll() {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM Connections', (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}
}

module.exports = Connections;
