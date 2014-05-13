var http = require( 'http' )
  , url = require( 'url' )
  , qs = require( 'querystring' )
  , iconv = require( 'iconv-lite' )
  , BufferHelper = require( 'bufferhelper' )
  , Q = require('q')
  , request = require('request');


exports.concatProxyResult = function(opts_list, req, res,functions){
  var arr = [];
  var result = {};
  for (i=0;i<opts_list.length;i++){
    arr.push(send_request(opts_list[i], req, res, result, functions))
  }
  Q.all(arr).then(
    function(){
      res.send(result)
    }
  );
}

function send_request(option, req, res, result, functions){
  var deferred = Q.defer();
  var params = {};
  // var params_config = JSON.parse(option.params);
  if (option.params_default){
    option.qs = option.params_default;
  }
  request_opts = {
    url: opition.url,
    timeout: 5000,
    method: option.method || "GET"
  }
  request(request_opts, function(err, r, body){
    if (err){ deferred.reject(err);}
    if (body){
      var data = JSON.parse(body);
    }
    if (!option.handles){
      extend(result,data);
      deferred.resolve();
    }
    else{
      for(i=0; i < option.handles.length; i++){
        extend(result, functions[option.handles[i]](data, req, res))
      }
      deferred.resolve();
    }
  })
  return deferred.promise;
}

var extend=function(o,n,override){
   for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p];
};

// module.exports=httpHelper;
