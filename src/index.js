'use strict'

const request = require('axios');
const cheerio = require('cheerio');

const excludePath = process.env.EXCLUDE_PATH;

const createResponse = (statusCode, contentType, body) => {
  return {
    statusCode: statusCode,
    headers: {
      'content-type': contentType,
      'cache-control': 'max-age=31536000'
    },
    isBase64Encoded: true,
    body: new Buffer(body).toString('base64')
  };
};

const toContentType = (type) => {
  switch(type) {
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    default: return 'image/jpeg';
  }
};

const getExtension = (contentType) => {
  switch(contentType) {
    case 'image/png': return 'png'
    case 'image/gif': return 'gif'
    case 'image/webp': return 'webp'
    default: return 'jpeg'
  }
}

exports.handler = async (event, context, callback) => {
  const params = event.queryStringParameters;
  const { url, w, h, t } = params;
  const decodedUrl = decodeURIComponent(url);
  console.log(`url = ${decodedUrl}`);
  const resize = w != undefined && h != undefined;
  console.log(`resize = ${resize}`);
  const type = params.t;
  console.log(`type = ${type}`);

  try {
    const resp = await request.get(decodedUrl, { responseType: 'text' });
    const $ = cheerio.load(resp.data);
    const ogImageUrl = $('meta[property="og:image"]').attr('content').replace(excludePath, '');
    console.log(`ogImage = ${ogImageUrl}`);
    const imageResp = await request.get(ogImageUrl, {
      responseType: 'arraybuffer',
      headers: {
        ContentType: 'image/png'
      }
    });
    const contentType = type ? toContentType(type) : imageResp.headers['content-type']
    callback(null, createResponse(200, contentType, imageResp.data));
  } catch (err) {
    callback(err);
  }
}
