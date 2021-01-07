/* eslint-disable no-param-reassign */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('config');
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const ProfilePic = require('../models/profilePictures');
const User = require('../models/users');
const Picture = require('../models/Picture');
const Validator = require('../validator/myValidator');
const UserLocations = require('../models/UserLocations');
const AllLocations = require('../models/AllLocations');
const Email = require('../middleware/email');

cloudinary.config({
	cloud_name: 'dadpusvz5',
	api_key: '828261552626268',
	api_secret: 'OxeXIZqHl8HwHVNLM5OfSYz__uo'
});

const ConfirmEmail = (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			// throw new Error(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findFirstByField('username', req.body.username)
			.then(user => {
				if (!user) {
					req.session.save(sessionErr => {
						return res.redirect('/reset');
					});
				}
				const resetUser = { ...user };
				resetUser.resetTokenExpiration = Date.now() + 3600000;
				resetUser.resetToken = token;
				User.update(resetUser.id, {
					'resetTokenExpiration': Date.now() + 3600000,
					'resetToken': token
				});
			})
			.then(() => {
				Email.ConfirmationEmail(req.body.email, token);
			})
			.catch(transportErr => res.status(400).json(new Error(transportErr)));
	});
};

exports.postSignUp = async (req, res) => {
	const { location, locationReal } = req.body;
	const userData = Validator(req, res);
	if (userData.empty === true) {
		userData.errors.push('Please fill out all fields');
		return res.status(400).json({ msg: JSON.stringify(userData.errors) });
	}
	try {
		const user = await User.findByField('username', userData.username)
		const email = await User.findByField('email', userData.email);
		if (user.length !== 0) {
			userData.errors.push('Username Is Already Taken');
		}
		if (email.length !== 0) {
			userData.errors.push('Email Is Already Taken');
		}
		if (userData.errors.length > 0) {
			return res.status(400).json({ msg: JSON.stringify(userData.errors) });
		}
		const hashedPassword = await bcrypt.hash(userData.password, 12)
		const newUser = new User(
			userData.username,
			hashedPassword,
			userData.email,
			userData.firstName,
			userData.lastName,
			userData.age
		);
		const userInfo = await newUser.save();
		const userLocation = await UserLocations.postLocation(userInfo.id, location, locationReal);
		let newUserInfo = userInfo;
		const profilePic = new ProfilePic(newUserInfo.id);
		profilePic.save();
		ConfirmEmail(req, res);
		newUserInfo = { ...newUserInfo, location: userLocation }
		jwt.sign({ id: newUserInfo.id }, config.get('jwtSecret'), { expiresIn: 3600 },
			(err, token) => {
				if (err) throw err;
				res.json({
					token,
					user: newUserInfo
				});
			});
	}
	catch (err) {
		res.status(400).json(new Error(err))
	};
	return null;
};

exports.postLogin = async (req, res) => {
	const { username, password, userSocketId } = req.body;
	if (!username || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}
	const user = await User.findFirstByField('username', username)
	if (!user) {
		return res.status(400).json({ msg: 'User does not exist' });
	}
	const doMatch = await bcrypt.compare(password, user.password)
	if (!doMatch) {
		return res.status(400).json({ msg: 'Invalid Username or Password' });
	}
	return jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 3600 },
		async (err, token) => {
			if (err) throw err;
			await User.update(user.id, { 'onlineStatus': true, 'socketId': userSocketId })

			const userInfo = await User.fetchFullProfile(user.id)
			res.json({
				token,
				user: userInfo
			});
		});
};

exports.postLogout = async (req, res) => {
	const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	const { id } = req.body
	await User.update(id, { 'onlineStatus': false, 'socketId': null, 'lastSeen': date })
	res.send({ message: 'success' })
};

exports.postReset = async (req, res) => {
	const { email } = req.body;
	try {
		await User.resetPassword(email);
		res.status(200).json({ message: 'Reset link sent!' })
	}
	catch (err) {
		res.status(400).json({ message: err.message })
	}
};

exports.getNewPassword = (req, res) => {
	const { token } = req.params;
	User.findFirstByField('resetToken', token)
		.then(user => {
			if (user.resetTokenExpiration < Date.now()) {
				req.flash('error', 'link has expired');
				return res.redirect('/reset');
			}
			return res.render('auth/newPassword', {
				pageTitle: 'Change Password',
				path: '/new-password',
				errorMessage: req.flash('error'),
				userId: user.id.toString(),
				passwordToken: token
			});
		})
		.catch(err => res.status(400).json(new Error(err)));
};

exports.resetPasswordConfirm = async (req, res) => {
	const { token } = req.body;
	const { password } = req.body;
	let resetUser;
	try {
		const user = await User.findFirstByField('resetToken', token)
		if (!user) {
			throw new Error('invalid token');
		}
		resetUser = user;
		if (user.resetTokenExpiration < Date.now()) {
			throw new Error('Link is expired')
		}
		resetUser.resetToken = null;
		resetUser.resetTokenExpiration = null;
		resetUser.password = password;
		await User.verifyDetails('password', resetUser);
		resetUser.password = await bcrypt.hash(password, 12)
		await User.update(resetUser.id, resetUser)
		res.status(200).json('success')
	}
	catch(err){
		res.status(400).json(err.message)
	}
};

