// const sgMail = require('@sendgrid/mail');
const { getDb } = require('../helpers/databas');

class BlockedUsers {
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
			db.query('INSERT INTO BlockedUsers(fromUserId, toUserId) VALUES(?, ?)'
				, [this.fromUserId, this.toUserId], (err, result) => {
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
			db.query('DELETE FROM BlockedUsers WHERE fromUserId= ? OR toUserId=?', [userId, userId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static checkIsLiked(fromUserId, toUserId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM BlockedUsers where fromUserId=? AND toUserId=?', [toUserId, fromUserId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static checkHasBeenLiked(fromUserId, toUserId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM BlockedUsers where fromUserId=? OR toUserId=?', [toUserId, fromUserId], (err, results) => {
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
			db.query(`SELECT * FROM BlockedUsers WHERE ${field}=?`, [data], (err, results) => {
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
				return db.query(`UPDATE BlockedUsers SET ${field}=? WHERE fromUserId=?`, [data[field], userId], (err) => {
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
			db.query('SELECT * FROM BlockedUsers', (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	// if it comes here assumes that like already exists therefore params will swap
	static delete(fromUserId, toUserId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('DELETE FROM BlockedUsers WHERE fromUserId=? AND toUserId=?', [fromUserId, toUserId],(err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findByUserId(fromUserId, toUserId){
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM BlockedUsers where fromUserId=? AND toUserId=?',[fromUserId, toUserId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});
		});
	}
}

module.exports = BlockedUsers;
