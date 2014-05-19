var Q = require('q');
var request = require('request');


function proxy(opts_list, req, res){
  var arr = [];
  var result = {};
  for (i=0;i<opts_list.length;i++){
    arr.push(send_request(opts_list[i], req, res, result))
  }
  Q.all(arr).then(
    function(){
      res.send(result)
    }
  );
}

function send_request(option, req, res, result){
  var deferred = Q.defer();
  var config_params = option.params;
  request_opts = {
    url: option.url,
    timeout: option.timeout || 5000,
    method: option.method.toUpperCase()  || "GET",
    header: option.header || {}
  }
  if (option.params_default){
    qs = option.params_default;
  }
  else{
    qs = {};
  }
  for (key in config_params){
    var value = req.query[config_params[key]]
    if (value){
      qs[key] = value
    }
  }
  request_opts.qs = qs;
  request(request_opts, function(err, r, body){
    if (err){ deferred.reject(err);}
    if (body){
      try{
        var data = JSON.parse(body);
      }
      catch(err){
        console.log("返回结果无法进行JSON解析");
        res.send({msg:"服务器错误"})
        deferred.reject(err);
      }
    }
    if (!option.handles){
      extend(result,data);
      deferred.resolve();
    }
    else{
      for(i=0; i < option.handles.length; i++){
        extend(result, option.handles[i](data, req, res))
      }
      deferred.resolve();
    }
  })
  return deferred.promise;
}

var extend=function(o,n,override){
   for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p];
};

module.exports = proxy;
