const Likes = require('../models/Likes');
const Connection = require('../models/Connections');
const User = require('../models/users');
const Notifications = require('../models/Notifications');
const Messages = require('../models/Messages');
const Interests = require('../models/Interests');
const UserInterests = require('../models/UserInterests');
const Reports = require('../models/Reports');
const BlockedUsers = require('../models/BlockedUsers');
const AllLocations = require('../models/AllLocations');
const UserLocations = require('../models/UserLocations');

exports.Like = async (req, res) => {
	const { fromUserId } = req.body;
	const { toUserId } = req.body;

	try {
		const LikeObj = new Likes(fromUserId, toUserId);
		const result = await Likes.checkIsLiked(fromUserId, toUserId)
		if (result.length === 0) {
			await LikeObj.save()
			await User.updateFameRating(toUserId);
			res.status(200).json({ message: 'saved' })
		}		
		else {
			if (result.length === 1) {
				const connection = new Connection(fromUserId, toUserId);
				connection.save()
			}
			await LikeObj.save()
			await User.updateFameRating(toUserId);
			res.status(200).json({ message: 'connected' })
		}
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.Dislike = async (req, res) => {
	const { fromUserId } = req.body;
	const { toUserId } = req.body;
	try {
		const isConnection = await Connection.findByUserId(fromUserId, toUserId)
		if (isConnection.length > 0) {
			await Connection.delete(fromUserId, toUserId)
			await Connection.delete(toUserId, fromUserId)
		}
		await Likes.delete(fromUserId, toUserId)
		await User.updateFameRating(toUserId);
		res.status(200).send({ Message: 'success' });
	} catch (error) {
		res.status(400).send({ Message: error, success: 'false' });
	}
}

exports.getConnections = async (req, res) => {
	const { currentUserId } = req.params;
	try {
		const result = await Connection.findAllContactsByUserId(currentUserId)
		if (result.length !== 0) {
			res.send(result);
		}
		else {
			res.send(false)

		}
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}
exports.getNotifications = async (req, res) => {
	const { currentUserId } = req.params;
	try {
		const result = await Notifications.findByUserId(currentUserId)
		if (result.length !== 0) {
			res.status(200).send(result);
		}
		else {
			res.status(200).send([])
		}
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.getIsConnection = async (req, res) => {
	const { currentUserId } = req.params;
	const { visitedUserId } = req.params;
	try {
		const result = await Connection.findByUserId(currentUserId, visitedUserId)
		if (result.length !== 0) {
			res.status(200).send(true);
		}
		else {
			res.status(200).send(false)
		}
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}
exports.getIsLiked = async (req, res) => {
	const { currentUserId } = req.params;
	const { visitedUserId } = req.params;
	if(currentUserId !== 'undefined' &&  visitedUserId !== 'undefined')
	{
		try {
			const result = await Likes.findByUserId(currentUserId, visitedUserId)
			if (result.length !== 0) {
				res.status(200).send(true)

			}
			else {
				res.status(200).send(false)
			}

		}
		catch (err) {
			res.status(400).json({ message: err.message, success: false })
		}
	}
	else {
		res.status(400).json({ message: 'invalid request', success: false })
	}
}
exports.getIsReported = async (req, res) => {
	const { currentUserId } = req.params;
	const { visitedUserId } = req.params;
	try {
		const result = await Reports.findByUserId(currentUserId, visitedUserId)
		if (result.length !== 0) {
			res.status(200).send(true)

		}
		else {
			res.status(200).send(false)
		}

	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}
exports.getIsBlocked = async (req, res) => {
	const { currentUserId } = req.params;
	const { visitedUserId } = req.params;
	try {
		const result = await BlockedUsers.findByUserId(currentUserId, visitedUserId)
		if (result.length !== 0) {
			res.status(200).send(true)

		}
		else {
			res.status(200).send(false)
		}

	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.saveMessage = async (req, res) => {
	const { ownerUserId } = req.body;
	const { senderUserId } = req.body;
	const { message } = req.body;
	try {
		await new Messages(message, ownerUserId, senderUserId)
		res.status(200).send(true)
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.getMessages = async (req, res) => {
	const { ownerUserId } = req.params;
	try {
		const result = await Messages.findAllMessagesForUser(ownerUserId)
		res.status(200).json(result)
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.addInterests = async (req, res) => {
	let { interest } = req.body;
	const { userId } = req.body;
	interest = interest.replace(/[\\$'"]/g, '\\$&')
	try {
		const result = await Interests.findByField('interest', interest);
		if (result.length === 0) {
			const newInterest = new Interests(interest);
			const interestId = await newInterest.save();
			const newUserInterest = new UserInterests(userId, interestId);
			await newUserInterest.save();
			res.json({ 'success': true, interestId });
		}
		else {
			const exists = await UserInterests.findExisting(userId, result[0].id)
			if (exists.length === 0) {
				const newUserInterest = new UserInterests(userId, result[0].id);
				const interestId = await newUserInterest.save();
				res.json({ 'success': true, interestId });
			}
			else {
				throw new Error('already exists')
			}
		}
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.deleteInterest = async (req, res) => {
	const { interestId } = req.body;
	const { userId } = req.body;
	try {
		await UserInterests.deleteInterest(userId, interestId);
		res.json({ message: 'success' });
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.deleteUser = async (req, res) => {
	const { userId } = req.params;
	try {
		await User.deleteFullProfile(userId);
		res.json({ message: 'success' });
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.blockUser = async (req, res) => {
	const { userId } = req.params;
	const { visitedUserId } = req.params;
	try {
		Connection.delete(userId, visitedUserId);
		Likes.delete(userId, visitedUserId);
		Likes.delete(visitedUserId, userId);
		Connection.delete(visitedUserId, userId);
		const blockUser = new BlockedUsers(userId, visitedUserId); 
		blockUser.save();
		res.json({ message: 'success' });
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.reportUser = async (req, res) => {
	const { userId } = req.params;
	const { visitedUserId } = req.params;
	try {
		const report = new Reports(userId, visitedUserId); 
		report.save();
		res.json({ message: 'success' });
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}
exports.getLocations = async (req, res) => {
	try {
		const allLocations = await AllLocations.fetchAll();
		res.status(200).json(allLocations);
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

exports.updateLocation = async (req, res) => {
	const { userId, locationId } = req.body;
	try {
		await UserLocations.updateUserLocationByUserId(locationId, userId);
		const {Id, locationName} = await AllLocations.findByLocationId(locationId);
		res.status(200).json({Id, locationName});
	}
	catch (err) {
		res.status(400).json({ message: err.message, success: false })
	}
}

