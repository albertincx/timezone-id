const https = require('https')

function TZ (google_map_key = '') {
  if (!(this instanceof TZ))
    return new TZ(google_map_key)

  if (!google_map_key || typeof google_map_key !== 'string') {
    google_map_key = ''
  }

  this.replacer = (str, obj) => {
    Object.entries(obj).map(
      property =>
        str = str.replace(`~${property[0]}~`, property[1])
    )
    return str
  }

  this.google_map_key = google_map_key

  this.urls = {
    ya: 'https://geocode-maps.yandex.ru/1.x/?geocode=~city~&format=json&results=1',
    google: 'https://maps.googleapis.com/maps/api/timezone/json?location=~coords~&timestamp=~timestamp~&key=~key~'
  }
}

TZ.prototype.get = function (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      res.setEncoding('utf8')
      let body = ''
      res.on('data', data => {
        body += data
      })
      res.on('end', () => {
        body = JSON.parse(body)
        resolve(body)
      })
      res.on('error', e => {
        reject(e)
      })
    })
  })
}

TZ.prototype.tzByCoords = async function (coords, timestamp = 0) {
  if (!coords || coords.length <= 1) return ''
  coords = `${coords[1]},${coords[0]}`
  var url = this.replacer(this.urls.google, {
    coords,
    timestamp,
    key: this.google_map_key
  })
  var res = await this.get(url)

  return res.timeZoneId
}


TZ.prototype.tzByName = async function (city) {
  if (!city) return ''
  var url = this.replacer(this.urls.ya, {city})
  var res = await this.get(url)

  var timeZoneId = ''
  try {
    if (res && res.response.GeoObjectCollection) {
      res = res.response.GeoObjectCollection.featureMember
      if (res[0]) {
        res = res[0].GeoObject.Point.pos.split(' ')
      }
      timeZoneId = await this.tzByCoords(res)
    }

  } catch (e) {
    throw e
  }

  return timeZoneId
}

/**
 * @param data string|array City name or coords.
 * @param gmapKey string Google Map Api key.
 * @return Promise
 */
TZ.getTimeZone = async function (data, gmapKey) {
  var tz = new TZ(gmapKey)
  if (typeof  data === 'string') {
    return await tz.tzByName(data)
  } else {
    return await tz.tzByCoords(data)
  }
}

module.exports = TZ