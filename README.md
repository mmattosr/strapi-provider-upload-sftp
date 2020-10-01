# strapi-provider-upload-sftp

SFTP provider for Strapi CMS file upload.

## Instalation

```
npm i strapi-provider-upload-sftp
```

## Base URL
`Base URL` is used to generate the URLs for the files. The file name will be appended to it.

Obs: the value should include a / at the end

### Example
```
Base URL: http://example.com/
File name: image.jpg

File URL: http://example.com/image.jpg
```

## Base PATH
`Base PATH` is used to define where, inside FTP, files should be saved.

## Duplicate names
When uploading a file, this provider will check if there is already a file with the same name on the server. If the file name already exists it will append a counter to the file name that will be incremented until the name is available.

### Example
```
Files in the server:
  - file.jpg
  - file(1).jpg

File you are trying to upload:
  - file.jpg

The file will be uploaded as file(2).jpg
```

### Example using environment variables or .env
```
# example environment variables, each env if avalable will override entries from web-ui and db in /plugins/upload/configurations(therfore in the ui config, setings can be replaced with dummy data)
SFTP_UPLOAD_HOST=example.com
SFTP_UPLOAD_PORT=22
SFTP_UPLOAD_USER=userName
SFTP_UPLOAD_PASSWORD=yourSshPassword
SFTP_UPLOAD_BASEURL=https://the-url-to-upload-dir-including-slash-at-end/
SFTP_UPLOAD_BASEPATH=/home/you/public_html/path-to-sftp-dir
```


## License

MIT License

Copyright (c) 2019 Marcelo Mattos