exports.checkToken = async (req, res) => {
	const { token } = req.params;
	try {
		const user = await User.findFirstByField('resetToken', token)
		if (!user) {
			throw new Error('invalid token');
		}
		res.status(200).json('success')
	}
	catch (err) {
		res.status(400).json(err.message)
	}
}

exports.getEmailConfirmation = (req, res) => {
	const { token } = req.params;
	let resetUser;
	User.findFirstByField('resetToken', token)
		.then(user => {
			resetUser = user;
			if (user.resetTokenExpiration < Date.now()) {
				req.flash('error', 'link has expired');
				return res.redirect('/reset');
			}
			resetUser.resetToken = null;
			resetUser.resetTokenExpiration = null;
			User.update(resetUser.id, { resetToken: null, resetTokenExpiration: null });
			return res.redirect('/');
		})
		.catch(err => res.status(400).json(new Error(err)));
};


exports.postNewPassword = (req, res) => {
	let userId;

	User.findFirstByField('resetToken', req.body.token)
		.then(user => {
			userId = user.id;
			return bcrypt.hash(req.body.password, 12);
		})
		.then(password => {
			if (req.body.password == req.body.confirmPassword) {
				User.update(userId, { 'password': password, 'resetToken': null, 'resetTokenExpiration': null });
				res.status(200);
			}
			res.status(200).json({ message: 'Passwords are not the same' })
		})
		.catch(err => res.status(400).json(new Error(err)));
};

exports.postDetails = async (req, res) => {
	const { id } = req.body.user;
	const { field } = req.body;
	const value = req.body.user[`${field}`];
	const userDetails = {}
	try {
		const user = await User.findById(id);
		userDetails[`${field}`] = value;
		await User.verifyDetails(field, userDetails);
		if (field === 'password') {
			userDetails[`${field}`] = await bcrypt.hash(value, 12)
		}
		await User.update(id, userDetails)
		return res.json({ ...user, ...userDetails });

	}
	catch (err) {
		res.status(400).json(err.message);
	}
};

exports.getUser = async (req, res) => {
	const { socketId } = req.params
	const { id } = req.user
	if (id) {
		try {
			await User.findById(req.user.id);
			await User.update(req.user.id, { socketId })
			const user = await User.fetchFullProfile(req.user.id)
			res.status(200).json({ ...user });
		}
		catch (err) {
			res.status(400).json({ message: err.message, success: false })
		}
	}
	else {
		res.status(400).json({ message: 'please sign in', success: false })
	}
};


exports.postImageUpload = async (req, res) => {
	const { file } = req;
	const { userId } = req.body;
	try {
		if (!file.mimetype.includes('image')) {
			throw new Error('Please upload an image')
		}
		const image = await cloudinary.uploader.upload(file.path)
		const picture = new Picture(userId, image.public_id, image.secure_url);
		await picture.save(picture)
		return res.status(200).json(image);
	}
	catch (err) {
		res.status(400).json(err.message)
	}
};

exports.postProfilePicUpload = async (req, res) => {
	const { file } = req;
	const { userId } = req.body;

	try {
		if (!file.mimetype.includes('image')) {
			throw new Error('Please upload an image')
		}
		const image = await cloudinary.uploader.upload(file.path);
		const originalProfilePic = await ProfilePic.findByUserId(userId);
		if (originalProfilePic.picId !== 'default') {
			cloudinary.v2.uploader.destroy(originalProfilePic.picId, { invalidate: true }, (err) => {
				if (err) {
					return res.status(400).json(new Error(err));
				}
			});
		}
		await ProfilePic.update(userId, { picUrl: image.secure_url, picId: image.public_id })
		res.status(200).json({ picUrl: image.secure_url, picId: image.public_id });
	}
	catch (err) {
		res.status(400).json(err.message);
	}
};

exports.deleteImage = (req, res) => {
	const { id } = req.body;
	Picture.deleteByPicId(id).then(() => {
		cloudinary.v2.uploader.destroy(id, { invalidate: true }, (err) => {
			if (!err) {
				res.status(200).json({ message: 'SUCCESS' });
			}
			else {
				res.json(err);
			}
		});
	})
};

exports.getLocations = (req, res) => {
	AllLocations.fetchAll().then(result => {
		res.send(result)
	})
}

exports.getSameLocations = async (req, res) => {
	let userLocation;
	const fullProfiles = [];
	UserLocations.fetchAll().then(async result => {
		result.forEach(element => {
			if (element.UserId === req.body.userId) {
				userLocation = element.LocationId
			}
		});
		const users = [];
		result.forEach(elm => {
			if (elm.LocationId === userLocation && req.body.userId !== elm.UserId) {
				users.push(elm)
			}
		})
		for (user of users) {
			User.findById(user.UserId).then(result => {
				fullProfiles.push(result)
				if (fullProfiles.length === users.length) {
					res.send(fullProfiles)
				}
			})
		}
	})
}

// Update user custom location
exports.postLocations = (req, res) => {
	UserLocations.updateUserLocationByUserId(req.body.locationId, req.body.userId).then((result) => {
		UserLocations.fetchAll().then(result => {
			return res.send(result)
		})
	})
}

