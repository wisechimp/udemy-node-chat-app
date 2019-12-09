const socket = io()

socket.on('countUpdated', (count) => {
  console.log('The count has been updated to ' + count)
})

document.querySelector('#incrementButt').addEventListener('click', () => {
  console.log('Butt clicked')
  socket.emit('incrementButtClicked')
})
