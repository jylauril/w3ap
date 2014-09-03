/*!
 * w3ap - v0.6.0 - 2014-09-03
 * https://github.com/jylauril/w3ap
 * Copyright (c) 2014 Jyrki Laurila <https://github.com/jylauril>
 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t={}.hasOwnProperty;i=function(a){return function(b){return Object.prototype.toString.call(b)==="[object "+a+"]"}},h=i("String"),f=i("Number"),b=i("Array"),d=i("Error"),h=i("String"),e=i("Function"),c=function(a){return b(a)||a&&!h(a)&&f(a.length)},g=i("Object"),g(void 0)&&(g=function(a){return a&&i("Object")(a)}),a=function(b,d){var e,f,h,i,j,k,l;if(c(b)){if(d){for(h=[],k=0,l=b.length;l>k;k++)e=b[k],h.push(a(e,d));return h}return Array.prototype.slice.call(b)}if(g(b)){i={};for(f in b)t.call(b,f)&&(j=b[f],i[f]=d?a(j,d):j);return i}return b},q="[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+",o="[a-zA-Z0-9\\-\\._\\~\\+\\/]+[=]{0,2}",k='"((?:[^"\\\\]|\\\\.)*)"',l="("+q+")="+k,j="("+q+")=("+q+")",n=new RegExp("^[,\\s]*("+q+")\\s(.*)"),m=new RegExp("^[,\\s]*"+l+"[,\\s]*(.*)"),r=new RegExp("^[,\\s]*"+j+"[,\\s]*(.*)"),p=new RegExp("^("+o+")(?:$|[,\\s])(.*)"),s=function(){function b(a){return this instanceof b?void this.parse(a):new b(a)}return b.prototype.isProxy=!1,b.prototype._key="WWW-Authenticate",b.prototype._proxyKey="Proxy-Authenticate",b.prototype._error=null,b.prototype._header=null,b.prototype._challenges=[],b.parse=function(a){return new b(a)},b.prototype.parse=function(a){var c,d,f;if(arguments.length||(a=this._header),this.isProxy=!1,f=a,g(a)&&(e(a.getResponseHeader)?a=a.getResponseHeader.bind(a):e(a.getHeader)?a=a.getHeader.bind(a):e(a.headers)&&(a=a.headers.bind(a))),e(a)&&(f=a(this._key),!f||!h(f)))if(f=a(this._proxyKey),f&&h(f))this.isProxy=!0;else{try{a=a(),f=a[this._key]}catch(i){c=i,f=null}f&&h(f)||(f=a[this._proxyKey],f&&h(f)&&(this.isProxy=!0))}return a=f,this._challenges=[],a&&h(a)&&(this._header=a,d=new b.Parser,d.parse(a),d.error?(this._error=d.error,this._challenges=[]):this._challenges=d.toObject()),this._error||this._challenges.length||(this._error="invalid_syntax"),this},b.prototype.get=function(a,b){var c,i,j,k,l,m,n,o;if(k=[],i=this.toObject(),d(i))return i;if(f(a))k=i[a]||null;else if(e(a))for(j=l=0,n=i.length;n>l;j=++l)c=i[j],a(c,j,i)&&k.push(c);else if(h(a)){for(a=a.toLowerCase(),j=m=0,o=i.length;o>m;j=++m)if(c=i[j],c&&c.scheme===a)if(f(b)){if(0===b){k=c;break}b--}else if(h(b)){if(b===c.params.realm){k=c;break}}else e(b)?b(c,j,i)&&k.push(c):k.push(c)}else k=i;return k&&(g(k)||k.length)?k:null},b.prototype.toObject=function(){return this._error?new Error(this._error):a(this._challenges,!0)},b}(),s.Parser=function(){function c(a){this.remainder=null!=a?a:""}return c.prototype.remainder="",c.prototype.challenges=[],c.prototype.error=null,c.prototype.realmRequired=["basic","digest"],c.prototype.parse=function(a){var b;for(h(a)&&(this.remainder=a),this.challenges=[];b=this.getScheme();)this.beginChallenge(b);return this.challenges.length||(this.error="invalid_syntax"),this},c.prototype.beginChallenge=function(a){var c,d,e,f,i;if(a){for(a=a.toLowerCase(),c={scheme:a},i={},d=function(b){return function(){return b.realmRequired.indexOf(a)>=0&&!i.realm?void(b.challenges.length||(b.error="invalid_syntax")):(c.params=i,b.error=null,void b.challenges.push(c))}}(this),e=!1;f=this.getParam();)if(f.length){if(2===f.length){if(b(i))continue;if("realm"===f[0]&&h(i.realm)){i.realm="",this.challenges.length||(this.error="invalid_syntax");continue}i[f[0]]=f[1]}else{if(g(i)){if(e){if("="===f[0][f[0].length-1])continue;return d(),this.beginChallenge(f[0])}i=[]}i.push(f[0])}e=!0}d()}},c.prototype.getParam=function(){var a,b,c,d,e,f,g;if(d=this.remainder,c=d.match(m)){if(d=c[0],b=c[1],f=c[2],e=c[3],this.remainder=e||"",g=f,f.indexOf("\\")>=0)try{g=JSON.parse('"'+f+'"')}catch(h){a=h,g=f}return[b&&b.toLowerCase()||"",g]}return(c=d.match(r))?(d=c[0],b=c[1],f=c[2],e=c[3],this.remainder=e||"",b=b&&b.toLowerCase()||"","realm"===b?[]:[b,f]):(c=d.match(p))?(d=c[0],f=c[1],e=c[2],this.remainder=e||"",[f]):!1},c.prototype.getScheme=function(){var a,b,c,d;return a=this.remainder,c=a.match(n),c&&c.length>1?(d=c,a=d[0],c=d[1],b=d[2],this.remainder=b||"",c&&c.toLowerCase()):!1},c.prototype.toObject=function(){return a(this.challenges,!0)},c}(),function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof module?module.exports=b():a.w3ap=b()}(this,function(){return s})}).call(this);