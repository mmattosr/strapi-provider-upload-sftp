const path = require('path')
const getSFTPConnection = require('./utils/getSFTPConnection')
require('dotenv').config()

module.exports = {
  provider: 'SFTP',
  name: 'SFTP',
  auth: {
    host: {
      label: 'Host',
      type: 'text',
    },
    port: {
      label: 'Port',
      type: 'text',
    },
    user: {
      label: 'User',
      type: 'text',
    },
    password: {
      label: 'Password',
      type: 'password',
    },
    basePath: {
      label: 'Base PATH',
      type: 'text',
    },
    baseUrl: {
      label: 'Base URL',
      type: 'text',
    }
  },
  init: config => {
    // use env if available(can set plugin config to dummy data) or use db config.
    config.host = process.env.SFTP_UPLOAD_HOST || config.host;
    config.port = process.env.SFTP_UPLOAD_PORT || config.port;
    config.user = process.env.SFTP_UPLOAD_USER || config.user;
    config.password = process.env.SFTP_UPLOAD_PASSWORD || config.password;
    config.baseUrl = process.env.SFTP_UPLOAD_BASEURL || config.baseUrl;
    config.basePath = process.env.SFTP_UPLOAD_BASEPATH || config.basePath;

    const { host, port, user, password, baseUrl, basePath } = config;

    const connection = getSFTPConnection(host, port, user, password)

    return {
      upload(file) {
        return new Promise((resolve, reject) => {
          connection.then(sftp => sftp
            .list(basePath)
            .then(files => {
              const originalFileName = file.name.split('.')[0]
              let fileName = `${originalFileName}${file.ext}`
              let c = 0

              const hasName = f => f.name === fileName

              // scans directory files to prevent files with the same name
              while (files.some(hasName)) {
                c += 1
                fileName = `${originalFileName}(${c})${file.ext}`
              }

              return sftp.put(file.buffer, path.resolve(basePath, fileName))
                .then(() => {
                  /* eslint-disable no-param-reassign */
                  file.public_id = fileName
                  file.url = baseUrl + fileName
                  /* eslint-enable no-param-reassign */

                  sftp.end()

                  resolve()
                })
            })).catch(reject);
        });
      },
      delete(file) {
        const filePath = `${basePath}/${file.url.replace(baseUrl, '')}`
        return new Promise((resolve, reject) => {
          connection.then(sftp => sftp
            .delete(filePath)
            .then(() => {
              sftp.end()

              resolve()
            }))
            .catch(reject)
        });
      },
    };
  },
};
