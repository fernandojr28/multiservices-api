


/*const moduleAlias = require('module-alias')

moduleAlias.addAliases({
	'@': __dirname + '/../',
})
*/

global.__base = __dirname + '/../'

//const app = require('@/app.js')

const app = require('../app.js')
app.listen(process.env.PORT, () => console.log('API server started'))