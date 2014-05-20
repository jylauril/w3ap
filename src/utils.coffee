
# shorthand helper methods for type checks
isType = (type) -> (test) -> Object.prototype.toString.call(test) is '[object ' + type + ']'
isString = isType('String')
isNumber = isType('Number')
isArray = isType('Array')
isError = isType('Error')
isString = isType('String')
isFunction = isType('Function')
isArrayLike = (test) -> isArray(test) or (test and not isString(test) and isNumber(test.length))
isObject = isType('Object')

if isObject(undefined) # fix for stupid IE
  isObject = (test) -> test and isType('Object')(test)

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
token68Match = '[a-zA-Z0-9\\-\\._\\~\\+\\/]+[=]{0,2}'
quotedMatch = '"((?:[^"\\\\]|\\\\.)*)"'
quotedParamMatcher = '(' + tokenMatch + ')=' + quotedMatch
paramMatcher = '(' + tokenMatch + ')=(' + tokenMatch + ')'

schemeRE = new RegExp('^[,\\s]*(' + tokenMatch + ')\\s(.*)')
quotedParamRE = new RegExp('^[,\\s]*' + quotedParamMatcher + '[,\\s]*(.*)')
unquotedParamRE = new RegExp('^[,\\s]*' + paramMatcher + '[,\\s]*(.*)')
token68ParamRE = new RegExp('^(' + token68Match + ')(?:$|[,\\s])(.*)')
