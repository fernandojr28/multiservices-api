const Router = require('koa-router')

const router = new Router()

let children = [
    require('./auth'),
    require('./me'),
    require('./message')
];

router.use(...children)

module.exports = router
