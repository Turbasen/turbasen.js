# turbasen.js

[![Build status](https://img.shields.io/wercker/ci/559c3dd74dacf3c44d27bc68.svg "Build status")](https://app.wercker.com/project/bykey/6f41adbdc47680f39a46b406544bdbe9)
[![NPM downloads](https://img.shields.io/npm/dm/turbasen.svg "NPM downloads")](https://www.npmjs.com/package/turbasen)
[![NPM version](https://img.shields.io/npm/v/turbasen.svg "NPM version")](https://www.npmjs.com/package/turbasen)
[![Node version](https://img.shields.io/node/v/turbasen.svg "Node version")](https://www.npmjs.com/package/turbasen)
[![Dependency status](https://img.shields.io/david/turistforeningen/turbasen.js.svg "Dependency status")](https://david-dm.org/turistforeningen/turbasen.js)

Node.JS-client for [Nasjonal Turbase](http://www.nasjonalturbase.no).

## Requirements

* Node.JS >= v0.10
* io.js >= v1.0.0

## Install

```
npm install turbasen --save
```

## API

```js
var turbasen = require('turbasen');
```

### Object Types

| Data Type  | API object                |
|------------|---------------------------|
| Areas      | `turbasen.områder.…`      |
| Photos     | `turbasen.bilder.…`       |
| Places     | `turbasen.steder.…`       |
| Trips      | `turbasen.turer.…`        |
| Activities | `turbasen.aktiviteter.…`  |
| Groups     | `turbasen.grupper.…`      |

### Status Codes

| Code  | Explanation                    |
|-------|--------------------------------|
| `200` | *Everything is OK*             |
| `201` | *Object created*               |
| `204` | *As `200` without any body*    |
| `400` | Body is missing                |
| `400` | ObjectId is invalid            |
| `401` | Credentials are invalid        |
| `403` | Rate limit is exceeded         |
| `403` | Request was denied             |
| `404` | Resource was not found         |
| `404` | Object was not found           |
| `405` | HTTP method `X` is not allowed |
| `422` | Body should be a JSON Hash     |
| `422` | Data validation failed         | 
| `500` | Internal server error          |

### Configure

The following configurations are read from environment variables when this
module is loaded:

* `NTB_API_KEY` - API key for authenticate requests
* `NTB_API_ENV` - API environment (default `api`, can be `dev`)
* `NTB_USER_AGENT` - User Agent for API requests

These configurations can be overloaded using the `turbasen.configure()` like
this:

```js
turbasen.configure({
  API_KEY: 'my-api-key',
  API_ENV: 'dev',
  USER_AGENT: 'my-app/1.2.3'
});
```

### List Objects

```js
turbasen.områder(query, function(err, res, body) {
  if (err) { throw err; }

  console.log(body.count);
  console.log(body.documents);
});
```

### Post Object

```js
turbasen.bilder.post(object, function(err, res, body) {
  if (err) { throw err; }

  if (res.statusCode !== 201) {
    console.error(body.message);
    console.error(body.errors);
  } else {
    console.log(body);
  }
});
```

### Get Object

```js
turbasen.bilder.get(id, function(err, res, body) {
  if (err) { throw err; }

  if (res.statusCode !== 200) {
    console.error(body.message);
  } else {
    console.log(body);
  }
});
```

### Put Object

```
turbasen.bilder.put(id, object, function(err, res, body) {
  if (err) { throw err; }

  if (res.statusCode !== 200) {
    console.log(body.errors);
  } else {
    console.warn(body.warnings);
    console.log(body.document);
  }
});
```

### Patch Object

```
turbasen.bilder.patch(id, object, function(err, res, body) {
  if (err) { throw err; }

  if (res.statusCode !== 200) {
    console.log(body.errors);
  } else {
    console.warn(body.warnings);
    console.log(body.document);
  }
});
```

## [MIT License](https://github.com/Turistforeningen/turbasen.js/blob/master/LICENSE)
