const { Router } = require('express');
const express = require('express')
const router = new express.Router()
const userController = require('../controllers/userController');
const { redirectLogin, 
    redirectDashboard, 
    notAdminRedirectHome, 
    notAuthorizedUserRedirect,notAuthorizedUserUpdateRedirect,
    notAuthorizedUserOrAdmin,
    notAuthorizedPasswordChange} = require('../middleware/redirects')
const removeTrailingSlash = require('../middleware/trailingSlash')
const { upload } = require('../helpers/single-image')


router.post('/role', [notAdminRedirectHome], userController.role)
//UPLOAD AVATAR

 router.post('/avatar/:id', [removeTrailingSlash, notAuthorizedUserRedirect, upload.single('avatar')], userController.uploadAvatar)

//PASSWORD CHANGE

router.get('/changepassword/:id', [removeTrailingSlash, notAuthorizedUserRedirect], userController.changePasswordForm)

router.post('/changepassword', [removeTrailingSlash, notAuthorizedPasswordChange], userController.changePassword)


// DELETE USER
 
router.get('/delete', [removeTrailingSlash, notAuthorizedUserOrAdmin], userController.delete)

router.get('/confirmDelete', [removeTrailingSlash, notAuthorizedUserOrAdmin], userController.confirmDelete)



// AllUsers
router.get('/all', [removeTrailingSlash, notAdminRedirectHome, ], userController.users)

// Home

router.get('/dashboard', [removeTrailingSlash, redirectLogin], userController.dashboard)

//Signin Form
router.get('/login', [removeTrailingSlash, redirectDashboard], userController.loginForm)

//Log in user
router.post('/login', [removeTrailingSlash,redirectDashboard], userController.login)

// LOG USER OUT
router.post('/logout', [removeTrailingSlash, redirectLogin], userController.logout)

//Registration
router.get('/registration', [removeTrailingSlash, redirectDashboard], userController.registration)

router.post('/registration', [removeTrailingSlash,redirectDashboard], userController.register)



//Profile
router.get('/:id', [removeTrailingSlash, notAuthorizedUserRedirect], userController.profile)

router.post('/update', [removeTrailingSlash, notAuthorizedUserUpdateRedirect], userController.update)







module.exports = router