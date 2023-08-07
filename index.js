require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const http = require('http')
const indexRouter = require('./routes/index');
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler');
const axios = require('axios').default
const app = express();

app.set('port', process.env.PORT || 3001)
app.use(cors())
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/proxy', async (req, res, next) => {
  try{

    req.url = req.url.replace("/proxy", "")
    console.log(req.url)
    const query = await axios({
      method: req.method,
      baseURL: "http://79.143.91.197/api",
      url: req.url,
      params: req.params,
      data: req.body,
      headers: req.headers,
    })
    res.send(query.data)
  }catch(err){
    console.log(err)
    next()
  }
})

app.use(errorHandler);

const server = http.createServer(app)

server.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})

module.exports = app;