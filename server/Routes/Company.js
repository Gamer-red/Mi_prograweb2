const express = require('express');
const router = express.Router();
const companycontroller = require('../Controllers/companycontroller');  // O mejor renombra el controller

router.get('/', companycontroller.getCompanies);  // ✅ getPlatforms

module.exports = router;