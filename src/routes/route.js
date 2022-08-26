const express = require("express")
const router = express.Router();
const middleware = require("../middlewares/auth");
const adminController = require("../controllers/adminController")
const userController = require("../controllers/userController")
const applicationController = require("../controllers/applicationController")




router.post('/createAdmin', adminController.createAdmin)

router.post('/createUser', userController.createUser)

router.post('/createApp', applicationController.createApplication)

router.post('/login', adminController.login)

router.get('/getApplicationDetails', middleware.authenticate, adminController.getApplicationDetails)





module.exports = router;



