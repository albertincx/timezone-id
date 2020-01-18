const https = require('https');
const teleportSchema = {
  '_embedded': {
    'location:nearest-cities': [
      {
        '_embedded': {
          'location:nearest-city': {
            '_links': {
              'city:timezone': 'name',
            },
          },
        },
      }],
  },
};

function findByScheme(data, scheme) {
  for (let i in scheme) {
    let item = scheme[i];
    if (Array.isArray(item)) {
      item = item[0];
    }
    let dataItem = data[i];
    if (Array.isArray(dataItem)) {
      dataItem = dataItem[0];
    }

    if (typeof item === 'object') {
      return findByScheme(dataItem, item);
    } else {
      return dataItem[item];
    }
  }
}

function TZ() {
  if (!(this instanceof TZ))
    return new TZ();

  this.replacer = (str, obj) => {
    Object.entries(obj).map(
        property =>
            str = str.replace(`~${property[0]}~`, property[1]),
    );
    return str;
  };

  this.urls = {
    ya: 'https://geocode-maps.yandex.ru/1.x/?geocode=~city~&format=json&results=1&apikey=~key~',
    teleport: 'https://api.teleport.org/api/locations/~coords~/?embed=location:nearest-cities/location:nearest-city/city:timezone',
  };
}

TZ.prototype.get = function(url) {
  return new Promise((resolve, reject) => {
    url = encodeURI(url);
    https.get(url, res => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        body = JSON.parse(body);
        resolve(body);
      });
      res.on('error', e => {
        reject(e);
      });
    });
  });
};

TZ.prototype.tzByCoords = async function(coords, timestamp = 0) {
  if (!coords || coords.length <= 1) throw 'Empty coords';
  coords.reverse();
  coords = `${coords.join(',')}`;
  var url = this.replacer(this.urls.teleport, {
    coords,
    timestamp,
  });
  var res = await this.get(url);
  let timezoneId = '';
  try {
    timezoneId = findByScheme(res, teleportSchema);
  } catch (e) {
    console.log(e);
  }

  return timezoneId;
};

TZ.prototype.tzByName = async function(city, key) {
  city = city.trim();
  if (!city) return '';
  city = city.toLocaleLowerCase().replace(/\s+/, ' ');
  let clean = '';
  for (let i = 0; i < city.length; i++) {
    let letter = city.charAt(i);
    if (letter.length === 0) {
      continue;
    }
    if (letter.match(/\s/) || (letter.match(/\W/)
        && letter.match(/[а-я\u0600-\u06FF]/))) {
      clean += letter;
    } else {
      if (letter.match(/[a-z]/)) {
        clean += letter;
      }
    }
  }
  var res = null;
  city = clean;
  if (city) {
    var url = this.replacer(this.urls.ya, { city });
    url = this.replacer(url, { key })
    res = await this.get(url);
  }
  var timeZoneId = '';
  try {
    if (res && res.response.GeoObjectCollection) {
      res = res.response.GeoObjectCollection.featureMember;
      if (res[0]) {
        res = res[0].GeoObject.Point.pos.split(' ');
      }
      timeZoneId = await this.tzByCoords(res);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }

  return timeZoneId;
};

/**
 * @param data string|array City name or coords.
 * @return Promise{}
 */
TZ.getTimeZone = async function(data, key) {
  var tz = new TZ();
  try {
    if (typeof data === 'string') {
      return await tz.tzByName(data, key);
    } else {
      return await tz.tzByCoords(data);
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = TZ;
