
const contentful = require("contentful");
const express = require("express");
const logger = require("morgan");
const app = express();
const keys = require('./keys');
const marked = require('marked');
const path = require('path');
const frameguard = require('frameguard');

app.set('secret', keys.secret); 

//Logs things in console
app.use(logger('short'));

//Contentful's own http module
const client = contentful.createClient({
	space: keys.spaceid,
	accessToken: keys.delivery_key,
});

//Third party parses MD to HTML
marked.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartypants:  true,
});

const ALLOWED_BY = new Set([
  'https://crisistextline.instructure.com/',
  'https://home.crisistextline.org/'
])

const get_entry = (entry_name) =>
{
	return client.getEntry(entry_name).then(function(entry){
		const info = entry.fields;
		const title = info.title;
		const body = info.body;
		const bodyHTML = marked(body).replace(/&amp;/g,'&');
		//console.log(bodyHTML);
		return bodyHTML;
	}).catch(function(e){
		return e;
	});
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/hello', function (req, res, next) {
	const token = req.query.token;
	if (token === app.get('secret')){
		res.send('Hello');
	}else{
		next();
	}
});

app.get('/:id', function (req, res, next) {
	const referer = req.header('Referer');

	if(!referer){
		next();
	}
	const regEx = /^(.*?)\.(com|org)\//g;
	const baseReferer = referer.match(regEx) ? referer.match(regEx)[0] : null;

	if (ALLOWED_BY.has(baseReferer)){
    	res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + baseReferer);
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
	}else{
		next();
	}
});


app.get('/api/:name', function(req, res, next){
	const name = req.params.name;

	get_entry(name).then(function(html){
		res.json(html);
	}).catch(function(e){
		res.json(e);
	});
});


app.listen(8081, function(){
	console.log('Listening on route 8081!');
});
