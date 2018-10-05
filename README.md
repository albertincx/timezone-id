Description
===========

timezone client module for [node.js](http://nodejs.org/) that provides an asynchronous interface for getting timezone by city name or coords.
zone ID will be retrieved from here:

1. https://geocode-maps.yandex.ru/1.x/?geocode=[city]&format=json&results=1
2. https://maps.googleapis.com/maps/api/timezone/json?location=[coordinates]&timestamp=0&key=[api_key]

Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer
* Google Map Api Key (https://developers.google.com/maps/documentation/embed/get-api-key)

Install
=======

    npm install timezone-id


Examples
========

* Get a timezone by city name:

```javascript
  var tz = require('timezone-id');
  var apiKey = process.env.GOOGLE_MAP_API_KEY;
  
  tz.getTimeZone('Sydney', apiKey).then(timeZoneId => {
        console.log(timeZoneId); //Australia/Sydney
      })
```

* Get a timezone by location coordinates:

```javascript
  var tz = require('timezone-id');
  var apiKey = process.env.GOOGLE_MAP_API_KEY;
    tz.getTimeZone([55.755814, 37.617635], apiKey).then(timeZoneId => {
          console.log(timeZoneId); //Asia/Tehran
        })
```
