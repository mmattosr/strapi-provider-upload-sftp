const SFTP = require('ssh2-sftp-client');

/**
 * Returns the connection with a SFTP host.
 *
 * @param {string} host
 * @param {string | number} port
 * @param {string} user
 * @param {string} password
 *
 * @returns {Promise}
 */
function getSFTPConnection(host, port, username, password) {
  const sftp = new SFTP()

  return new Promise((resolve, reject) => {
    sftp
      .connect({ host, port, username, password })
      .then(() => resolve(sftp))
      .then(reject)
  })
}

module.exports = getSFTPConnection
