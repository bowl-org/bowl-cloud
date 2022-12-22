const express = require('express');
const mongoose = require('mongoose');
//const userModel = require('../models/user');

const signUpRouter = express.Router();

signUpRouter.use(express.json());

signUpRouter.route('/')
	.get((req, res, next) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json')
          res.json({
            "GET": "signup"
          });
	})
	.post((req, res, next) => {
		//Not supported status code
		res.statusCode = 403;
		res.end('POST operation not supported on /signup');
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /signup');
	})
	.delete((req, res, next) => {
		res.statusCode = 403;
		res.end('DELETE operation not supported on /signup');
	});

module.exports = signUpRouter;
