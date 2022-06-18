const Router = require('koa-joi-router'),
Joi = require('koa-joi-router').Joi,
authController = require(__base+'controllers/auth/'),
router = new Router()


router
	.prefix(`/api/${process.env.NEW_VERSION}/auth`)
	.use()

router.get('/google', authController.google_url)

router.post('/google', {
	validate: {
		body: {
			code: Joi.string(),
			authuser:	Joi.number(),
			code: Joi.string(),
			prompt:Joi.string(),
			scope:Joi.string(),
			session_state:Joi.string()
		},
		type: 'json',
	},
	handler: authController.google_login,
})

module.exports = router
