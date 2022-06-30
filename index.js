const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
})
const app = express();

redisClient.connect().catch(err => console.log(err))
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWidthRetry = () => {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).
    then(() => console.log("succesfully connected to DB")).
    catch((e) => {
      console.log(e)
      setTimeout(connectWidthRetry, 5000)
    })
}

connectWidthRetry();

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 30000,
  
  }
}))
app.use(express.json())



app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send("<h2>Hi there</h2>")
})


app.listen(port, () => {
  console.log(`listineng on port ${port}`)
})