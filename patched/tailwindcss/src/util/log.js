let alreadyShown = new Set()

function log(type, messages, key) {
  if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) return

  if (key && alreadyShown.has(key)) return
  if (key) alreadyShown.add(key)

  console.warn('')
  messages.forEach((message) => console.warn(type, '-', message))
}

export default {
  info(key, messages) {
    log('info', ...(Array.isArray(key) ? [key] : [messages, key]))
  },
  warn(key, messages) {
    log('warn', ...(Array.isArray(key) ? [key] : [messages, key]))
  },
  risk(key, messages) {
    log('risk', ...(Array.isArray(key) ? [key] : [messages, key]))
  },
}
