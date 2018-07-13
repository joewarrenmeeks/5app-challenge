#!/usr/bin/env nodejs

const express = require('express')
const app = express()

// Some useful utilities
const bodyParser = require('body-parser')
const url = require('url');

app.use(bodyParser.json());

app.post('/api/users', function (req, res) {

	// Copy the payload into a more convenient object
	var payload = req.body.payload;

	// Create the reply object
	var reply = [];

	// Rule 1: Count must be greater than 0
	payload = payload.filter(payload => payload.count > 0);

	// Iterate over the valid results to create the response
	payload.forEach(function (element) {

		// Create the entry and copy over relevant details
		var entry = { name: '', count: 0, thumbnail: ''};

		entry.name = element.name;
		entry.count = element.count;

		/*
		 * So I know of a PHP library that can parse image 
		 * URL formats, but mu google-fu fails for JS.
		 * Hence this more procedural function
		 */
		element.logos.forEach(function (logos) {
			var x = logos.size.split("x");

			/* 
			 * Rule 2: thumbnail no larger than 128x128 and 
			 * no smaller than 64x64
			 * This is assuming that the x and y are the 
			 * same. Once we match one we can quit.
			 */
			if ( x[0] >= 64 && x[0] <= 128) { 
				entry.thumbnail = logos.url;
				return;
			}
		});

		/*
		 * But what if we don't have a valid
		 * thumbnail? Do we want broken results?
		 * Probably not. Let's log it to the console
		 * and hope someone in DevOps monitors the logs
		 */
		if ( ! entry.thumbnail) {
			console.log('Broken: ', entry);
		} else {
			// Add our entry to the reply
			reply.push(entry);
		}
	});

	// Set the correct content type and send the result
	res.writeHead(200, {"Content-Type": "application/json"});

	res.end(JSON.stringify({
		response: reply
	}));


})

app.listen(3000, () => console.log('5app server running on 3000'))
