const socket = io()

// Elemental variables, conventionally prefixed with $
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButt = $messageForm.querySelector('button')
const $shareLocationButt = document.querySelector('#share-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//  Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Autoscrolling functions
const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have we scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('H:mm')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Disable the message button
  $messageFormButt.setAttribute('disabled', 'disabled')

  const usersMessage = e.target.elements.message.value
  socket.emit('sendMessage', usersMessage, (error) => {
    // Enable the button again
    $messageFormButt.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }
    console.log('The message was sent.')
  })
})

socket.on('locationLink', (locationLink) => {
  console.log(locationLink)
  const html = Mustache.render(locationTemplate, {
    username: locationLink.username,
    locationLink: locationLink.url,
    createdAt: moment(locationLink.createdAt).format('H:mm')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

$shareLocationButt.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }

  // Disable the share location button
  $shareLocationButt.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    socket.emit('userLocation', {
      latitude,
      longitude
    }, () => {
      $shareLocationButt.removeAttribute('disabled')
      console.log('Location successfully shared!')
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
