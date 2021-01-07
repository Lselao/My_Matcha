// const sgMail = require('@sendgrid/mail');
const { getDb } = require('../helpers/databas');

class Messages {
	constructor(
		message,
		ownerUserId,
		senderUserId
	) {
		this.ownerUserId = ownerUserId;
		this.senderUserId = senderUserId;
		this.message = message;
	}

	save() {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query('INSERT INTO Messages(ownerUserId, senderUserId, message) VALUES(?, ?, ?)'
				, [this.ownerUserId, this.senderUserId, this.message], (err, result) => {
				if (err) {
					reject(err);
				}
				this.id = result.insertId;
				res(this);
			});
		});
	}

	static DeleteProfile(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM Messages WHERE ownerUserId=? OR senderUserId=?', [userId, userId],  (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findByField(field, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query(`SELECT * FROM Messages WHERE ${field}=?`, [data], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results);
			});

		});
	}


	static fetchAll() {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM Messages', (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	// if it comes here assumes that like already exists therefore params will swap
	static delete(ownerUserId, senderUserId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM Messages WHERE ownerUserId=? AND senderUserId=?', [ownerUserId, senderUserId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findAllMessagesForUser(ownerUserId, senderUserId){
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM Messages INNER JOIN Users ON Messages.ownerUserId = Users.id WHERE ownerUserId=? AND senderUserId=? OR ownerUserId=? AND senderUserId=? ORDER BY Messages.id ASC', [ownerUserId, senderUserId, senderUserId, ownerUserId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});
		});
	}
}

module.exports = Messages;
