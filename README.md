# Matcha

![image](https://user-images.githubusercontent.com/50164676/103293265-2ec03e80-49f8-11eb-9cd0-92d2169074ab.png)

Matcha is an online dating application that matches users based on their sex, location and sexual preferences created using the SERN stack.

## Requirements
- Node v12.13.1 or higher
 
## Installation
 - Navigate into the backend folder `cd backend`
 - Install all dependencies with `npm install`
 - Run `npm start` to start the backend
 - Create a new terminal tab and navigate to the client `cd client`
 - Install all dependencies with `npm install`
 - Run `npm start` to start the client
 
## Tests
After installation please peform the following tests to ensure that the aapplication is running correctly.

1. Click the register button, it should open a modal.
2. Once the register modal is open, if you click the Register button without filling in any of the fields it should give you several error messages if the program is running correctly.
3. Fill in all of the fields correctly, entering an unsecure password (less than 8 characters, no special characters etc.) should give you an error message.
4. After registering, it should take you to your profile page. From here you need to fill in the rest of your information and verify your email.
5. Try navigating off of the page before completing your information, if the application is working correctly you will not be able to access the rest of the site until registration is complete.
6. Check your email inbox to verify your email address and fill in the rest of your information, once done you should now be able to navigate to the rest of the website.
7. Once logged in you can access all of the features of the website, hitting the logout button will instantly log you out and take you to the homepage.
8. After logging out you should no longer have access to the sites features.
9. Hit the login button and fill in your credentials, you should be able to log in with your newly created user and aceess the site again.
10. Go to your profile page, at the bottom there is a Delete Profile button, click the button and delete your user.
11. After deleting your user, try to login again with your credentials, you should no longer be able to log in with that account.
 
## Technologies Used
- Node
- React
- Redux
- MySQL
- Express
- Google Geo Location Api
- Cloudinary Api
- Socket.Io
- JSON Web Tokens

## Structure

# Backend
 Model folder contains all DB related logic each file corresponds to a Table in the DB. All have the following methods save, fetchAll, findByFiled, update, delete with the relevant changes to sql syntax. 
 Routes folder contain all backend API routes split up into subcategories these are all added to the router in server.js. Helpers folder contain general helper functions namely the matching functions, web socket functions for direct messaging and database base class for getting the DB connection instance
 Controllers in controllers folder use methods from the model folder and are called from routes and handle sending back requests
# Frontend
Routes.jsx contains redirection logic if user is not authenticated.

files in actions folder all contain methods which dispatch actions except profileActions which is more of a helper file that sends data back. types.jsx contains the different types of actions

components are where all components for the application are located.

reducers all contain files which have methods which mutate the state which is part of redux as state can only be mutated in a reducer

helpers contains a file which gets the userSocket object from the backend

store.js contains intialization for store

![image](https://user-images.githubusercontent.com/50164676/103292971-9cb83600-49f7-11eb-9716-031bba745c85.png)
