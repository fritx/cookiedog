# cookiedog - A dog for your cookie

This is a node.js module for cookie parsing and storing, which is being applied in **an awesome http project** under construction.

## APIs

```js
toCookie(obj)
parseCookie(str)
parseSetCookie(arr)

CookieClient(list)
CookieClient.prototype.setCookie(domain, arr)
CookieClient.prototype.getCookieObj(domain, path)
CookieClient.prototype.getCookie(domain, path)
```

## Usage

```
$ npm install cookiedog
```

```js
var cookiedog = require('cookiedog')
var cookieclient = new cookielib.CookieClient()
```

```js
var setcookie = res.headers['set-cookie'] || []
cookieclient.setCookie(domain, setcookie)
```

```js
var pathn = req._parsedUrl.pathname
headers['cookie'] = cookieclient.getCookie(domain, pathn)
```

## More?

Coming soon..
