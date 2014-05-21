/*!
 * w3ap - v0.6.0 - 2014-05-20
 * https://github.com/jylauril/w3ap
 * Copyright (c) 2014 Jyrki Laurila <https://github.com/jylauril>
 */
(function() {
  var clone, isArray, isArrayLike, isError, isFunction, isNumber, isObject, isString, isType, paramMatcher, quotedMatch, quotedParamMatcher, quotedParamRE, schemeRE, token68Match, token68ParamRE, tokenMatch, unquotedParamRE, w3ap,
    __hasProp = {}.hasOwnProperty;

  isType = function(type) {
    return function(test) {
      return Object.prototype.toString.call(test) === '[object ' + type + ']';
    };
  };

  isString = isType('String');

  isNumber = isType('Number');

  isArray = isType('Array');

  isError = isType('Error');

  isString = isType('String');

  isFunction = isType('Function');

  isArrayLike = function(test) {
    return isArray(test) || (test && !isString(test) && isNumber(test.length));
  };

  isObject = isType('Object');

  if (isObject(void 0)) {
    isObject = function(test) {
      return test && isType('Object')(test);
    };
  }

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

  token68Match = '[a-zA-Z0-9\\-\\._\\~\\+\\/]+[=]{0,2}';

  quotedMatch = '"((?:[^"\\\\]|\\\\.)*)"';

  quotedParamMatcher = '(' + tokenMatch + ')=' + quotedMatch;

  paramMatcher = '(' + tokenMatch + ')=(' + tokenMatch + ')';

  schemeRE = new RegExp('^[,\\s]*(' + tokenMatch + ')\\s(.*)');

  quotedParamRE = new RegExp('^[,\\s]*' + quotedParamMatcher + '[,\\s]*(.*)');

  unquotedParamRE = new RegExp('^[,\\s]*' + paramMatcher + '[,\\s]*(.*)');

  token68ParamRE = new RegExp('^(' + token68Match + ')(?:$|[,\\s])(.*)');

  w3ap = (function() {
    function w3ap(header) {
      if (!(this instanceof w3ap)) {
        return new w3ap(header);
      }
      this.parse(header);
    }

    w3ap.prototype.isProxy = false;

    w3ap.prototype._key = 'WWW-Authenticate';

    w3ap.prototype._proxyKey = 'Proxy-Authenticate';

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
      this.isProxy = false;
      tmp = header;
      if (isObject(header)) {
        if (isFunction(header.getResponseHeader)) {
          header = header.getResponseHeader.bind(header);
        } else if (isFunction(header.getHeader)) {
          header = header.getHeader.bind(header);
        } else if (isFunction(header.headers)) {
          header = header.headers.bind(header);
        }
      }
      if (isFunction(header)) {
        tmp = header(this._key);
        if (!(tmp && isString(tmp))) {
          tmp = header(this._proxyKey);
          if (!(tmp && isString(tmp))) {
            header = header();
            tmp = header[this._key];
            if (!(tmp && isString(tmp))) {
              tmp = header[this._proxyKey];
              if (tmp && isString(tmp)) {
                this.isProxy = true;
              }
            }
          } else {
            this.isProxy = true;
          }
        }
      }
      header = tmp;
      this._challenges = [];
      if (header && isString(header)) {
        this._header = header;
        parser = new w3ap.Parser();
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
      if (isError(challenges)) {
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
        scheme = scheme.toLowerCase();
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
      if (result && (isObject(result) || result.length)) {
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

  w3ap.Parser = (function() {
    function Parser(remainder) {
      this.remainder = remainder != null ? remainder : '';
    }

    Parser.prototype.remainder = '';

    Parser.prototype.challenges = [];

    Parser.prototype.error = null;

    Parser.prototype.realmRequired = ['basic', 'digest'];

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
      var challenge, finishChallenge, hasParams, param, params;
      scheme = scheme.toLowerCase();
      challenge = {
        scheme: scheme
      };
      params = {};
      finishChallenge = (function(_this) {
        return function() {
          if (_this.realmRequired.indexOf(scheme) >= 0 && !params.realm) {
            if (!_this.challenges.length) {
              _this.error = 'invalid_syntax';
            }
            return;
          }
          challenge.params = params;
          _this.error = null;
          _this.challenges.push(challenge);
        };
      })(this);
      hasParams = false;
      while (param = this.getParam()) {
        if (!param.length) {
          continue;
        }
        if (param.length === 2) {
          if (isArray(params)) {
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
        } else {
          if (isObject(params)) {
            if (hasParams) {
              if (param[0][param[0].length - 1] === '=') {
                continue;
              } else {
                finishChallenge();
                return this.beginChallenge(param[0]);
              }
            }
            params = [];
          }
          params.push(param[0]);
        }
        hasParams = true;
      }
      finishChallenge();
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
        } else {
          param = part.match(token68ParamRE);
          if (param) {
            part = param[0], val = param[1], remainder = param[2];
            this.remainder = remainder || '';
            return [val];
          }
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

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(factory);
    } else if (typeof module === 'object') {
      module.exports = factory();
    } else {
      root.w3ap = factory();
    }
  })(this, function() {
    return w3ap;
  });

}).call(this);
