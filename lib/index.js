
var stream = require('readable-stream')
  , util   = require('util')
  , assign = require('object-assign');


module.exports = S3Lister;

/**
 * Create a new S3Lister
 * @param {Object} s3  a knox-like client
 * @param {Object} options
 *   @field {Boolean} start  key to start with
 *   @field {Boolean} maxResults  maximum amount of objects to list
 *   @field {Object} params  Passed through to `AWS.S3.listObjects` see
 * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 */
function S3Lister (s3, options) {
  options || (options = {});
  options.objectMode = true;

  stream.Readable.call(this, options);

  this.s3         = s3;
  this.marker     = options.start;
  this.connecting = false;
  this.resultCount = 0;
  this.maxResults = options.maxResults;
  this.s3Params = options.params || {};
}

util.inherits(S3Lister, stream.Readable);


/**
 * Readable stream method
 */
S3Lister.prototype._read = function () {
  if (this.connecting || this.ended) return;

  var params = assign({}, this.s3Params, {Marker: this.marker});

  this._list(params);
};


/**
 * Request S3 for the list of files matching the prefix.
 * @param  {Object} params - passed through to `AWS.S3.listObjects` see
 * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 */
S3Lister.prototype._list = function (params) {
  var self = this;
  this.connecting = true;

  this.s3.listObjects(params, function (err, data) {
    self.connecting = false;
    if (err) return self.emit('error', err);

    var files = data.Contents;

    // if there's still more data, set the start as the last file
    if (data.IsTruncated) self.marker = files[files.length - 1].Key;
    else self.ended = true;

    files.forEach(function (file) {
      self.resultCount++;
      if (self.maxResults && self.resultCount > self.maxResults) {
        self.ended = true;
        return;
      }
      self.push(file);
    });
    if (self.ended) self.push(null);
  });
};



