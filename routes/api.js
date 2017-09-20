const _ = require('underscore');
const express = require('express');
const markymark = require('markymark');
const contentful = require('contentful');
const keys = require('../keys');

//Third party parses MD to HTML
markymark.setOptions({
  gfm: true,
  breaks: true,
  tables: true,
  smartypants:  true,
});

/*********************
 * ROUTER CONFIG
 *********************/

var router = express.Router();

router.get('/contents', getMiddlewareFunction(getTableOfContents));
router.get('/textbook', getMiddlewareFunction(getFullTextbook));
router.get('/:id', getMiddlewareFunction(getTextbookEntry, 'id'));
router.get('/community/newsletters', getMiddlewareFunction(getCommunityNewsletters));
router.get('/community/newsletters/:newsletterId', getMiddlewareFunction(getCommunityEntry, 'newsletterId'));
router.get('/community/:articleId', getMiddlewareFunction(getCommunityEntry, 'articleId'));
router.get('/wellness/:articleId', getMiddlewareFunction(getWellnessEntry, 'articleId'));

function getMiddlewareFunction (retrieveContent, contentIdParameter) {
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

/*********************
 * CONTENT RETRIEVAL
 *********************/

function getTableOfContents() {
	//unfortunately, getentry does not allow use of the include parameter so we will use getEntries
	return textbookClient.getEntries({'sys.id': keys.textbook_id, include: 2, locale: keys.locale}).then(function(response){
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

function getFullTextbook() {
	//unfortunately, getentry does not allow use of the include parameter so we will use getEntries
	return textbookClient.getEntries({'sys.id': keys.textbook_id, include: 2, locale: keys.locale}).then(function(response){

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

function getTextbookEntry(entryId) {
	return getContentfulEntry(textbookClient, entryId, getEntryHtml);
}


function getCommunityNewsletters() {
	return communityClient.getEntries({'content_type': 'newsletter', 'order' : 'fields.date', locale: keys.locale}).then(function(response){
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

function getCommunityEntry(entryId) {
	return getContentfulEntry(communityClient, entryId, getEntryJson);
}

function getWellnessEntry(entryId) {
	return getContentfulEntry(wellnessClient, entryId, getEntryJson);
}

function getContentfulEntry(client, entryId, callback) {
	return client.getEntry(entryId, { locale: keys.locale })
		.then(callback)
		.catch(e => { return e; });
}

/*********************
 * CONTENTFUL CLIENTS
 *********************/

const textbookClient = getContentfulClient(keys.textbook_space_id, keys.textbook_delivery_key);
const communityClient = getContentfulClient(keys.community_space_id, keys.community_delivery_key);
const wellnessClient = getContentfulClient(keys.wellness_space_id, keys.wellness_delivery_key);

function getContentfulClient(space, accessToken) {
	return contentful.createClient({
		space: space,
		accessToken: accessToken,
	})
}

/*********************
 * CONTENT FORMATTING
 *********************/

function getEntryHtml(entry) {
	const info = entry.fields;
	const bodyHTML = convertMarkdownToHTML(info.body);
	return bodyHTML;
}

function getEntryJson(entry) {
	const info = entry.fields;
	const title = info.title;
	const body = info.body;
	const date = info.date;
	const bodyHTML = convertMarkdownToHTML(body);
	return {title, body:bodyHTML, date};
}

function convertMarkdownToHTML(text) {
	return markymark(text).replace(/&amp;/g,'&');
}

module.exports = router;