beforeEach ->
  objectProto = Object.prototype

  toStr = (test) -> Object.prototype.toString.call(test)
  isType = (test, type) -> toStr(test).toLowerCase() is '[object ' + type.toLowerCase() + ']'
  isString = (test) -> isType(test, 'String')
  isUndefined = (test) -> isType(test, 'Undefined')
  isObject = (test) -> isType(test, 'Object')
  isArray = (test) -> isType(test, 'Array')
  isString = (test) -> isType(test, 'String')

  ofType = (type) -> isType(@actual, type)
  ofString = (type) -> toStr(@actual) is type
  matchType = (test) -> toStr(@actual) is toStr(test)
  have = (prop) -> not isUndefined(@actual[prop])
  haveOwn = (prop) -> objectProto.hasOwnProperty.call(@actual, prop)
  emptyObject = () -> isEmpty(@actual)
  haveProperties = (api) ->
    api = api.split(/[^\w]+/g) if isString(api)
    if not isArray(api) and isObject(api)
      api = Object.keys(api)

    if isArray api
      for key in api
        expect(@actual).toHave(key)
      return true
    else return false

  mimicStructure = (skel) ->
    if not isArray(skel) and isObject(skel)
      for key, value of skel
        expect(@actual).toHave(key)
        expect(@actual[key]).toMatchType(value)
      return true
    else return haveStructure.call(@, skel)

  equalTo = (test) -> _.isEqual(@actual, test)

  @addMatchers
    toBeOfType: ofType
    toBeEmptyObject: emptyObject
    toBeOfString: ofString
    toBeEqualTo: equalTo
    toMatchType: matchType
    toHave: have
    toHaveOwn: haveOwn
    toHaveProperties: haveProperties
    toMimicStructure: mimicStructure
