const verified_token = async (ctx,next) => {
	return next()
};

module.exports ={
	verified_token
}