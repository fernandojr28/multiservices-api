const Router = require('koa-joi-router'),
Joi = require('koa-joi-router').Joi,
messageController = require(__base+'controllers/user/message'),
router = new Router()


router
	.prefix(`/api/${process.env.NEW_VERSION}/user`)
	.use()

//router.get('/google', authController.google_url)

router.get('/messages', {
	validate: {
        params: {
			access_token: Joi.string()//.required()
		}
	},
	handler: messageController.getAllData,
})

router.get('/messages/:id', {
	/*validate: {
        params: {
			id: Joi.string()//.required()
		}
	},*/
	handler: messageController.getDataForId,
})

module.exports = router