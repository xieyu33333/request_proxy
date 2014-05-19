var proxy = require("../proxy.js");
var accessLog = require("../lib/access_log.js");
module.exports = function(app){
  app.get( '/test', show);
}

var show = function(req, res){
  var opts = [
    {
      url: "http://ptcms.csdn.net/article/service/get_article",
      method: "GET",
      handles: [getArticleBody, accessLog],
      params: {"aid":"aid"}
    },
    { 
      url: "http://ptcms.csdn.net/article/service/get_article_list",
      method: "GET",
      handles: [getArticleType],
      params: {"pageno":"page",
               "pagesize":"size",
               "channel_id":"channel_id",
               "limit_day":"limit_day"
              },
      params_default: {"pageno":1,
               "pagesize":10,
               "channel_id": 1,
               "limit_day":180
              }
    }
  ]

  proxy(opts, req, res);
}


function getArticleBody(data, req, res){
  if (data && data.msg)
    return {"信息":data.msg}
  else{
    return {"文章详情": data.content}
  }
}

function getArticleType(data, req, res){
  if (data && data[0]){
    return {"文章类型":data[0].article_type}
  }
  else{
    return {"信息": data.msg}
  }
}

