require('dotenv').config({path: '.env'})

const koa = require('koa'),
    bodyParser = require('koa-body'),
    app = new koa(),
    routes = require('./routes/index'),
    cors = require('@koa/cors')

app.use(cors({
    allowedHeaders: ['etag', 'Content-Type', 'X-Requested-With', 'Accept', 'Origin', 'Authorization'],
    origin: (ctx) => process.env.ORIGINS.split(',').indexOf(ctx.headers.origin) !== -1 && ctx.headers.origin,
    credentials: false
}))

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.log("error", error)
    }
})

app.use(bodyParser({
	enableTypes: ['json'],
	jsonLimit: '15mb',
	strict: true,
	onerror: function (err, ctx) {
		ctx.throw('Body parse error', 422)
	}
}))

app.use(routes.middleware())

module.exports = app