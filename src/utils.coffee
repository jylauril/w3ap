
# shorthand helper methods for type checks
isType = (test, type) -> Object.prototype.toString.call(test) is '[object ' + type + ']'
isString = (test) -> isType(test, 'String')
isUndefined = (test) -> isType(test, 'Undefined')
isNumber = (test) -> isType(test, 'Number')
isObject = (test) -> isType(test, 'Object')
isArray = (test) -> isType(test, 'Array')
isArrayLike = (test) -> isArray(test) or (test and not isString(test) and isNumber(test.length))
isString = (test) -> isType(test, 'String')
isFunction = (test) -> isType(test, 'Function')

clone = (obj, deep) ->
  if isArrayLike(obj)
    if deep
      newArr = []
      newArr.push(clone(i, deep)) for i in obj
      return newArr
    return Array.prototype.slice.call(obj)
  else if isObject(obj)
    newObj = {}
    for own key, value of obj
      newObj[key] = if deep then clone(value, deep) else value
    return newObj
  obj

tokenMatch = '[a-zA-Z0-9!#$%&\\\'\\*\\+\\-\\.\\^_`\\|~]+'
quotedMatch = '"((?:[^"\\\\]|\\\\.)*)"'
quotedParamMatcher = '(' + tokenMatch + ')=' + quotedMatch
paramMatcher = '(' + tokenMatch + ')=([\\w])'

quotedParamRE = new RegExp('^[,\\s]*' + quotedParamMatcher + '[,\\s]*(.*)')
unquotedParamRE = new RegExp('^[,\\s]*' + paramMatcher + '[,\\s]*(.*)')
schemeRE = new RegExp('^[,\\s]*(' + tokenMatch + ')\\s(.*)')
