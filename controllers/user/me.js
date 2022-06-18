const axios = require('axios'),
errorHandler = require( __base + 'helpers/error' )

async function getDataMe(ctx, next){

    const tokenArray = ctx.request.headers.authorization.split(" ")

    try {

        const config1 = {
            method: "get",
            url: "https://www.googleapis.com/userinfo/v2/me?access_token="+tokenArray[1]
        }

        let {data: data} = await axios(config1)

        ctx.body = data
        
    } catch (err) {
        err.status = err.statusCode || err.status || 401;
        ctx.body = {
            error: true,
            status: 401,
            message: err.message
        }
    }

}

module.exports = {
  getDataMe
}