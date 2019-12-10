const socket = io()

// Elemental variables, conventionally prefixed with $
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButt = $messageForm.querySelector('button')
const $shareLocationButt = document.querySelector('#share-location')

socket.on('message', (message) => {
  console.log(message)
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
