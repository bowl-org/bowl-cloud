const express = require('express');
const mongoose = require('mongoose');
//const userModel = require('../models/user');

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.use(express.json());

forgotPasswordRouter.route('/')
	.get((req, res, next) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json')
          res.json({
            "GET": "forgotpassword"
          });
	})
	.post((req, res, next) => {
		//Not supported status code
		res.statusCode = 403;
		res.end('POST operation not supported on /forgotpassword');
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /forgotpassword');
	})
	.delete((req, res, next) => {
		res.statusCode = 403;
		res.end('DELETE operation not supported on /forgotpassword');
	});

module.exports = forgotPasswordRouter;
