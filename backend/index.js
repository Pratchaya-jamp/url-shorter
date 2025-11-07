const http = require('http')
const admin = require('firebase-admin')
const { nanoid } = require('nanoid')
require('dotenv').config()

const serviceAccount = require('./serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()
const urlsCollection = db.collection('urls')

const PORT = process.env.PORT
const BASE_URL = process.env.BASE_URL
const FRONTEND_URL = process.env.FRONTEND_URL

function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
  res.writeHead(statusCode)
  res.end(JSON.stringify(data))
}
function sendRedirect(res, longUrl) {
  res.setHeader('Location', longUrl)
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
  res.writeHead(301)
  res.end()
}
function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message })
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/shorten') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); })
      req.on('end', async () => {
        try {
          const { longUrl } = JSON.parse(body)
          if (!longUrl) return sendError(res, 400, 'longUrl is required')
          const query = await urlsCollection.where('longUrl', '==', longUrl).limit(1).get()
          if (!query.empty) {
            const oldShortCode = query.docs[0].id
            return sendJson(res, 200, { shortUrl: `${BASE_URL}/${oldShortCode}` })
          }
          const newShortCode = nanoid(7)
          await urlsCollection.doc(newShortCode).set({
            longUrl: longUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp() 
          })
          return sendJson(res, 200, { shortUrl: `${BASE_URL}/${newShortCode}` })
        } catch (dbError) {
          sendError(res, 500, 'Internal server error')
        }
      });

    } else if (req.method === 'GET' && req.url === '/api/history') {
      const querySnapshot = await urlsCollection.orderBy('createdAt', 'desc').limit(10).get()
      const history = []
      querySnapshot.forEach(doc => {
        history.push({
          shortCode: doc.id,
          shortUrl: `${BASE_URL}/${doc.id}`, 
          longUrl: doc.data().longUrl,
        })
      })
      return sendJson(res, 200, history)

    }
  } catch (error) {
    if (!res.headersSent) {
      sendError(res, 500, 'Internal server error')
    }
  }
})

server.listen(PORT, () => {
  console.log(`✅ Backend server Running on ${BASE_URL} (Port: ${PORT})`)
})