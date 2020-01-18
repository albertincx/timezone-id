var tz = require('timezone-id');

tz.getTimeZone([55.755814,37.617635]).then(timeZoneId => {
  console.log(timeZoneId); //Asia/Tehran
})
