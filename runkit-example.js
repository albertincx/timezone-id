var tz = require('timezone-id');

tz.getTimeZone('Sydney').then(timeZoneId => {
  console.log(timeZoneId); //Australia/Sydney
})
