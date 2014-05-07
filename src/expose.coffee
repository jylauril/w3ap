((root, factory) ->

  # If amd is used, define as anonymous module
  if typeof define is 'function' and define.amd
    define(factory)

  # NodeJS style module.exports
  else if typeof module is 'object'
    module.exports = factory()

  # CommonJS style exports
  else if typeof exports is 'object'
    exports = factory()

  # Otherwise expose to root (ie. window in browser)
  else
    root.w3ap = factory()

  return

)(@, -> w3ap)
