
const contentful = require("contentful");
const express = require("express");
const logger = require("morgan");
const app = express();
const keys = require('./keys');
const marked = require('marked');
const path = require('path');
//const showdown = require('showdown');
//const markdown = require('markdown').markdown;

//Logs things in console
app.use(logger('short'));

//Contentful's own http module
const client = contentful.createClient({
	space: keys.spaceid,
	accessToken: keys.delivery_key,
});

//showdown.setFlavor('github');
//const converter = new showdown.Converter();


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
		//console.log(body);
		const bodyHTML = marked(body); 
		//const bodyHTML = converter.makeHtml(body);
		//const bodyHTML = markdown.toHTML(body);
		/*
		// Let marked do its normal token generation.
		tokens = marked.lexer( body );

		// Mark all code blocks as already being escaped.
		// This prevents the parser from encoding anything inside code blocks
		tokens.forEach(function( token ) {
		    if ( token.type === "code" ) {
		        token.escaped = true;
		    }
		});

		// Let marked do its normal parsing, but without encoding the code blocks
		bodyHTML = marked.parser( tokens );
		*/

		console.log(bodyHTML);
		return bodyHTML;
	}).catch(function(e){
		return e;
	});
}

app.use(express.static(path.join(__dirname, 'build')));

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