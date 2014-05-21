class w3ap
  constructor: (header) ->
    # return a new instance if not called with new
    return new w3ap(header) unless (@ instanceof w3ap)
    @parse(header)

  isProxy: false

  # the default header key to use when fetching from a get header -method
  # can also parse a Proxy-Authenticate header
  _key: 'WWW-Authenticate'
  _proxyKey: 'Proxy-Authenticate'
  _error: null
  _header: null
  _challenges: []

  @parse: (header) -> new w3ap(header)

  parse: (header) ->
    unless arguments.length
      header = @_header

    @isProxy = false
    tmp = header

    if isObject(header)

      # check if we were given a regular XmlHttpRequest object
      if isFunction(header.getResponseHeader)
        header = header.getResponseHeader.bind(header)

      # check if we have a node http client -style method
      else if isFunction(header.getHeader)
        header = header.getHeader.bind(header)

      # check if we have an Angular -style method for retrieving headers
      else if isFunction(header.headers)
        header = header.headers.bind(header)

    if isFunction(header)

      tmp = header(@_key)
      unless tmp and isString(tmp)
        tmp = header(@_proxyKey)

        unless tmp and isString(tmp)

          # fallback to older way of retrieving headers with Angular response object
          header = header()
          tmp = header[@_key]

          unless tmp and isString(tmp)
            tmp = header[@_proxyKey]

            if tmp and isString(tmp)
              @isProxy = true

        else @isProxy = true

    header = tmp
    # start with empty set
    @_challenges = []

    # finally if we have a string, then parse it
    if header and isString(header)
      @_header = header

      # create new parser instance
      parser = new w3ap.Parser()
      parser.parse(header)

      if parser.error
        @_error = parser.error
        @_challenges = []
      else
        @_challenges = parser.toObject()

    unless @_error or @_challenges.length
      @_error = 'invalid_syntax'

    @

  get: (scheme, index) ->

    result = []
    challenges = @toObject()

    return challenges if isError(challenges)

    # if scheme is a number, return the nth matching scheme
    if isNumber(scheme)
      result = challenges[scheme] or null

    # if scheme is a function, use it as a reduce -type of function
    else if isFunction(scheme)
      for challenge, i in challenges
        result.push(challenge) if scheme(challenge, i, challenges)

    # if scheme is a string, match it to the challenge's scheme
    else if isString(scheme)
      scheme = scheme.toLowerCase()

      for challenge, i in challenges
        if challenge and challenge.scheme is scheme

          # if index is a number, return the nth matching scheme
          if isNumber(index)
            if index is 0
              result = challenge
              break

            index--

          # if index is a string, try to match it to a realm
          else if isString(index)
            if index is challenge.params.realm
              result = challenge
              break

          # if index is a function, use it as a reduce -type of function
          else if isFunction(index)
            if index(challenge, i, challenges)
              result.push(challenge)

          # else gather all matching challenges to the result
          else
            result.push(challenge)

    # otherwise return all challenges
    else
      result = challenges

    if result and (isObject(result) or result.length) then result else null

  toObject: ->
    return new Error(@_error) if @_error
    clone(@_challenges, true)
