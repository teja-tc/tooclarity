const express = require('express');
const institutionController = require('../controllers/institution.controller');
const { protect, checkInstitutionExists } = require('../middleware/auth.middleware');
const { validateL1Creation, validateL2Update } = require('../middleware/validators')

const router = express.Router();

router.use(protect)

// CREATE (L1)
router.post('/', validateL1Creation, institutionController.createL1Institution);

// UPDATE (L2)
router.put(
    '/details',
    checkInstitutionExists,
    validateL2Update,
    institutionController.updateL2InstitutionDetails
);

// READ & DELETE
router.route('/me')
    .get(checkInstitutionExists, institutionController.getMyInstitution)
    .delete(checkInstitutionExists, institutionController.deleteMyInstitution);



module.exports = router;