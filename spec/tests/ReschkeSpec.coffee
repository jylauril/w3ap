ReschkeTests = [
  {
    description: 'simple Basic auth'
    header: 'Basic realm="foo"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo' } } ]
  }
  {
    description: 'simple Basic auth, with (deprecated) line folding'
    header: 'Basic\n realm="foo"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo' } } ]
  }
  {
    description: 'simple Basic auth (using uppercase characters)'
    header: 'BASIC REALM="foo"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo' } } ]
  }
  {
    description: 'simple Basic auth, using token format for realm'
    header: 'Basic realm=foo'
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth, using token format for realm, including backslashes'
    header: 'Basic realm=\\f\\o\\o'
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth, using single quotes (these are allowed in a token, but should not be treated as quote characters)'
    header: "Basic realm='foo'"
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth, containing a %-escape (which isn\'t special here)'
    header: 'Basic realm="foo%20bar"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo%20bar' } } ]
  }
  {
    description: 'simple Basic auth, with a comma between schema and auth-param'
    header: 'Basic , realm="foo"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo' } } ]
  }
  {
    description: 'simple Basic auth, with a comma between schema and auth-param (this is invalid because of the missing space characters after the scheme name)'
    header: 'Basic, realm="foo"'
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth, realm parameter missing'
    header: 'Basic'
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth with two realm parameters'
    header: 'Basic realm="foo", realm="bar"'
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth, whitespace used in auth-param assignment'
    header: 'Basic realm = "foo"'
    valid: false
    expected: 'error'
  }
  {
    description: 'simple Basic auth, with realm using quoted string escapes'
    header: 'Basic realm="\\"foo\\""'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: '"foo"' } } ]
  }
  {
    description: 'simple Basic auth, with additional auth-params'
    header: 'Basic realm="foo", bar="xyz",, a=b,,,c=d'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo', bar: 'xyz', a: 'b', c: 'd' } } ]
  }
  {
    description: 'simple Basic auth, with an additional auth-param (but with reversed order)'
    header: 'Basic bar="xyz", realm="foo"'
    valid: true
    expected: [ { scheme: 'basic', params: { bar: 'xyz', realm: 'foo' } } ]
  }
  {
    description: 'simple Basic auth, using "a umlaut" character encoded using ISO-8859-1'
    header: 'Basic realm="foo-ä"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo-ä' } } ]
  }
  {
    description: 'simple Basic auth, using "a umlaut" character encoded using UTF-8'
    header: 'Basic realm="foo-Ã¤"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'foo-Ã¤' } } ]
  }
  {
    description: 'simple Basic auth, using "a umlaut" character encoded using RFC 2047'
    header: 'Basic realm="=?ISO-8859-1?Q?foo-=E4?="'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: '=?ISO-8859-1?Q?foo-=E4?=' } } ]
  }
  {
    description: 'a header field containing two challenges, one of which unknown'
    header: 'Basic realm="basic", Newauth realm="newauth"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'basic' } }, { scheme: 'newauth', params: { realm: 'newauth' } } ]
  }
  {
    description: 'a header field containing two challenges, one of which unknown, challenges swapped'
    header: 'Newauth realm="newauth", Basic realm="basic"'
    valid: true
    expected: [ { scheme: 'newauth', params: { realm: 'newauth' } }, { scheme: 'basic', params: { realm: 'basic' } } ]
  }
  {
    description: 'a header field containing one Basic challenge, following an empty one'
    header: ',Basic realm="basic"'
    valid: true
    expected: [ { scheme: 'basic', params: { realm: 'basic' } } ]
  }
  {
    description: 'a header field containing two challenges, the first one for a new scheme and having a parameter using quoted-string syntax'
    header: 'Newauth realm="apps", type=1, title="Login to \\"apps\\"", Basic realm="simple" '
    valid: true
    expected: [ { scheme: 'newauth', params: { realm: 'apps', type: '1', title: 'Login to "apps"' } }, { scheme: 'basic', params: { realm: 'simple' } } ]
  }
  {
    description: 'a header field containing two challenges, the first one for a new scheme and having a parameter called "Basic"'
    header: 'Newauth realm="Newauth Realm", basic=foo, Basic realm="Basic Realm" '
    valid: true
    expected: [ { scheme: 'newauth', params: { realm: 'Newauth Realm', basic: 'foo' } }, { scheme: 'basic', params: { realm: 'Basic Realm' } } ]
  }
  {
    description: 'a header field containing a challenge for an unknown scheme'
    header: 'Newauth realm="newauth"'
    valid: true
    expected: [ { scheme: 'newauth', params: { realm: 'newauth' } } ]
  }
  {
    description: 'a header field containing a Basic challenge, with a quoted-string extension param that happens to contain the string "realm="'
    header: 'Basic foo="realm=nottherealm", realm="basic"'
    valid: true
    expected: [ { scheme: 'basic', params: { foo: 'realm=nottherealm', realm: 'basic' } } ]
  }
  {
    description: 'a header field containing a Basic challenge, with a preceding extension param named "nottherealm"'
    header: 'Basic nottherealm="nottherealm", realm="basic"'
    valid: true
    expected: [ { scheme: 'basic', params: { nottherealm: 'nottherealm', realm: 'basic' } } ]
  }
  {
    description: 'a header field containing a Basic challenge, with a realm missing the second double quote'
    header: 'Basic realm="basic'
    valid: false
    expected: 'error'
  }
  {
    description: 'a token68 test without following equal sign'
    header: 'NTLS Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGEgd2l0aG91dCBlcXVhbCBzaWdu'
    valid: true
    expected: [ { scheme: 'ntls', params: [ 'Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGEgd2l0aG91dCBlcXVhbCBzaWdu' ] } ]
  }
  {
    description: 'a token68 test without following equal sign and another challenge'
    header: 'NTLS Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGEgd2l0aG91dCBlcXVhbCBzaWdu, Basic realm="foobar"'
    valid: true
    expected: [ { scheme: 'ntls', params: [ 'Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGEgd2l0aG91dCBlcXVhbCBzaWdu' ] }, scheme: 'basic', params: { realm: 'foobar' } ]
  }
  {
    description: 'a token68 test with following equal sign'
    header: 'NTLS Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGE='
    valid: true
    expected: [ { scheme: 'ntls', params: [ 'Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGE=' ] } ]
  }
  {
    description: 'a token68 test with following equal sign and another challenge'
    header: 'NTLS Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGE=, Basic realm="foobar"'
    valid: true
    expected: [ { scheme: 'ntls', params: [ 'Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGE=' ] }, scheme: 'basic', params: { realm: 'foobar' } ]
  }
  {
    description: 'a token68 test with two following equal sign'
    header: 'NTLS Y2hhbGxlbmdlIHdpdGggbW9yZSBiYXNlNjQgZGF0YQ=='
    valid: true
    expected: [ { scheme: 'ntls', params: [ 'Y2hhbGxlbmdlIHdpdGggbW9yZSBiYXNlNjQgZGF0YQ==' ] } ]
  }
  {
    description: 'a token68 test with two following equal sign and another challenge'
    header: 'NTLS Y2hhbGxlbmdlIHdpdGggbW9yZSBiYXNlNjQgZGF0YQ==, Basic realm="foobar"'
    valid: true
    expected: [ { scheme: 'ntls', params: [ 'Y2hhbGxlbmdlIHdpdGggbW9yZSBiYXNlNjQgZGF0YQ==' ] }, scheme: 'basic', params: { realm: 'foobar' } ]
  }
]

describe 'Reschke tests', ->
  for rtest in ReschkeTests
    ((test) ->
      ins = new w3ap(test.header)
      res = ins.toObject()

      if test.valid
        it 'should be valid: ' + test.description + ': ' + test.header, ->
          expect(res).toBeEqualTo(test.expected)
      else
        it 'should not be valid: ' + test.description + ': ' + test.header, ->
          expect(res).toBeOfType(test.expected)
    )(rtest)
