const express = require('express');
const institutionController = require('../controllers/institution.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateInstitutionCreation } = require('../middleware/validators');

const router = express.Router();

router.post('/', protect, validateInstitutionCreation, institutionController.createInstitution);

module.exports = router;