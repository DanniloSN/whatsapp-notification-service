const express = require('express')

const app = express()
app.use(express.json())

const WhatsappService = require('./src/services/whatsapp-service')
const whatsappService = new WhatsappService()

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
    const numberAux = number.slice(0, 2) + number.slice(3)
    whatsappService.sendMessage(`55${numberAux}@c.us`, message)
  } catch (error) {
    response.message = error.message || 'Error when send message'
    response.status = false
  } finally {
    res.json(response)
  }
})

app.listen(3000)