const path = require('path')
const getSFTPConnection = require('./utils/getSFTPConnection')

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
        return new Promise((resolve, reject) => {
          connection.then(sftp => sftp
            .delete(file.public_id)
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
