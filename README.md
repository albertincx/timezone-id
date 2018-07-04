Description
===========

timezone client module for [node.js](http://nodejs.org/) that provides an asynchronous interface for getting timezone by city name or coords.


Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer


Install
=======

    npm install timezone-id


Examples
========

* Get a timezone by city name:

```javascript
  var tz = require('timezone-id');

  tz.getTimeZone('Sydney').then(timeZoneId => {
        console.log(timeZoneId); //Australia/Sydney
      })
```

* Get a timezone by location coordinates:

```javascript
  var tz = require('timezone-id');
  
    tz.getTimeZone([55.755814,37.617635]).then(timeZoneId => {
          console.log(timeZoneId); //Asia/Tehran
        })
```