require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const http = require('http')
const indexRouter = require('./routes/index');
const cors = require('cors')
const path = require('path')

const app = express();

app.use(cors())
app.use(cookieParser());
app.use(helmet());
app.use(logger('dev'));
app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 3001)

app.use('/api', indexRouter);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = http.createServer(app)
server.listen(app.get('port'), () => {
  console.log('listening on port ' + app.get('port'))
})

