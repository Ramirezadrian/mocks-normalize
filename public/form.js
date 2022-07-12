const socket = io()

const productsBody = document.getElementById('productsBody')
const sendMessage = document.getElementById('sendMessage')
const messageInput = document.getElementById('messageInput') 
const email = document.getElementById('email') 
const messageContainer = document.getElementById('messageContainer')
const normalizr = require('normalizr')

const authorSchema = new normalizr.schema.Entity('author',{},{idAttribute: 'email'})
const textSchema = new normalizr.schema.Entity('text')
const msgSchema = new normalizr.schema.Entity('msg',{
  author: authorSchema,
  text: [textSchema]
})

socket.on('productos', data =>{

    const productos = data
   .map(prod => {
    const prodTemplate = `
         
         <tr>
         
         <td>${prod.title}</td>
         <td>${prod.price}</td>
         <td><img src="${prod.thumbnail}"></td>
         </tr>
    `
    return prodTemplate
    })
    .join('') 
     productsBody.innerHTML = productos
})

socket.on('join', data =>{

  const denormalizedMsg = normalizr.denormalize(data.result, msgSchema, data.entities)
  const mensajes = denormalizedMsg
  .map(men => {
    const mensTemplate = `
    <span style = "color:blue; font-weight: bold">${men.author.email}</span><span style="color:brown"> ${men.author.alias}:</span><span style ="color:green; font-style: italic"> ${men.text}</span><br>
    `
    return mensTemplate
  })
  .join('')
  messageContainer.innerHTML = mensajes
  
})

sendMessage.addEventListener('click', (e) => {
  e.preventDefault()
 const message = {
  "author": {
      "email": email.value,
      "nombre": nombre.value,
      " apellido": apellido.value,
      "edad": edad.value,
      "alias": alias.value,
      "avatar": avatar.value
    },
    "text" :messageInput.value
 }
 const normalizedMsg = normalizr.normalize(msgs, msgSchema)
 
  socket.emit('messageInput', normalizedMsg)
  messageInput.value = ''
})

socket.on('message', data => {
  
  const message = `
  <span style = "color:blue; font-weight: bold">${data.author.email}</span><span style="color:brown"> ${data.author.alias}:</span><span style ="color:green; font-style: italic"> ${data.text}</span><br>
  `

  messageContainer.innerHTML += message
})

socket.on('myMessage', data => {
  const message = `
  <span style = "color:blue; font-weight: bold">${data.author.email}</span><span style="color:brown"> ${data.author.alias}:</span><span style ="color:green; font-style: italic"> ${data.text}</span><br>
  `

  messageContainer.innerHTML += message
})