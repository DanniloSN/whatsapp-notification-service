const express = require('express')

const app = express()
app.use(express.json())

const WhatsappService = require('./src/services/whatsapp-service')
const whatsappService = new WhatsappService()

const SqliteService = require('./src/services/sqlite-service')
const sqliteService = new SqliteService()

app.post('/send_message', (req, res) => {
  const response = {
    data: [],
    message: 'Message sended successful!',
    status: true
  }
  try {
    const { message, number } = req.body
    if (!message) throw new Error('No message found!')
    if (!number.replace(/[^0-9]/, '').match(/^[0-9]{11}$/g))
      throw new Error('Invalid number format!')
    const formattedNumber = number.slice(0, 2) + number.slice(3)
    console.log(`Request received (${formattedNumber}): ${message}`)
    sqliteService.saveMessage(formattedNumber, message)
  } catch (error) {
    response.message = error.message || 'Could not send message'
    response.status = false
  } finally {
    res.json(response)
  }
})

setInterval(() => {
  const messages = sqliteService.getUnsendedMessages()
  console.log(`Unsended messages: ${messages?.length}`)
  if (!messages?.length) return
  const ids = messages.map(message => message.id)
  console.log(`Sending message(s) with id(s): ${ids.join(',')}`)
  sqliteService.updateMessagesSendAtTime(ids)
  messages?.forEach(message => {
    console.log(`Sending message to (${message.number}): ${message.message}`)
    whatsappService.sendMessage(`55${message.number}@c.us`, message.message)
  })
}, 10000)

app.listen(3000)