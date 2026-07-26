const express = require('express');
const { updateProfile, changePassword, upload } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/profile', upload.single('profileImage'), updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
