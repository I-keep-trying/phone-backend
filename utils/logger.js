const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('logger: ', ...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info,
  error,
}
