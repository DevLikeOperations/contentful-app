
const contentful = require("contentful");
const express = require("express");
const logger = require("morgan");
const app = express();
const keys = require('./keys');
const marked = require('marked');
const path = require('path');

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

const get_entry = (entry_name) =>
{
	return client.getEntry(entry_name).then(function(entry){
		const info = entry.fields;
		const title = info.title;
		const body = info.body;
		const bodyHTML = marked(body).replace(/&amp;/g,'&'); // Marked has problems with special characters.
		console.log(bodyHTML);
		return bodyHTML;
	}).catch(function(e){
		return e;
	});
}

app.get('/:id', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/:name', function(req, res, next){
	const name = req.params.name;
	get_entry(name).then(function(html){
		res.json(html);	
	}).catch(function(e){
		res.json(e);
	});
});

app.listen(8000, function(){
	console.log('Listening on route 8000!');
});