const contentful = require("contentful");
const express = require("express");
const logger = require("morgan");
const keys = require('./keys');
const path = require('path');

const app = express();


var textbook = require('./routes/textbook');
var community = require('./routes/community');
var api = require('./routes/api');

//Logs things in console
app.use(logger('short'));



app.use(express.static(path.join(__dirname, 'build')));

app.get('/hello', function (req, res, next) {
	res.send('Hello');
});


app.use('/community', community);
app.use('/api', api);
app.use('*', textbook);


app.listen(8081, function(){
	console.log('Listening on route 8081!');
});





