
var contentful = require("contentful");
var express = require("express");
var logger = require("morgan");
var app = express();
var keys = require('./keys');
var marked = require('marked');

//Logs things in console
app.use(logger('short'));

//Contentful's own http module
var client = contentful.createClient({
	space: keys.spaceid,
	accessToken: keys.delivery_key,
});

//Third party parses MD to HTML
marked.setOptions({
  gfm: true,
  breaks: true,
});

//Maps our contentID to a chapterNumber for our route unless we want to just use contentID
var TableOfContents = {
	"TESTING": 'GsCzOMyOEmWAGcQI2S8a4',
	'1': '',
	'2': '',
	'3': '',
	'4': '2lEZ1ZEq6k2E2swi4OseCa',
	'5': '',
	'6': '',
};

var get_chapter = (chapter_number) =>
{
	return client.getEntries({'sys.id': TableOfContents[chapter_number]}).then(function(res){
		var info = res.items[0].fields;
		var title = info.title;
		var body = info.body;
		var bodyHTML = marked(body); 
		return bodyHTML;	
	}).catch(function(e){
		return e;
	});
};

app.get('/', function(req, res, next){
    res.sendFile('./index.html', { root: __dirname });

});

app.get('/:num', function(req, res, next){
	var chapter_number = req.params.num;

	get_chapter(chapter_number).then(function(chapterHTML){
		res.json(chapterHTML);
	}).catch(function(e){
		res.json(e);
	});
});


app.listen(8000, function(){
	console.log('Listening on route 8000!');
});