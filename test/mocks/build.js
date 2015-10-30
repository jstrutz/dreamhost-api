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
  'account-domain_usage',
  'account-list_keys',
  'account-status',
  'account-user_usage',
  'announcement_list-list_lists',
  'announcement_list-list_subscribers',
  // 'announcement_list-add_subscriber',
  // 'announcement_list-remove_subscriber',
  // 'announcement_list-post_announcement',
  'api-list_accessible_cmds',
  'api-list_keys',
  'dns-list_records',
  // 'dns-add_record',
  // 'dns-remove_record'
  'domain-list_domains',
  'domain-list_registrations',
  'domain-registration_available',
  // 'dreamhost_ps-add_ps',
  // 'dreamhost_ps-remove_ps',
  'dreamhost_ps-list_pending_ps',
  // 'dreamhost_ps-remove_pending_ps',
  'dreamhost_ps-list_ps',
  'dreamhost_ps-list_settings',
  // 'dreamhost_ps-set_settings',
  'dreamhost_ps-list_size_history',
  // 'dreamhost_ps-set_size',
  'dreamhost_ps-list_reboot_history',
  // 'dreamhost_ps-reboot',
  'dreamhost_ps-list_usage',
  'dreamhost_ps-list_images',
  'jabber-list_users',
  'jabber-list_users_no_pw',
  'jabber-list_valid_domains',
  // 'jabber-add_user',
  // 'jabber-remove_user',
  // 'jabber-reactivate_user',
  // 'jabber-deactivate_user',
  'mail-list_filters',
  // 'mail-add_filter',
  // 'mail-remove_filter',
  'mysql-list_dbs',
  'mysql-list_hostnames',
  // 'mysql-add_hostname',
  // 'mysql-remove_hostname',
  'mysql-list_users',
  // 'mysql-add_user',
  // 'mysql-remove_user',
  // 'rewards-add_promo_code',
  // 'rewards-remove_promo_code',
  // 'rewards-enable_promo_code',
  // 'rewards-disable_promo_code',
  'rewards-list_promo_codes',
  'rewards-promo_details',
  'rewards-referral_summary',
  'rewards-referral_log',
  // 'services-progress',
  // 'services-flvencoder',
  // 'user-add_user',
  'user-list_users',
  // 'user-remove_user',
];

Promise.all(commands.map( command => {
  var url = `https://api.dreamhost.com/?cmd=${command}&key=${apiKey}&format=json`;
  return fetch(url)
    .then( resp => resp.json() )
    .then( respData => {
      return new Promise( (resolve, reject) => {
        var filename =
        fs.writeFile( path.join(__dirname, command + '.json'),
                      JSON.stringify(respData, null, '  '),
                      function(err) {
                        if (err) reject(err);
                        else resolve()
                      });
      });
    });
}))
.then( () => {
  console.log('Done');
}, (err) => console.error(err));
