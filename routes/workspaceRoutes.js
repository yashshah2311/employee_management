const express = require('express');
const { getWorkspaces, getWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } = require('../controllers/workspaceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getWorkspaces)
  .post(protect, createWorkspace);

router.route('/:id')
  .get(protect, getWorkspace)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

module.exports = router;