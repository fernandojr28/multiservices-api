const axios = require('axios');
let textVersion = require("textversionjs")

function getBodyPrint(message) {
  let html = getBody(message)
  html = html.replace(/<tr[^>]*>/g,'').replace(/<\/tr>/g,'');
  html = html.replace(/(<td)/igm, '<div').replace(/<\/td>/igm, '</div>')
  let plainText = textVersion(html)
  plainText = plainText.replace(/\n/g, "<br />")
  plainText = plainText.replaceAll(": <br />", ": ")
  plainText = plainText.replaceAll(":<br />", ": ")
  return plainText
}

function getAttrs(message) {
  let plainText = getBodyPrint(message)
  let attrs = plainText.split("<br />").filter(x=>x)
  return attrs
}

function getBody(message) {
  let encodedBody = ''
  if(typeof message.parts === 'undefined') {
    encodedBody = message.body.data;
  } else {
    encodedBody = getHTMLPart(message.parts)
  }
  const decodedStr = Buffer.from(encodedBody, "base64").toString("utf8")
  return decodedStr
}

function getHeader(headers, index) {
  const header = headers.find(e => e.name === index).value
  return header || ''
}

function getHTMLPart(arr) {
  for(let x = 0; x <= arr.length; x++) {
    if(typeof arr[x].parts === 'undefined') {
      if(arr[x].mimeType === 'text/html') {
        return arr[x].body.data
      }
    } else {
      return getHTMLPart(arr[x].parts);
    }
  }
  return ''
}

readGmailContent = async (messageId, accessToken) => {
  const config = {
    method: "get",
    url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    headers: {
      Authorization: accessToken,
    }
  }

  let data = {}

  await axios(config)
  .then(async function (response) {
    data = await response.data
  })
  .catch(function (error) {
    console.log(error)
  })
  return data
}

async function getAllData(ctx, next){

    let page = ctx.query.page || 0,
    rows = ctx.query.rows || 10,
    data = {}

    const url = `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${rows}&pageToken=${page}`

    const config1 = {
      method: "get",
      url,
      headers: {
        Authorization: ctx.request.headers.authorization
      }
    }
  
    let allMessage = [],
    messages = [],
    nextPageToken,
    resultSizeEstimate

    await axios(config1)
    .then(async function (response) {
      allMessage = await response.data["messages"]
      nextPageToken = response.data["nextPageToken"]
      resultSizeEstimate = response.data["resultSizeEstimate"]
    })
    .catch(function (error) {
      console.log(error)
    })

    for (let index = 0; index < allMessage.length; index++) {
      const message = await readGmailContent(allMessage[index].threadId, ctx.request.headers.authorization)
      messages.push({
        threadId: message.threadId,
        headers: {
          from: getHeader(message.payload.headers, 'From'),
          subject: getHeader(message.payload.headers, 'Subject'),
          date: getHeader(message.payload.headers, 'Date')
        }
      })
    }

    const type_service = [
      {
        business: 'BITEL',
        services: ['RECARGA INTERNET']
      },
      {
        business: 'BITEL - POSTPAGO',
        services: ['POSTPAGO BITEL (SOLES)', 'POSTPAGO BITEL (DOLARES)']
      },
      {
        business: 'ENTEL PERU S.A.',
        services: ['PAGO CON NUMERO TELEFONO']
      },
      {
        business: 'ENOSA',
        services: ['CONSUMO DE ENERGIA']
      },
      {
        business: 'MOVISTAR RECARGAS',
        services: ['RECARGAS VIRTUALES']
      },
      {
        business: 'DIRECTV PERU SRL',
        services: ['C.-RECARGA DIRECTV']
      },
      {
        business: 'PAGOEFECTIVO',
        services: ['PAGOEFECTIVO SOLES']
      }
    ]

    //VALIDA SI LA EMPRESA Y EL SERVICIO A CONSULTAR EXISTE EN LOS DEFAULT

    /*if(type_service.some(e => e.business === query.business && e.services.includes(query.service))) {
      message2 = messages2.filter(e => e.body.indexOf(query.service) != -1)
    }*/

    data = {
      messages,
      nextPageToken,
      resultSizeEstimate
    }

    ctx.body = data
}

async function getDataForId(ctx, next){

  const id = ctx.params.id

  const config1 = {
    method: "get",
    url:
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/"+id,
    headers: {
      Authorization: ctx.request.headers.authorization
    }
  }

  let data

  await axios(config1)
  .then(async function (response) {
    data = await response.data
  })
  .catch(function (error) {
    console.log(error)
  })

  data = {
    threadId: data.threadId,
    headers: {
      from: getHeader(data.payload.headers, 'From'),
      subject: getHeader(data.payload.headers, 'Subject'),
      date: getHeader(data.payload.headers, 'Date'),
    },
    //body_origin: getBody(data.payload),
    body_print: getBodyPrint(data.payload),
    attrs: getAttrs(data.payload)
  }

  ctx.body = data
}

module.exports = {
  getAllData,
  getDataForId
}