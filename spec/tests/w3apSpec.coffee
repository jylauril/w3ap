
header = 'Basic realm="example.com", foo="bar"'

describe 'w3ap', ->

  it 'should be defined', ->
    expect(w3ap).toBeDefined()

  it 'should be a function with prototype', ->
    expect(w3ap).toBeOfType('function')
    expect(w3ap.prototype).toBeOfType('object')

  it 'should be able to return an instance when called as function', ->
    ins = w3ap()
    expect(ins).toBeOfType('object')
    expect(ins.parse).toBeOfType('function')

  it '.get() should return null when a schema not found', ->
    ins = w3ap(header)
    expect(ins.get('foo')).toBeNull()

  it '.parse() should set the header instance variable', ->
    ins = w3ap()
    ins.parse(header)
    expect(ins._header).toBe(header)

  it '.parse() should be able to request header from an XMLHttpRequest', ->
    callback = sinon.spy(-> header)
    ins = w3ap({ getResponseHeader: callback })
    expect(callback.called).toBeTruthy()
    expect(ins._header).toBe(header)

  it '.parse() should be able to request header from an Angular-like header response', ->
    callback = sinon.spy(-> header)
    ins = w3ap({ headers: callback })
    expect(callback.called).toBeTruthy()
    expect(ins._header).toBe(header)

  it '.parse() should be able to request header from an Angular-like header response (fallback)', ->
    callback = sinon.spy(-> {'WWW-Authenticate': header})
    ins = w3ap({ headers: callback })
    expect(callback.called).toBeTruthy()
    expect(ins._header).toBe(header)

  it '.parse() should be able to request header from a custom header method', ->
    callback = sinon.spy(-> header)
    ins = w3ap(callback)
    expect(callback.called).toBeTruthy()
    expect(ins._header).toBe(header)

  it '.toObject() should be able to return an object when called', ->
    ins = w3ap(header)
    obj = ins.toObject()
    expect(obj).toBeOfType('array')
    expect(obj).not.toBe(ins._challenges)

  it '.toObject() should return an error if parse failed', ->
    ins = w3ap()
    obj = ins.toObject()
    expect(obj).toBeOfType('error')

  it 'should be able to parse a simple basic challenge', ->
    ins = w3ap('Basic realm="foo"')
    obj = ins.toObject()
    expect(obj).toBeEqualTo([ { scheme: 'basic', params: { realm: 'foo' } } ])
