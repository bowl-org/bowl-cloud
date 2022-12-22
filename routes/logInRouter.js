const express = require('express');
const mongoose = require('mongoose');
//const userModel = require('../models/user');

const logInRouter = express.Router();

logInRouter.use(express.json());

logInRouter.route('/')
	.get((req, res, next) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json')
          res.json({
            "GET": "login"
          });
	})
	.post((req, res, next) => {
		//Not supported status code
		res.statusCode = 403;
		res.end('POST operation not supported on /login');
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /login');
	})
	.delete((req, res, next) => {
		res.statusCode = 403;
		res.end('DELETE operation not supported on /login');
	});

module.exports = logInRouter;
