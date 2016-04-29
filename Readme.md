S3-Lister-AWS
=============

A simple library to stream all the files which are the contents of an s3 folder. Forked from [S3-Lister](https://github.com/segmentio/s3-lister) to use [aws-sdk](https://github.com/aws/aws-sdk-js) instead of [knox](https://github.com/Automattic/knox)


## Usage

```javascript
// Print all the files for a given prefix.

var client = new AWS.S3({
  accessKeyId: '<api-key-here>',
  secretAccessKey : '<secret-here>',
  params: {
    Bucket : 'segmentio'
  }
});

var lister = new S3Lister(client, {params: {Prefix : 'logs/api/a0z4'}});

lister
  .on('data',  function (data) { console.log(data.Key); })
  .on('error', function (err)  { console.log('Error!', err); })
  .on('end',   function ()     { console.log('Done!'); });
```


### new S3Lister(s3, options)

* s3      - a knox client
* options

In addition to the standard stream options, you can also pass in specific options:

* start      - string to start with
* maxResults - maximum amount of keys to list in total
* params     - passed through to [`AWS.S3.listObjects`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property)

## License

(The MIT License)

Copyright (c) 2013 Segment.io <friends@segment.io>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
