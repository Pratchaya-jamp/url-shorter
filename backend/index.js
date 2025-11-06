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