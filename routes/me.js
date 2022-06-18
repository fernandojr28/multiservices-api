const Router = require('koa-joi-router'),
Joi = require('koa-joi-router').Joi,
meController = require(__base+'controllers/user/me'),
router = new Router()


router
	.prefix(`/api/${process.env.NEW_VERSION}/user`)
	.use()

router.get('/me', {
	handler: meController.getDataMe,
})

module.exports = router