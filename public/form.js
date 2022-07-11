const socket = io()

const productsBody = document.getElementById('productsBody')
const sendMessage = document.getElementById('sendMessage')
const messageInput = document.getElementById('messageInput') 
const email = document.getElementById('email') 
const messageContainer = document.getElementById('messageContainer')



socket.on('productos', data =>{

    const productos = data
   .map(prod => {
    const prodTemplate = `
         
         <tr>
         <th scope="row">${prod.id}</th>
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
 
  const mensajes = data
  .map(men => {
    const mensTemplate = `
    <span style = "color:blue; font-weight: bold">${men.user}</span><span style="color:brown"> ${men.date}:</span><span style ="color:green; font-style: italic"> ${men.text}</span><br>
    `
    return mensTemplate
  })
  .join('')
  messageContainer.innerHTML = mensajes
  
})

sendMessage.addEventListener('click', (e) => {
  e.preventDefault()
 const message = {
   user: email.value,
   text :messageInput.value
 }
 
  socket.emit('messageInput', message)
  messageInput.value = ''
})

socket.on('message', data => {
  
  const message = `
  <span style = "color:blue; font-weight: bold">${data.user}</span><span style="color:brown"> ${data.date}:</span><span style ="color:green; font-style: italic"> ${data.text}</span><br>
  `

  messageContainer.innerHTML += message
})

socket.on('myMessage', data => {
  const message = `
  <span style = "color:blue; font-weight: bold">${data.user}</span><span style="color:brown"> ${data.date}:</span><span style ="color:green; font-style: italic"> ${data.text}</span><br>
  `

  messageContainer.innerHTML += message
})