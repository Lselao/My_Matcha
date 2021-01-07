const Notifications = require('../models/Notifications')
const Message = require('../models/Messages')
const User = require('../models/users');
const Views = require('../models/Views');

exports.makeSocket = (io) => {
	io.on('connection', (socket) => {		
		

		socket.emit('connection')

		socket.on('input', (message, toUser, fromUser) => {
			const savedMessage = new Message(message, fromUser.id, toUser.id);
			savedMessage.save();
			io.to(toUser.socketId).emit('message', message, fromUser.username);
		});

		socket.on('update', () => {
			socket.broadcast.emit('update');
		});

		socket.on('updateAll', () => {
			io.sockets.emit('update');
		});

		socket.on('notification send', async (message, { socketId, id }, currentUserId = null) => {
			if (id) {	
				await new Notifications(id, message).save();
				await User.incrementNotify(id);
				if (currentUserId) {
					const isViewed = await Views.checkIsViewed(currentUserId, id);
					if (isViewed.length === 0) {
						await new Views(currentUserId, id).save();
						await User.updateFameRating(id);
					}
				}
				if(socketId){
					io.to(socketId).emit('notification', {message})
				}
			}
		})

		socket.on('socketUpdate', async(userId, socketId) => {
			await User.update(userId, { socketId })
			socket.emit('update');
		})

		socket.on('notification read', (userId) => {
			User.resetNotify(userId);
		})

		socket.on('disconnect', () => {
			console.log('Client disconnected', socket.id);
		});
	});	
}
