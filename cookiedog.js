var _ = require('lodash')

exports.toCookie = toCookie
exports.parseCookie = parseCookie
exports.parseSetCookie = parseSetCookie
exports.CookieClient = CookieClient


// note: lazy expired removal
function CookieClient(list){
  this._list = list || []
}
CookieClient.prototype.setCookie = function setCookie(domain, arr){
  var list = this._list
  var arr1 = parseSetCookie(arr)
  _.each(arr1, function(o){
    // fixme: not cool so low
    _.remove(list, { key: o.key})
    if (!o.domain) o.domain = domain
    list.push(o)
  })
}
CookieClient.prototype.getCookieObj = function getCookieObj(domain, path){
  path = path || '/'
  var now = Date.now()
  var obj = {}
  var list = this._list
  // note: a big mix _.each sums less redundant iteration
  _.each(list, function(o){
    // note: faster & easier than regex
    var domainmat = matchTrailing(domain, o.domain)
    var pathmat = path === o.path
    if (!domainmat || !pathmat) return
    var dateout = o.expires != null && o.expires <= now
    if (dateout) {
      _.remove(list, { key: o.key})
      return
    }
    // finally matched
    obj[o.key] = o.val
  })
  return obj
}
CookieClient.prototype.getCookie = function getCookie(domain, path){
  var cookieobj = this.getCookieObj(domain, path)
  var str = toCookie(cookieobj)
  return str
}
function matchTrailing(str, sub){
  var i = str.indexOf(sub)
  return i > -1 && i === str.length - sub.length
}



function toCookie(obj){
  var arr = _.reduce(obj, function(m, v, k){
    m.push(k + '=' + encodeURIComponent(v))
    return m
  }, [])
  var str = arr.join('; ')
  return str
}

function parseCookie(str){
  var arr = str.split(/\s*;\s*/)
  arr = _.compact(arr)
  var obj = _.reduce(arr, function(m, s){
    var ss = s.split(/\s*=\s*/)
    if (ss.length < 2 || !ss[0]) return m
    m[ss[0]] = decodeURIComponent(ss[1])
    return m
  }, {})
  return obj
}

function parseSetCookie(arr){
  arr = _.compact(arr)
  var arr = _.reduce(arr, function(m, s){
    var t
    var keyv = t=s.match(/(.+?)=(.+?)(;|$)/)
    if (!keyv || !keyv[1]) return m
    var key = decodeURIComponent(keyv[1])
    var val = decodeURIComponent(keyv[2])
    // note: never miss the () around t
    var path = (t=s.match(/;\s*path\s*=(.+?)(;|$)/i)) ? t[1] : '/'
    var domain = (t=s.match(/;\s*domain\s*=(.+?)(;|$)/i)) ? t[1] : null
    var expires = (t=s.match(/;\s*expires\s*=(.+?)(;|$)/i)) ? t[1] : null
    var o = {
      key: key,
      val: val,
      path: path,
      domain: domain,
      expires: expires == null ? null : new Date(expires).getTime()
    }
    m.push(o)
    return m
  }, [])
  return arr
}
