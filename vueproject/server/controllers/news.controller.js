// 控制器 news

const mongoose = require("mongoose");
const News = require("../models/news.model");  //引入 控制器对应的数据模型
const Comment = require('../models/comment.model'); // 评论的 数据模型
async = require("async");  //异步模块


exports.create = function(req,res,next){  // 增加post
	// 实例化 数据模型，参数： req.body, req.query, req.params
	const news = new News(req.body);  
	
	console.log(req.body);
	if (news.cateId !== 'null') { //如果提交的数据 有分类，则添加，
        news.save()
            .then(data => {
                res.json(data)
            })
    } else {
        res.status(401).send({ "errorCode": 101, "message": "请选择分类" });

    }
}

exports.update = function(req,res,next){  // 更新
	// 实例化 数据模型，参数： req.body, req.query, req.params
	console.log("----------更新中-------------");
	const news = new News(req.body);  
	const id = req.params.id; //通过id 更新 数据
	console.log(req.body);
	console.log(id);
	//固定方法findByIdAndUpdate(id,{新内容},{new:true/false})
	// 根据id 更新 内容， new：返回 是否为新数据，false是旧数据， true 是新数据,默认false
	News.findByIdAndUpdate(id,{$set:req.body},{new:false}).then(newsdata=>{
		console.log("-------更新完成----");
		res.send(newsdata);
		
	})
}

exports.list = function(req,res,next){// 查询
	//获取 页码 和 限制 
	console.log("--------查询news数据-------");
	console.log(req.body);
	
	var page = (req.body.page)?req.body.page:1;
	var limit = (req.body.limit)?req.body.limit:5;
	var querySelection = {};
	
	if(req.body.name && req.body.name.trim().length >0){ //正则查找 ，匹配title
		// 如果查询的内容存在 且不为空 ，则开始查找
		name = req.body.name; //查找的内容
		//以正则的方式 进行  i全局查找 , 注意 是个对象模式 {xx:xxx}
		querySelection={ //这个是匹配那个 字段？ 还是 匹配 所有字段的呢？
			"title":new RegExp(name,"i")
		}
	}
	
	if (req.body.cateId && req.body.cateId.trim().length > 0) {

        cateId = req.body.cateId;
        querySelection = {
            "cateId": cateId
        }
    }
	// 表模型.paginate({查询内容},{页码和限制},fn结果)
	// 查询内容为{} 则 是 查询所有
	console.log(querySelection);
	
	News.paginate(querySelection,{page: page, limit:limit }, function(err,result) {
		console.log("-------新闻的评论？？？-----");
		console.log(result.docs);
        async.map(result.docs, function(log, done) {
        	console.log("-------------------");
        	console.log(log);
        	console.log(done);
            Comment.count({ logId: log._id }, function(err, count) {
            	 //这里的 logId 暂时不做改变， 因为 该评论模型 对应 多个 表 ，统一通过logId来区分
                if (err)
                    done(err);
                else {
                    log.commentCount = count;
                    done(null, log);
                }
            });
        }, function(err) {
            if (err) {
                console.log(err)
            } else {
            	console.log(result);
                res.json(result);  //返回的数据 里 有 logId 而不是 newsId， 注意打印看下
            }
        });
    });
}

exports.remove = function(req,res,next){  //删除一个
	var id = req.params.id;
	News.findByIdAndRemove(id,function(err,data){
		res.json({
			"message":"delete  OK"
		});
	});
}
exports.removes = function(req,res,next){  //删除多个
	
	var ids = req.body.ids;
	
	if(ids.length >0){
		News.remove({ _id: { $in: ids } })
	      .then(deletedNews => {
	        res.json({ "message": "delete ok" });
	      })
	      
	    News.remove({_id:{$in:ids} })
	    .then(res=>{
	    	res.json({"message":"delete ids ok"})
	    })
	}else{
		res.status(404)
        .send({ "message": "404" });
	}
	
}




