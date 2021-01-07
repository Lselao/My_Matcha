const express = require('express');
const io = require('socket.io')();
const matchRoutes = require('./routes/match');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const errorController = require('./controllers/errors');
const {dbInit} = require('./middleware/DB')
const { makeSocket } = require('./helpers/socket');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(dbInit);
app.use(matchRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(errorController.display404);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
io.attach(2000,{
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
makeSocket(io);