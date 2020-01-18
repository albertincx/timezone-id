update: 01.01.2020
===========

If you want to find tz by city name, you need to get the key for geocoder [here](https://developer.tech.yandex.ru/?from=club)


Description
===========

timezone client module for [node.js](http://nodejs.org/) that provides an asynchronous interface for getting timezone by city name or coords.
zone ID will be retrieved from here:

1. https://geocode-maps.yandex.ru/1.x/?geocode=[city]&format=json&results=1
2. https://api.teleport.org/api/locations/[coordinates]/?embed=location:nearest-cities/location:nearest-city/city:timezone

Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer
* API_KEY from [here](https://developer.tech.yandex.ru/?from=club) -- for city names

Install
=======

    npm install timezone-id


Examples
========

* Get a timezone by city name:

```javascript
  var tz = require('timezone-id');
  
  tz.getTimeZone('Sydney', API_KEY).then(timeZoneId => {
        console.log(timeZoneId); //Australia/Sydney
      })
```

* Get a timezone by location coordinates:

```javascript
  var tz = require('timezone-id');
    tz.getTimeZone([55.755814, 37.617635]).then(timeZoneId => {
          console.log(timeZoneId); //Asia/Tehran
        })
```
