const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// Plus other dependecies added later

// require is native to node and allows to load an entire module

//Configure the port
const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
});

const userRouter = require('./routes/userRoutes')
const threadRouter = require('./routes/threadRoutes')
const replyRouter = require('./routes/replyRoutes')

app.use(cors());

app.use('/api/users', userRouter)
app.use('/api/threads', threadRouter)
app.use('/api/replies', replyRouter)

app.listen(port, () => console.log(`App Running on : http://localhost:${port}`));