/*!
 * w3ap - v0.6.0 - 2014-05-07
 * https://github.com/jylauril/w3ap
 * Copyright (c) 2014 Jyrki Laurila <https://github.com/jylauril>
 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s={}.hasOwnProperty;i=function(a,b){return Object.prototype.toString.call(a)==="[object "+b+"]"},h=function(a){return i(a,"String")},j=function(a){return i(a,"Undefined")},f=function(a){return i(a,"Number")},g=function(a){return i(a,"Object")},c=function(a){return i(a,"Array")},d=function(a){return c(a)||a&&!h(a)&&f(a.length)},h=function(a){return i(a,"String")},e=function(a){return i(a,"Function")},b=function(a,c){var e,f,h,i,j,k,l;if(d(a)){if(c){for(h=[],k=0,l=a.length;l>k;k++)e=a[k],h.push(b(e,c));return h}return Array.prototype.slice.call(a)}if(g(a)){i={};for(f in a)s.call(a,f)&&(j=a[f],i[f]=c?b(j,c):j);return i}return a},p="[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+",l='"((?:[^"\\\\]|\\\\.)*)"',m="("+p+")="+l,k="("+p+")=([\\w])",n=new RegExp("^[,\\s]*"+m+"[,\\s]*(.*)"),q=new RegExp("^[,\\s]*"+k+"[,\\s]*(.*)"),o=new RegExp("^[,\\s]*("+p+")\\s(.*)"),a=function(){function a(a){this.remainder=null!=a?a:""}return a.prototype.remainder="",a.prototype.challenges=[],a.prototype.error=null,a.prototype.parse=function(a){var b;for(h(a)&&(this.remainder=a),this.challenges=[];b=this.getScheme();)this.beginChallenge(b);return this.challenges.length||(this.error="invalid_syntax"),this},a.prototype.beginChallenge=function(a){var b,c,d;for(b={scheme:a},d=b.params={};c=this.getParam();)c.length&&("realm"===c[0]&&h(d.realm)?(d.realm="",this.challenges.length||(this.error="invalid_syntax")):d[c[0]]=c[1]);return d.realm?(this.error=null,void this.challenges.push(b)):void(this.challenges.length||(this.error="invalid_syntax"))},a.prototype.getParam=function(){var a,b,c,d,e,f,g;if(d=this.remainder,c=d.match(n)){if(d=c[0],b=c[1],f=c[2],e=c[3],this.remainder=e||"",g=f,f.indexOf("\\")>=0)try{g=JSON.parse('"'+f+'"')}catch(h){a=h,g=f}return[b.toLowerCase(),g]}return(c=d.match(q))?(d=c[0],b=c[1],f=c[2],e=c[3],this.remainder=e||"",b=b.toLowerCase(),"realm"===b?[]:[b,f]):!1},a.prototype.getScheme=function(){var a,b,c,d;return a=this.remainder,c=a.match(o),c&&c.length>1?(d=c,a=d[0],c=d[1],b=d[2],this.remainder=b||"",c.toLowerCase()):!1},a.prototype.toObject=function(){return b(this.challenges,!0)},a}(),r=function(){function c(a){return this instanceof c?void this.parse(a):new c(a)}return c.prototype._key="WWW-Authenticate",c.prototype._error=null,c.prototype._header=null,c.prototype._challenges=[],c.parse=function(a){return new c(a)},c.prototype.parse=function(b){var c,d;return arguments.length||(b=this._header),g(b)?e(b.getResponseHeader)?b=b.getResponseHeader(this._key):e(b.getHeader)?b=b.getHeader(this._key):e(b.headers)&&(d=b.headers(this._key),d&&h(d)||(d=(b.headers()||{})[this._key]),b=d):e(b)&&(b=b(this._key)),this._challenges=[],b&&h(b)&&(this._header=b,c=new a,c.parse(b),c.error?(this._error=c.error,this._challenges=[]):this._challenges=c.toObject()),this._error||this._challenges.length||(this._error="invalid_syntax"),this},c.prototype.get=function(a,b){var c,d,g,j,k,l,m,n;if(j=[],d=this.toObject(),i(d,"Error"))return d;if(f(a))j=d[a]||null;else if(e(a))for(g=k=0,m=d.length;m>k;g=++k)c=d[g],a(c,g,d)&&j.push(c);else if(h(a)){for(g=l=0,n=d.length;n>l;g=++l)if(c=d[g],c&&c.scheme===a)if(f(b)){if(0===b){j=c;break}b--}else if(h(b)){if(b===c.params.realm){j=c;break}}else e(b)?b(c,g,d)&&j.push(c):j.push(c)}else j=d;return j&&j.length?j:null},c.prototype.toObject=function(){return this._error?new Error(this._error):b(this._challenges,!0)},c}(),function(a,b){var c;"function"==typeof define&&define.amd?define(b):"object"==typeof module?module.exports=b():"object"==typeof c?c=b():a.w3ap=b()}(this,function(){return r})}).call(this);