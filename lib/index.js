import fetch from 'node-fetch';
import url from 'url';

class Dreamy {

  constructor(key, opts = {}) {
    this.fetch = opts.fetch || fetch;
    this.key = key;
  }

  get registrations() {
    return this._operation('domain-list_registrations')
      .then( res => res.json() )
      .then( json => json.data )
      // .then( registrations => registrations.map( props => this._groupPropsByPrefix(props, ['registrant', 'admin', 'billing', 'tech'])) )
      .then( registrations => {
        console.log("Got %s registrations", registrations.length);
        return registrations.map( reg => this._groupPropsByPrefix( this._makeDate(reg, 'created', 'expires', 'modified'), {prefixes: ['registrant', 'admin', 'billing', 'tech'], defaultKey: 'name'} ))
      })
      // .then( props => this._groupPropsByPrefix(res.json().data, ['registrant', 'admin', 'billing', 'tech']))
  }

  _makeDate(props, ...keys) {
    for (var k of keys) {
      props[k] = new Date(props[k]);
    }
    return props;
  }

  _groupPropsByPrefix(props, opts) {
    var prefixes = opts.prefixes,
      defaultKey = opts.defaultKey;
    // console.log(props);
    var ret = {};
    for (var k of Object.keys(props)) {
      console.log(k);
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

  _operation(cmd, opts = {}) {
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
