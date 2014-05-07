/*!
 * w3ap - v0.6.0 - 2014-05-07
 * https://github.com/jylauril/w3ap
 * Copyright (c) 2014 Jyrki Laurila <https://github.com/jylauril>
 */
(function() {
  var Parser, clone, isArray, isArrayLike, isFunction, isNumber, isObject, isString, isType, isUndefined, paramMatcher, quotedMatch, quotedParamMatcher, quotedParamRE, schemeRE, tokenMatch, unquotedParamRE, w3ap,
    __hasProp = {}.hasOwnProperty;

  isType = function(test, type) {
    return Object.prototype.toString.call(test) === '[object ' + type + ']';
  };

  isString = function(test) {
    return isType(test, 'String');
  };

  isUndefined = function(test) {
    return isType(test, 'Undefined');
  };

  isNumber = function(test) {
    return isType(test, 'Number');
  };

  isObject = function(test) {
    return isType(test, 'Object');
  };

  isArray = function(test) {
    return isType(test, 'Array');
  };

  isArrayLike = function(test) {
    return isArray(test) || (test && !isString(test) && isNumber(test.length));
  };

  isString = function(test) {
    return isType(test, 'String');
  };

  isFunction = function(test) {
    return isType(test, 'Function');
  };

  clone = function(obj, deep) {
    var i, key, newArr, newObj, value, _i, _len;
    if (isArrayLike(obj)) {
      if (deep) {
        newArr = [];
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          i = obj[_i];
          newArr.push(clone(i, deep));
        }
        return newArr;
      }
      return Array.prototype.slice.call(obj);
    } else if (isObject(obj)) {
      newObj = {};
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        newObj[key] = deep ? clone(value, deep) : value;
      }
      return newObj;
    }
    return obj;
  };

  tokenMatch = '[a-zA-Z0-9!#$%&\\\'\\*\\+\\-\\.\\^_`\\|~]+';

  quotedMatch = '"((?:[^"\\\\]|\\\\.)*)"';

  quotedParamMatcher = '(' + tokenMatch + ')=' + quotedMatch;

  paramMatcher = '(' + tokenMatch + ')=([\\w])';

  quotedParamRE = new RegExp('^[,\\s]*' + quotedParamMatcher + '[,\\s]*(.*)');

  unquotedParamRE = new RegExp('^[,\\s]*' + paramMatcher + '[,\\s]*(.*)');

  schemeRE = new RegExp('^[,\\s]*(' + tokenMatch + ')\\s(.*)');

  Parser = (function() {
    function Parser(remainder) {
      this.remainder = remainder != null ? remainder : '';
    }

    Parser.prototype.remainder = '';

    Parser.prototype.challenges = [];

    Parser.prototype.error = null;

    Parser.prototype.parse = function(header) {
      var scheme;
      if (isString(header)) {
        this.remainder = header;
      }
      this.challenges = [];
      while (scheme = this.getScheme()) {
        this.beginChallenge(scheme);
      }
      if (!this.challenges.length) {
        this.error = 'invalid_syntax';
      }
      return this;
    };

    Parser.prototype.beginChallenge = function(scheme) {
      var challenge, param, params;
      challenge = {
        scheme: scheme
      };
      params = challenge.params = {};
      while (param = this.getParam()) {
        if (!param.length) {
          continue;
        }
        if (param[0] === 'realm' && isString(params.realm)) {
          params.realm = '';
          if (!this.challenges.length) {
            this.error = 'invalid_syntax';
          }
          continue;
        }
        params[param[0]] = param[1];
      }
      if (!params.realm) {
        if (!this.challenges.length) {
          this.error = 'invalid_syntax';
        }
        return;
      }
      this.error = null;
      this.challenges.push(challenge);
    };

    Parser.prototype.getParam = function() {
      var e, key, param, part, remainder, val, value;
      part = this.remainder;
      param = part.match(quotedParamRE);
      if (param) {
        part = param[0], key = param[1], val = param[2], remainder = param[3];
        this.remainder = remainder || '';
        value = val;
        if (val.indexOf('\\') >= 0) {
          try {
            value = JSON.parse('"' + val + '"');
          } catch (_error) {
            e = _error;
            value = val;
          }
        }
        return [key.toLowerCase(), value];
      } else {
        param = part.match(unquotedParamRE);
        if (param) {
          part = param[0], key = param[1], val = param[2], remainder = param[3];
          this.remainder = remainder || '';
          key = key.toLowerCase();
          if (key === 'realm') {
            return [];
          }
          return [key, val];
        }
      }
      return false;
    };

    Parser.prototype.getScheme = function() {
      var part, remainder, scheme, _ref;
      part = this.remainder;
      scheme = part.match(schemeRE);
      if (scheme && scheme.length > 1) {
        _ref = scheme, part = _ref[0], scheme = _ref[1], remainder = _ref[2];
        this.remainder = remainder || '';
        return scheme.toLowerCase();
      }
      return false;
    };

    Parser.prototype.toObject = function() {
      return clone(this.challenges, true);
    };

    return Parser;

  })();

  w3ap = (function() {
    function w3ap(header) {
      if (!(this instanceof w3ap)) {
        return new w3ap(header);
      }
      this.parse(header);
    }

    w3ap.prototype._key = 'WWW-Authenticate';

    w3ap.prototype._error = null;

    w3ap.prototype._header = null;

    w3ap.prototype._challenges = [];

    w3ap.parse = function(header) {
      return new w3ap(header);
    };

    w3ap.prototype.parse = function(header) {
      var parser, tmp;
      if (!arguments.length) {
        header = this._header;
      }
      if (isObject(header)) {
        if (isFunction(header.getResponseHeader)) {
          header = header.getResponseHeader(this._key);
        } else if (isFunction(header.getHeader)) {
          header = header.getHeader(this._key);
        } else if (isFunction(header.headers)) {
          tmp = header.headers(this._key);
          if (!(tmp && isString(tmp))) {
            tmp = (header.headers() || {})[this._key];
          }
          header = tmp;
        }
      } else if (isFunction(header)) {
        header = header(this._key);
      }
      this._challenges = [];
      if (header && isString(header)) {
        this._header = header;
        parser = new Parser();
        parser.parse(header);
        if (parser.error) {
          this._error = parser.error;
          this._challenges = [];
        } else {
          this._challenges = parser.toObject();
        }
      }
      if (!(this._error || this._challenges.length)) {
        this._error = 'invalid_syntax';
      }
      return this;
    };

    w3ap.prototype.get = function(scheme, index) {
      var challenge, challenges, i, result, _i, _j, _len, _len1;
      result = [];
      challenges = this.toObject();
      if (isType(challenges, 'Error')) {
        return challenges;
      }
      if (isNumber(scheme)) {
        result = challenges[scheme] || null;
      } else if (isFunction(scheme)) {
        for (i = _i = 0, _len = challenges.length; _i < _len; i = ++_i) {
          challenge = challenges[i];
          if (scheme(challenge, i, challenges)) {
            result.push(challenge);
          }
        }
      } else if (isString(scheme)) {
        for (i = _j = 0, _len1 = challenges.length; _j < _len1; i = ++_j) {
          challenge = challenges[i];
          if (challenge && challenge.scheme === scheme) {
            if (isNumber(index)) {
              if (index === 0) {
                result = challenge;
                break;
              }
              index--;
            } else if (isString(index)) {
              if (index === challenge.params.realm) {
                result = challenge;
                break;
              }
            } else if (isFunction(index)) {
              if (index(challenge, i, challenges)) {
                result.push(challenge);
              }
            } else {
              result.push(challenge);
            }
          }
        }
      } else {
        result = challenges;
      }
      if (result && result.length) {
        return result;
      } else {
        return null;
      }
    };

    w3ap.prototype.toObject = function() {
      if (this._error) {
        return new Error(this._error);
      }
      return clone(this._challenges, true);
    };

    return w3ap;

  })();

  (function(root, factory) {
    var exports;
    if (typeof define === 'function' && define.amd) {
      define(factory);
    } else if (typeof module === 'object') {
      module.exports = factory();
    } else if (typeof exports === 'object') {
      exports = factory();
    } else {
      root.w3ap = factory();
    }
  })(this, function() {
    return w3ap;
  });

}).call(this);
