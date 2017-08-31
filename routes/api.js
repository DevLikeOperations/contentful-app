const express = require('express');
const markymark = require('markymark');
const contentful = require("contentful");
const keys = require('../keys');
const _ = require("underscore");


var router = express.Router();

const convertMarkdownToHTML = (text) =>{
	return markymark(text).replace(/&amp;/g,'&');
}

//Third party parses MD to HTML
markymark.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartypants:  true,
});

//Contentful's own http module
const textbookClient = contentful.createClient({
	space: keys.textbook_space_id,
	accessToken: keys.textbook_delivery_key,
});

const communityClient = contentful.createClient({
	space: keys.community_space_id,
	accessToken: keys.community_delivery_key,
});

const wellnessClient = contentful.createClient({
	space: keys.wellness_space_id,
	accessToken: keys.wellness_delivery_key,
});

router.get('/contents', getMiddlewareFunction(getTableOfContents));
router.get('/textbook', getMiddlewareFunction(getFullTextbook));
router.get('/:id', getMiddlewareFunction(getTextbookEntry, 'id'));
router.get('/community/newsletters', getMiddlewareFunction(getCommunityNewsletters));
router.get('/community/newsletters/:newsletterId', getMiddlewareFunction(getCommunityEntry, 'newsletterId'));
router.get('/community/:articleId', getMiddlewareFunction(getCommunityEntry, 'articleId'));
router.get('/wellness/:articleId', getMiddlewareFunction(getWellnessEntry, 'articleId'));

const getMiddlewareFunction = (retrieveContent, contentIdParameter) => {
	return (req, res, next) => {
		const contentId = (contentIdParameter) ? req.params[contentIdParameter] : null;
		retrieveContent(contentId)
			.then(content => {
				res.json(content);
			}).catch(e => {
				res.json(e);
			})
	}
}

const getTextbookEntry = (entryId) => {
	return textbookClient.getEntry(entryId)
		.then(getEntryHtml)
		.catch(function(e){
			return e;
		});
}

const getCommunityEntry = (entryId) => {
	return communityClient.getEntry(entryId)
		.then(getEntryJson)
		.catch(function(e){
			return e;
		});
}

const getWellnessEntry = (entryId) => {
	return wellnessClient.getEntry(entryId)
		.then(getEntryJson)
		.catch(function(e){
			return e;
		});
}

const getCommunityNewsletters = () => {
	return communityClient.getEntries({'content_type': 'newsletter', 'order' : 'fields.date'}).then(function(response){
		const newsletters = response.items.map(function(newsletter){
			return {title: newsletter.fields.title, id: newsletter.sys.id, date: newsletter.fields.date};
		});

		var newslettersGroupedByYear = _.groupBy(newsletters, function(newsletter){
			const date = new Date(newsletter.date);
			return date.getFullYear(); 
		});


		const newslettersGroupedByMonthAndYear = {};
		for (var yearKey in newslettersGroupedByYear){
			const newslettersInYear = newslettersGroupedByYear[yearKey];

			newslettersGroupedByMonthAndYear[yearKey] = _.groupBy(newslettersInYear, function(newsletter){
				const date = new Date(newsletter.date);
				return date.getMonth(); 
			});
		}	

		return newslettersGroupedByMonthAndYear;

	}).catch(function(e){
		return e;
	})
}

const getEntry = (client, entryId) => {
	return client.getEntry(entryId)
		.then(getEntryHtml)
		.catch(function(e){
			return e;
		});
}

const getEntryHtml = entry => {
	const info = entry.fields;
	const bodyHTML = convertMarkdownToHTML(info.body);
	return bodyHTML;
}

const getEntryJson = entry => {
	const info = entry.fields;
	const title = info.title;
	const body = info.body;
	const date = info.date;
	const bodyHTML = convertMarkdownToHTML(body);
	return {title, body:bodyHTML, date};
}

const getTableOfContents = () => {
	//unfortunately, getentry does not allow use of the include parameter so we will use getEntries
	return textbookClient.getEntries({'sys.id': keys.textbook_id, include: 2}).then(function(response){
		const theTextbook = response.items[0];
		const chapters = theTextbook.fields.chapters;

		const tableOfContents = [];

		chapters.forEach(function(chapter){
			const chapterTitle = chapter.fields.title;
			const chapterId = chapter.sys.id;

			const subsections = chapter.fields.subsection.map(function(s){
				return {title: s.fields.title};
			});

			tableOfContents.push(
				{
					title: chapterTitle,
					id: chapterId,
					subsections
				}
			);

		});
		return tableOfContents;

	}).catch(function(e){
		return e;
	});
}

const getFullTextbook = () => {
	//unfortunately, getentry does not allow use of the include parameter so we will use getEntries
	return textbookClient.getEntries({'sys.id': keys.textbook_id, include: 2}).then(function(response){
		const theTextbook = response.items[0];
		const chapters = theTextbook.fields.chapters;

		const fullTextbookObjects = [];

		chapters.forEach(function(chapter){
			const subsections = [];
			chapter.fields.subsection.forEach(function(subsec){
				const subsectionBody = convertMarkdownToHTML(subsec.fields.body);
				subsections.push({id: subsec.sys.id, title: subsec.fields.title, html: subsectionBody});
			});

			const chapterBody = convertMarkdownToHTML(chapter.fields.body);
			fullTextbookObjects.push({id: chapter.sys.id, title: chapter.fields.title, html: chapterBody, subsections});



		});
		return fullTextbookObjects;
	});
}


module.exports = router;