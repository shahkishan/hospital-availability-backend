var express = require('express');
var router = express.Router();
const hospitalModel = require('../models/hospital');
const cities = require('../config/cities').cities;
const availability = require('./hospital_availability');

router.use('/availability', availability);

router.get('/', function (req, res, next) {

	const id = req.query.id;
	var filter = {};
	if (!isEmpty(id)) {
		filter._id = id;
	}

	const city = req.query.city;
	if (!isEmpty(city)) {
		filter.city = city;
	}

	const name = req.query.name;
	if (!isEmpty(name)) {
		filter.name = name;
	}

	var page = req.query.page;
	var limit = req.query.limit;

	console.log(page + " " + limit);

	console.log(JSON.stringify(filter))

	if (!isNumberEmpty(page) && !isNumberEmpty(limit)) {
		limit = parseInt(limit);
		page = parseInt(page);
		hospitalModel.find(filter)
			.limit(limit)
			.skip(limit * Math.max(0, page))
			.sort({
				name: 'asc'
			}).exec((err, results) => {
				if (err) {
					console.error(err);
					return res.status(500).json({
						error: "Some Error Occured --->" + err
					});
				}
				return res.send(results)
			});
	} else {
		hospitalModel.find(filter)
		.sort({
			name: 'asc'
		}).exec((err, results) => {
			if (err) {
				console.error(err);
				return res.status(500).json({
					error: "Some Error Occured --->" + err
				});
			}
			return res.send(results);
		})
	}


});

router.get('/:name', (req, res) => {
	const name = req.params.name;

	console.log(name)

	if (isEmpty(name)) {
		return res.status(400).json({
			error: "Name empty! Please try again"
		});
	}

	hospitalModel.find({
		name: name
	}).exec((err, results) => {
		if (err) {
			console.error(err);
			res.status(500).json({
				error: "Some Error Occured --->" + err
			});
		}

		res.send(results)
	});
})

router.get('/city/:city', (req, res, next) => {

})

router.post('/', (req, res, next) => {
	console.debug('Request recieved to save hospital data: ' + JSON.stringify(req.body));
	const body = req.body;

	const validationResponse = validateBody(body, res);

	if (validationResponse !== 'ok') {
		return res.status(400).json({
			error: validationResponse
		});
	}

	body.availability = [{
		type: "Covid",
		availableCount: 0,
		availableUpdateTime: Date.now(),
		unavailableCount: 0,
		unavailableUpdateTime: Date.now(),

	}, {
		type: "General",
		availableCount: 0,
		availableUpdateTime: Date.now(),
		unavailableCount: 0,
		unavailableUpdateTime: Date.now(),

	}];

	const hospital = new hospitalModel(body);

	hospital.save().then(result => {
		res.send(result);
	}).catch((err) => {
		console.error(err);
		if (err.code === 11000) {
			res.status(400).json({
				error: "Hospital already exist"
			});
		}
		res.status(500).json({
			error: err
		});
	});
})

const validateBody = (body, res) => {
	if (isEmpty(body.name) || isEmpty(body.city) || isEmpty(body.address)) {
		return "Request body not valid. Mandatory Params missing"
	}

	if (!cities.includes(body.city)) {
		return "Invalid city. Please enter correct city and try again!"
	}

	return "ok"
}

const isEmpty = (str) => {
	return (!str || 0 === str.length);
}

const isNumberEmpty = (num) => {
	return (num === undefined || parseInt(num) < 0)
}

module.exports = router;