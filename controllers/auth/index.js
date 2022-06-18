
const {google} = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT
)

const scopes = [
  'email', 'https://www.googleapis.com/auth/gmail.readonly'
]

const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    //include_granted_scopes: false
  });

exports.google_url = async (ctx, next) => {
	ctx.body = { url: authorizationUrl }
}

exports.google_login = async (ctx, next) => {
    const { tokens } = await oauth2Client.getToken(decodeURIComponent(ctx.request.body.code))
    ctx.body = tokens
}
