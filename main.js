const express = require('express')
const {Server: HttpServer} =require('http')
const {Server: IOServer} = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views','./views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))


//const { Router } = express
const Contenedor = require('./contenedor.js')
const contenedor = new Contenedor('products.txt')


const messages = []
app.get('/products', async (req,res) =>{
  const products = await contenedor.getAll()

  const data ={
    products
  }
  return res.json(products)

}) 

app.get('/', async (req,res) =>{

  return res.render('form') //EJS


})

app.post('/', async (req, res) => {
  const product = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  }
 
  await contenedor.save(product)

  return res.redirect('/') //EJS
 
})

const PORT = 8080

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${PORT}`)
})

server.on('error', error => console.log(`Error en servidor: ${error}`))


io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado')

  const data = await contenedor.getAll()
  socket.emit('productos', data)
  
  socket.emit('join', messages)
   
  socket.on('messageInput', data => {

    const now = new Date()

    const message = {
      user: data.user,
      date: `${now.getDay()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      text: data.text
    }
     
    messages.push(message)
    console.log(messages)
   socket.emit('myMessage', message)
    
    socket.broadcast.emit('message', message)
  })

})



 

