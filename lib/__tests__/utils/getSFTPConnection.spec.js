const SFTP = require('ssh2-sftp-client');

jest.unmock('../../utils/getSFTPConnection')
const getSFTPConnection = require('../../utils/getSFTPConnection')

describe('utils/getSFTPConnection', () => {
  it('should create a connection using SFTP and env variables', async () => {
    const host = process.env.TEST_HOST
    const port = process.env.TEST_PORT
    const user = process.env.TEST_USER
    const password = process.env.TEST_PASS

    const mockConnect = jest.fn(() => Promise.resolve())
    const mockSFTP = { connect: mockConnect }
    SFTP.mockImplementationOnce(() => mockSFTP)

    const connection = await getSFTPConnection(host, port, user, password)

    expect(SFTP).toHaveBeenCalledTimes(1)
    expect(mockConnect).toHaveBeenCalledTimes(1)
    expect(connection).toBe(mockSFTP)
  })
})
