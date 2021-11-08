const app = require('express')();
const { PORT, DB_CONNECTION_STRING } = require('./config/constants.config');
const { auth } = require('./middlewares/authMiddleware');
const initExpress = require('./config/express.config');
const initHBS = require('./config/handlebars.config');
const connectDB = require('./config/db.config');
const router = require('./router');

initExpress(app);
initHBS(app);
app.use(auth);
app.use(router);
connectDB(DB_CONNECTION_STRING)
  .then(() => {
    console.log('Connected to DB!');
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error.message);
  });
