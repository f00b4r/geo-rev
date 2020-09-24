<h1 align=center>GEO:Rev</h1>

<p align=center>
🌐 <a href="https://stuchl4n3k.net">stuchl4n3k.net</a> | 💻 <a href="https://github.com/stuchl4n3k">stuchl4n3k</a> | 🐦 <a href="https://twitter.com/stuchl4n3k">@stuchl4n3k</a>
</p>

<p align=center>
<a href="https://circleci.com/gh/webkitty/geo-rev"><img src="https://img.shields.io/circleci/build/github/webkitty/geo-rev?style=flat-square"></a>
<a href="https://codecov.io/gh/webkitty/geo-rev"><img src="https://img.shields.io/codecov/c/github/webkitty/geo0rev?style=flat-square"></a>
<a href="https://github.com/webkitty/geo-rev/blob/master/LICENSE"><img src="https://img.shields.io/github/license/webkitty/geo-rev?style=flat-square"></a>
</p>

<p align=center>
<strong>Simple reverse geocoder for Node.js that works with offline data and offers fast lookup times.</strong>
<br>
📍 → 🌐🔍 → 🏘️
</p>

Every release of the package contains a modified version of the latest free GeoNames.org [cities500](https://download.geonames.org/export/dump/)
dataset (licensed under a Creative Commons Attribution 4.0 License). There is also a possibility to use an external
dataset in the same format. Geocoding of given coordinates is performed using a K-D Tree index, which is built during
initialization of the component.

## ✅ Features

- [x] Parses local (offline) geographical database of places.
- [x] Looks up a nearest place (town/city) to a given geographical location.

## ⚙️ Usage

**Show me the code!**

```typescript
import { createRevGeocoder } from '@webkitty/geo-rev';

const revGeocoder = await createRevGeocoder();
const result = revGeocoder.lookup({latitude: 50.652576, longitude: 13.723918});
console.log(result);
```

```
{
  record: {
    name: 'Hrob',
    latitude: 50.65919,
    longitude: 13.72676,
    countryCode: 'CZ'
  },
  distance: 0.7622437751065233  // [km]
}
```

By default the geocoder uses a bundled dataset.

**OK, what if I need to update the dataset in the future?**

The latest dataset is bundled with each release, but you can always supply yours:

```typescript
const revGeocoder = await createRevGeocoder({dataset: '/path/to/your/dataset.csv'});
```

We use [a simple script](https://github.com/webkitty/geo-rev/blob/master/Makefile) to convert the
[GeoNames.org dataset](https://download.geonames.org/export/dump/cities500.zip) to the supported format:

```bash
wget https://download.geonames.org/export/dump/cities500.zip -O /tmp/geonames.zip
unzip /tmp/geonames.zip | cut -f2,5,6,9 -s --output-delimiter=';' > cities500.csv
```

**But I have a _custom_ dataset!**

No problem, I can hear you. Just convert yours to the following format:

- Cell delimiter is a semi-colon (`;`).
- Row delimiter is a Unix LF (`\n`).
- There is no header row.
- Cell values are not quoted.
- Order of the columns is:
  1. Name of the place (UTF8 `string`)
  2. Latitude (float `number`)
  3. Longitude (float `number`)
  4. ISO Alpha-2 [country code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) of the place (`string`)

For the sake of completeness the CSV should look as follows:

```
Soldeu;42.57688;1.66769;AD
Musashino;35.70611;139.55944;JP
Ängelholm;56.2428;12.86219;SE
...
```

## 🛠️ Build

```bash
make
```

## 🙇‍ Dependencies and attributions

- https://github.com/mikolalysenko/static-kdtree - Static K-D tree data structure
- https://geonames.org - The GeoNames geographical database

## 📜 License

Copyright © 2020 [stuchl4n3k](https://github.com/stuchl4n3k).
This project is [MIT](LICENSE) licensed.
