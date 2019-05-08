const path = require('path')

jest.unmock('../index')
const lib = require('../index')
const getSFTPConnection = require('../utils/getSFTPConnection')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('strapi-provider-upload-sftp', () => {
  const config = {
    host: process.env.TEST_HOST,
    port: process.env.TEST_PORT,
    user: process.env.TEST_USER,
    password: process.env.TEST_PASS,
    baseUrl: process.env.TEST_BASE_URL,
    basePath: process.env.TEST_BASE_PATH
  }

  it('required env variables should be defined', () => {
    expect(config.host).toBeDefined()
    expect(config.user).toBeDefined()
    expect(config.basePath).toBeDefined()
    expect(config.baseUrl).toBeDefined()
  })

  it('should init properly', async () => {
    const { upload, delete: remove } = lib.init(config)

    expect(upload).toBeDefined()
    expect(remove).toBeDefined()
  })

  describe('upload()', () => {
    it('should call sftp connection to upload a file', async () => {
      // mock dependencies
      const sftp = {
        list: jest.fn().mockResolvedValue([{ name: 'sample.jpg' }, { name: 'sample(1).jpg' }]),
        put: jest.fn().mockResolvedValue({}),
        end: jest.fn()
      }
      getSFTPConnection.mockResolvedValue(sftp)

      // init lib
      const { upload } = lib.init(config)

      // call upload function
      const file = {
        name: 'sample.jpg',
        ext: '.jpg',
        buffer: 'fake-buffer',
        public_id: undefined,
        url: undefined
      }
      await upload(file)

      // check if the file object had its values updated
      expect(file.public_id).toBe('sample(2).jpg')
      expect(file.url).toBe(`${config.baseUrl}sample(2).jpg`)

      expect(sftp.list).toHaveBeenCalledWith(config.basePath);
      expect(sftp.list).toHaveBeenCalledTimes(1);

      // check if the file rename works when there is files with the same name on directory
      expect(sftp.put).toHaveBeenCalledWith(file.buffer, path.resolve(config.basePath, 'sample(2).jpg'));
      expect(sftp.put).toHaveBeenCalledTimes(1);

      expect(sftp.end).toHaveBeenCalledTimes(1);

      expect(getSFTPConnection).toHaveBeenCalledTimes(1);
    })
  })

  describe('delete()', () => {
    it('should call sftp connection to delete a file', async () => {
      // mock dependencies
      const sftp = {
        delete: jest.fn().mockResolvedValue({}),
        end: jest.fn()
      }
      getSFTPConnection.mockResolvedValue(sftp)

      // init lib
      const { delete: remove } = lib.init(config)

      // call delete function
      await remove({ public_id: 'sample.jpg' })

      // check if the file object had its values updated
      expect(sftp.delete).toHaveBeenCalledWith('sample.jpg');
      expect(sftp.delete).toHaveBeenCalledTimes(1);

      expect(sftp.end).toHaveBeenCalledTimes(1);

      expect(getSFTPConnection).toHaveBeenCalledTimes(1);
    })
  })
})
