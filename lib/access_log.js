var mongoose = require('mongoose');
var options = {};
var db = mongoose.connect('mongodb://127.0.0.1:27017/proxy', options);
// Error handler
mongoose.connection.on('error', function (err) {
  console.error(err);
})

mongoose.connection.on('disconnected', function () {
  mongoose.connect(config.db)
})

var Schema = mongoose.Schema;
var AccessLogSchema = new Schema({
  app_name: {type: String, default: "headline"},
  device_id: String,
  method: String,
  body: String,
  request_time: { type: Date, default: Date.now() }
}, { strict: false });
var AccessLog = db.model('access_logs', AccessLogSchema);

function accessLog(data, req, res){
  var ip = get_client_ip(req);
  var params = req.query;
  if (ip == '211.103.136.176' || ip == '211.103.135.176' || ip =='127.0.0.1'){
    var set = {
      params: params,
      ip: ip,
      device_id: params.device_id,
      body: data
    }
    AccessLog.create(set, function(err, result){
      if (result) {return false};
    })
  }
}

function get_client_ip(req){
  var ipAddress;
  var headers = req.headers;
  var forwardedIpsStr = headers['X-Real-IP'] || headers['x-forwarded-for'];
  forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
  if (!ipAddress) {
      ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}

module.exports = accessLog