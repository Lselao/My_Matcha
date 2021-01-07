DROP TABLE IF EXISTS shauneoh_matcha.profilePic;
DROP TABLE IF EXISTS shauneoh_matcha.PageViewHistory;
DROP TABLE IF EXISTS shauneoh_matcha.Pictures;
DROP TABLE IF EXISTS shauneoh_matcha.Interests;
DROP TABLE IF EXISTS shauneoh_matcha.Users;
DROP TABLE IF EXISTS shauneoh_matcha.Likes;
DROP TABLE IF EXISTS shauneoh_matcha.Reports;
DROP TABLE IF EXISTS shauneoh_matcha.BlockedUsers;
DROP TABLE IF EXISTS shauneoh_matcha.Connections;
DROP TABLE IF EXISTS shauneoh_matcha.Notifications;
DROP TABLE IF EXISTS shauneoh_matcha.Messages;
DROP TABLE IF EXISTS shauneoh_matcha.Interests;
DROP TABLE IF EXISTS shauneoh_matcha.UserInterests;
DROP TABLE IF EXISTS shauneoh_matcha.Views;
DROP TABLE IF EXISTS shauneoh_matcha.AllLocations;
DROP TABLE IF EXISTS shauneoh_matcha.UserLocations;




CREATE TABLE IF NOT EXISTS shauneoh_matcha.Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
	bio VARCHAR(255),
	age SMALLINT,
    gender VARCHAR(255),
    sexualPref VARCHAR(255),
	resetToken VARCHAR(255),
	resetTokenExpiration VARCHAR(255),
	onlineStatus TINYINT,
	socketId VARCHAR(200),
    lastSeen TIMESTAMP NULL,
    notificationCount INT NOT NULL,
    fameRating decimal(4,2) NOT NULL,
	CONSTRAINT user_id PRIMARY KEY (id)
)ENGINE=INNODB;

-- Create a new table called 'Pcitures' in schema 'shauneoh_matcha'
-- Drop the table if it already exists
-- Create the table in the specified schema

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Pictures
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	picId VARCHAR(255) NOT NULL,
	picUrl VARCHAR(255) NOT NULL,
	userId  INT NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(id)  ,
	CONSTRAINT profile_pic_ID PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Likes
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	toUserId VARCHAR(255) NOT NULL,
	fromUserId VARCHAR(255) NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES Users(id),
    FOREIGN KEY (toUserId) REFERENCES Users(id), 
	CONSTRAINT like_id PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Connections
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	ownerUserId INT NOT NULL,
	contactUserId INT NOT NULL,
    FOREIGN KEY (ownerUserId) REFERENCES Users(id),
    FOREIGN KEY (contactUserId) REFERENCES Users(id),
	CONSTRAINT connection_id PRIMARY KEY (id)
);

-- Create a new table called 'Interests' in schema 'shauneoh_matcha'
-- Drop the table if it already exists

-- Create the table in the specified schema



-- Create the table in the specified schema
CREATE TABLE shauneoh_matcha.PageViewHistory
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	page VARCHAR(50) NOT NULL,
	userId INT(50) NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(id)  ,
	CONSTRAINT page_view_history_id PRIMARY KEY (id)
);


-- Create a new table called 'profilePic' in schema 'shauneoh_matcha'
-- Drop the table if it already exists


-- Create the table in the specified schema
CREATE TABLE shauneoh_matcha.profilePic
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	picId VARCHAR(255) NOT NULL,
	picUrl VARCHAR(255) NOT NULL,
	userId  INT NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(id)  ,
	CONSTRAINT profile_pic_ID PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Notifications
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	message VARCHAR(255) NOT NULL,
	userId  INT NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(id)  ,
	CONSTRAINT notification_ID PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Messages
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	message VARCHAR(255) NOT NULL,
	ownerUserId  INT NOT NULL,
	FOREIGN KEY (ownerUserId) REFERENCES Users(id)  ,
	senderUserId  INT NOT NULL,
	FOREIGN KEY (senderUserId) REFERENCES Users(id)  ,
	CONSTRAINT message_ID PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.UserInterests
(
	id INT NOT NULL AUTO_INCREMENT, -- primary key column
	interestId INT NOT NULL,
	userId  INT NOT NULL,
	FOREIGN KEY (userId) REFERENCES Users(id)  ,
	FOREIGN KEY (interestId) REFERENCES Interests(id)  ,
	CONSTRAINT UserInterest_ID PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Interests
(
	id INT NOT NULL AUTO_INCREMENT, -- primary key column
	interest VARCHAR(255) NOT NULL,
	CONSTRAINT Interest_ID PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.BlockedUsers
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	toUserId VARCHAR(255) NOT NULL,
	fromUserId VARCHAR(255) NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES Users(id),
    FOREIGN KEY (toUserId) REFERENCES Users(id), 
	CONSTRAINT like_id PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS shauneoh_matcha.Reports
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	toUserId VARCHAR(255) NOT NULL,
	fromUserId VARCHAR(255) NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES Users(id),
    FOREIGN KEY (toUserId) REFERENCES Users(id), 
	CONSTRAINT like_id PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.Views
(
	id  INT NOT NULL AUTO_INCREMENT, -- primary key column
	toUserId VARCHAR(255) NOT NULL,
	fromUserId VARCHAR(255) NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES Users(id),
    FOREIGN KEY (toUserId) REFERENCES Users(id), 
	CONSTRAINT like_id PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.AllLocations
(
		id INT NOT NULL AUTO_INCREMENT,
        locationName VARCHAR(255),
		CONSTRAINT location_id PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shauneoh_matcha.UserLocations
(
		id INT NOT NULL AUTO_INCREMENT,
        userLatitude VARCHAR(255),
        userLongitude VARCHAR(255),
        userId INT NOT NULL,
        locationId INT NOT NULL,
		FOREIGN KEY (locationId) REFERENCES AllLocations(id),
		FOREIGN KEY (userId) REFERENCES Users(id),
		CONSTRAINT userLocation_id PRIMARY KEY (id)
);

