var request = require('request');
var Q = require('q');

// 需求：
// 单个url直接代理转发
// 多个url结果合并
// 针对每个url请求添加插件

//用法：
ProxyRequest.init(opts_list);
Article = new ProxyRequest
Article.use(universal_handles);

//实现伪代码：
proxy_request = function(opts_list){
  var arr = [];
  for (i=0;i<opts_list.length;i++){
    arr.push(send_request(opts_list[i]))
  }
  Q.all(arr).then(function(){concat(result)}).done();
}


function send_request(opts, universal_handles){
  var deferred = Q.defer();
  request.get(opts[i], function(err, res, body){
    if (err){ 
      deferred.reject(err);
    }
    else{
      universal_handles(body)
      handle(body, params)
      deferred.resolve();
    }
  });
  return deferred.promise;
}

//配置文件格式：
opts_list = [
  { 
    name: name,
    host:host,
    params: parmas
    method: get,
    header:header,
    handle: [fun1, func2],
  }
]