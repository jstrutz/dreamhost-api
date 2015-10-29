import fetch from 'node-fetch';
import url from 'url';

class Dreamy {

  constructor(key, opts = {}) {
    this.fetch = opts.fetch || fetch;
    this.key = key;
  }

  get registrations() {
    return this._callAPI('domain-list_registrations')
      .then( res => res.json() )
      .then( results => results.data
        .map( reg => this._groupPropsByPrefix(
          this._makeDate(reg, 'created', 'expires', 'modified'),
          {
            prefixes: ['registrant', 'admin', 'billing', 'tech'],
            defaultKey: 'name'
          }))
      );
  }

  _makeDate(props, ...keys) {
    for (var k of keys) {
      var date = new Date(props[k]);

      // Sometimes DH will return invalid dates; set them to undefined if so
      props[k] = isNaN(date.getTime()) ? undefined : date;
    }
    return props;
  }

  _groupPropsByPrefix(props, opts) {
    var prefixes = opts.prefixes,
      defaultKey = opts.defaultKey;
    // console.log(props);
    var ret = {};
    for (var k of Object.keys(props)) {
      var [prefix,rest] = k.split('_',2);
      rest = rest || defaultKey
      if (prefixes.indexOf(prefix) >= 0) {
        // This is a prefixed object
        ret[prefix] = ret[prefix] || {};
        ret[prefix][rest] = props[k];
      }
      else {
        ret[k] = props[k];
      }
    }
    return ret;
  }

  _callAPI(cmd, opts = {}) {
    var query = {...opts, key: this.key, cmd, format: 'json'};
    return this.fetch(url.format({
      protocol: 'https',
      host: 'api.dreamhost.com',
      path: '/',
      query
    }));
  }
}

export default Dreamy;
