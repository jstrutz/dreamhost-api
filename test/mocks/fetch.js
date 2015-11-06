'use strict';

import URL from 'url';
import fs from 'fs';
import {Promise} from 'es6-promise';
import path from 'path';

/*
 * A simple mock of fetch, which just hooks on the cmd query argument, and
 * returns the pre-recorded json response
 */
export default function fetch(urlStr, opts) {
  return new Promise(function(resolve, reject) {
    var url = URL.parse(urlStr, true);
    var filename = path.join(__dirname, url.query.cmd + '.json');
    fs.readFile(filename, function(err,body) {
      if (err) reject(err);
      else resolve({
        json: () => Promise.resolve(JSON.parse(body))
      });
    });
  });
};
