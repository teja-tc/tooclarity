const express = require('express');
const branchController = require('../controllers/branch.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBranchCreation, validateBranchUpdate } = require('../middleware/validators');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
    .post(validateBranchCreation, branchController.createBranch)
    .get(branchController.getAllBranchesForInstitution);

router.route('/:branchId')
    .get(branchController.getBranchById)
    .put(validateBranchUpdate, branchController.updateBranch)
    .delete(branchController.deleteBranch);

module.exports = router;