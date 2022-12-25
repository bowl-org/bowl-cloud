const express = require('express');
const mongoose = require('mongoose');
//const userModel = require('../models/user');
const logInController = require("../controllers/logInController");

const logInRouter = express.Router();

logInRouter.use(express.json());

logInRouter.route('/')
	.get((req, res, next) => {
		//Not supported status code
		res.statusCode = 403;
		res.end('GET operation not supported on /login');
	})
	.post(logInController.authenticateUser)
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /login');
	})
	.delete((req, res, next) => {
		res.statusCode = 403;
		res.end('DELETE operation not supported on /login');
	});

module.exports = logInRouter;
