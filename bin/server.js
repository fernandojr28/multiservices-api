


/*const moduleAlias = require('module-alias')

moduleAlias.addAliases({
	'@': __dirname + '/../',
})
*/

global.__base = __dirname + '/../'

//const app = require('@/app.js')

const app = require('../app.js')
app.listen(3000, () => console.log('API server started'))