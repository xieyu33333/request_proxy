var proxy = require("./proxy.js");

exports.show = function(req, res){
  var opts = [
    {
      url: "http://ptcms.csdn.net/article/service/get_article",
      method: "GET",
      handles: ["getArticleBody"],
      params: ["aid"]
    },
    { 
      url: "http://ptcms.csdn.net/article/service/get_article_list",
      method: "GET",
      handles: ["getArticleType"],
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
  var functions = {"getArticleBody":getArticleBody, "getArticleType":getArticleType}

  proxy.concatProxyResult(opts, req, res, functions);
}


function getArticleBody(data, req, res){
  return {"状态码":data.status}
}

function getArticleType(data, req, res){
  if (data && data[0]){
    return {"文章类型":data[0].article_type}
  }
  else{
    return {"信息": data.msg}
  }
}

