const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const cors = require('cors')
const server = express()
const API_HOST = process.env.API_HOST 

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: true
}))
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

server.all('/.well-known/live', (req, res) => {
  res.status(204)
  res.end()
 })
 
 server.all('/.well-known/ready', (req, res) => {
  res.status(204)
  res.end()
 })

const getUser = () => {
  console.log(API_HOST)
  return request
    .get(`${API_HOST}/user`)
    .then(res => {
       return res.body
    },
      () => null)
}

module.exports = {
  server,
  getUser
}
