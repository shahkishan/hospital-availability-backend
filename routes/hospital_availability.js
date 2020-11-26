var express = require('express');
var router = express.Router();
const hospitalModel = require('../models/hospital');
const { HospitalAvailabilitySchema, HospitalAvailability } = require('../models/hospital_availability')
const cities = require('../config/cities').cities;
const availability = require('./hospital_availability');

router.post('/', (req, res, next) => {
	console.debug('Request recieved to save hospital availability data: ' + JSON.stringify(req.body));
	const body = req.body;

	const validationResponse = validateBody(body, res);

	if (validationResponse !== 'ok') {
		return res.status(400).json({
			error: validationResponse
		});
	}
    
    hospitalModel.findById(body._id, (err, result) => {
        if (err) {
            return res.status(500).json({error: err});
        }

		var availabilityList = result.availability;

		const i = availabilityList.findIndex(a => a.type == req.body.type);

		console.log(i);

		if(req.body.isAvailable) {
			availabilityList[i].availableCount = availabilityList[i].availableCount+1;
			availabilityList[i].availableUpdateTime = Date.now();
		} else {
			availabilityList[i].unavailableCount = availabilityList[i].unavailableCount+1;
			availabilityList[i].unavailableUpdateTime = Date.now();
		}

		console.log(JSON.stringify(availabilityList[i]));

		result.availability = availabilityList;

		console.log(JSON.stringify(result))
		
		new hospitalModel(result).save().then(result => {
			return res.status(200).json(result);
		}).catch(err => {
			console.error(err);
			return res.status(500).json({error: err})
		})
	})
})

const validateBody = (body, res) => {
	if (isEmpty(body._id) || isEmpty(body.type) || body.isAvailable === undefined || body.isAvailable === null) {
		return "Request body not valid. Mandatory Params missing"
	}

	return "ok"
}

const isEmpty = (str) => {
	return (!str || 0 === str.length);
}

module.exports = router;