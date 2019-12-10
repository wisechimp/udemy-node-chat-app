const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime()
  }
}

const generateLocationLink = (url) => {
  return {
    url,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage,
  generateLocationLink
}
