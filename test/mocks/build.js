/*
 * Download and write json responses into the local directory, using the API key
 * given in DH_API_KEY.
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import {Promise} from 'es6-promise'

const apiEnvVar = 'DH_API_KEY';
const apiKey = process.env[apiEnvVar];
if (!apiKey) throw Error('No API key defined in ' + apiEnvVar);

const commands = [
  'domain-list_registrations',

];


Promise.all(commands.map( command => {
  var url = `https://api.dreamhost.com/?cmd=${command}&key=${apiKey}&format=json`;
  return fetch(url)
    .then( resp => resp.json() )
    .then( respData => {
      console.log(respData);
      return new Promise( (resolve, reject) => {
        var filename = path.join(__dirname, command + '.json');
        console.log(filename);
        fs.writeFile(filename, JSON.stringify(respData, null, '  '), function(err) {
          if (err) reject(err);
          else {
            resolve()
          }
        });
      });
    });
}))
.then( () => {
  console.log('Done');
}, (err) => console.error(err));
// for (let command of commands) {
//   console.log(command);
//   var url = `https://api.dreamhost.com/?cmd=${command}&key=${apiKey}&format=json`;
//   console.log(url);
//   promiseChain
//     .then( () => fetch(url) )
//     .then( (resp) => resp.json() )
//     .then( (respData) => {
//       var p = new Promise();
//       var filename = path.join('.', command + '.json');
//       console.log(filename);
//       fs.writeFile(filename, JSON.stringify(respData, null, '  '), function(err) {
//         if (err) console.error(err)
//         else {
//           p.resolve()
//         }
//       });
//       return p;
//     });
// }
//
// promiseChain.then( () => console.log('Done.'), (err) => console.error(err));
