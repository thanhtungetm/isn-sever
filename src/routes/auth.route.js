const express = require('express')
const { body, check, validationResult } = require('express-validator')
const router = express.Router()

const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/avatar/')
    },
    filename: function (req, file, cb) {
        const date = new Date()
        const name = `${date.getDate()}-${
            date.getMonth() + 1
        }-${date.getFullYear()}_${Date.now()}.png`
        cb(null, name)
    },
})
const upload = multer({ storage: storage })

const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/search/:username', authMiddleware.verifyToken, authController.searchUsers)
router.get('/:username', authMiddleware.verifyToken, authController.getUser)

router.post(
    '/login',
    body('username', 'Username is not empty').isString().notEmpty(),
    body('password', 'Password is not empty').isString().notEmpty(),
    authController.login
)

router.post(
    '/signup',
    [
        body('username').isString().bail().notEmpty().withMessage('Username is not empty'),
        body('password').isString().bail().notEmpty().withMessage('Password is not empty'),
        // body("fullname").isString().bail().notEmpty().withMessage("Fullname is not empty"),
        body('email', 'Email is not empty').normalizeEmail().isEmail().bail().notEmpty(),
        // body("gender").isInt().bail().notEmpty().withMessage('Gender is not empty'),
        // body("birthday").isISO8601().toDate(),
        // body("phone").isMobilePhone().bail().notEmpty().withMessage('Phone is not empty')
    ],
    // authMiddleware.checkExistUsername,
    authController.signup
)
router.post(
    '/signup/check',
    [body('username').isString().bail().notEmpty().withMessage('Username is not empty')],
    authMiddleware.checkExistUsername,
    (req, res) => res.json({ data: true })
)
router.post('/update', authMiddleware.verifyToken, authController.update)

router.post('/test', body('weekday').not().isIn(['sun', 'sat']), (req, res) => {
    try {
        console.log(validationResult(req))
        validationResult(req).throw()
        // yay! we're good to start selling our skilled services :)))
        res.json('ok')
    } catch (err) {
        // Oh noes. This user doesn't have enough skills for this...
        res.status(400).json('fail')
    }
})
module.exports = router
