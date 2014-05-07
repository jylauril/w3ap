class Parser
  constructor: (@remainder = '') ->

  remainder: ''
  challenges: []
  error: null

  parse: (header) ->
    @remainder = header if isString(header)

    # reset previous state, so we don't end up duplicating data
    @challenges = []
    @beginChallenge(scheme) while scheme = @getScheme()

    # if the challenge failed in any way or if it was empty, then fail
    @error = 'invalid_syntax' unless @challenges.length
    @

  beginChallenge: (scheme) ->
    challenge = { scheme: scheme }
    params = challenge.params = {}

    while param = @getParam()
      continue unless param.length

      # a challenge can only have one realm parameter, otherwise it's considered invalid
      if param[0] is 'realm' and not isUndefined(params.realm)
        params.realm = null
        @error = 'invalid_syntax' unless @challenges.length
        continue # continue, so we can catch all params meant for this challenge

      params[param[0]] = param[1]

    # a challenge must always have a realm
    unless params.realm
      @error = 'invalid_syntax' unless @challenges.length
      return

    # if we get this far, it means that we have at least one working challenge
    @error = null
    @challenges.push(challenge)
    return

  getParam: ->
    part = @remainder

    # check for quoted params first
    param = part.match(quotedParamRE)

    if param
      [part, key, val, remainder] = param
      @remainder = remainder or '' # make sure remainder is always a string

      value = val
      # use JSON.parse to securely unescape any escaped characters in the value string
      if val.indexOf('\\') >= 0
        try # wrap it inside a try, so if it fails in any way, we'll use the original value
          value = JSON.parse('"' + val + '"')
        catch e
          value = val

      # protocol states param keys are in-case-sensitive
      # so we make them all lowercase to help match them
      return [key.toLowerCase(), value]
    else
      # try un-quoted params next
      param = part.match(unquotedParamRE)

      if param
        [part, key, val, remainder] = param
        @remainder = remainder or '' # make sure remainder is always a string

        # protocol states param keys are in-case-sensitive
        # so we make them all lowercase to help match them
        key = key.toLowerCase()

        # realm must not have un-quoted value
        return [] if key is 'realm'

        return [key, val]

    false

  getScheme: ->
    part = @remainder
    scheme = part.match(schemeRE)

    if scheme and scheme.length > 1
      [part, scheme, remainder] = scheme

      # make sure remainder is always a string
      @remainder = remainder or ''

      # protocol states scheme names are in-case-sensitive
      # so we make them all lowercase to help match them
      return scheme.toLowerCase()

    false

  toObject: -> clone(@challenges, true)
