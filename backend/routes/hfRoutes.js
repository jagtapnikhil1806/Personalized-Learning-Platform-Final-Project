const express = require('express');
const router = express.Router();
const hfController = require('../controllers/hfController');
const { auth } = require("../middleware/auth");

router.post('/hf/chat',auth, hfController.chatWithHF);
module.exports = router;