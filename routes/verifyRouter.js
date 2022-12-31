const express = require('express');
const verificationController = require('../controllers/verificationController');
const verifyRouter = express.Router();
verifyRouter.use(express.json());

verifyRouter.route('/:user_id/:token')
	.get(verificationController.verifyUser);
verifyRouter.route('/')
  .get(verificationController.getAllTokens)
  .delete(verificationController.removeAllTokens);

module.exports = verifyRouter;
