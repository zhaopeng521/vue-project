// 控制器 user

const mongoose = require("mongoose");
const User = require("../models/users.model");  //引入 控制器对应的数据模型

exports.create = function(req,res,next){  // 增加post
	// 实例化 数据模型，参数： req.body, req.query, req.params
	const user = new User(req.body);  
	console.log("-------添加------");
	console.log(req.body);
	user.save().then(data=>{
		res.json(data);
	})
}

exports.update = function(req,res,next){  // 更新
	// 实例化 数据模型，参数： req.body, req.query, req.params
	const user = new User(req.body);  
	const id = req.params.id; //通过id 更新 数据
//	console.log("更新----------------------");
//	console.log(id);
//	console.log(req.body);
	//固定方法findByIdAndUpdate(id,{新内容},{new:true/false})
	// 根据id 更新 内容， new：返回 是否为新数据，false是旧数据， true 是新数据,默认false
	User.findByIdAndUpdate(id,{$set:req.body},{new:false}).then((user)=>{
		console.log("--------更新了---------");
		res.send(user);
		
	})
}

exports.list = function(req,res,next){// 查询
	//获取 页码 和 限制 
	var page = (req.body.page)?req.body.page:1;
	var limit = (req.body.limit)?req.body.limit:5;
	var querySelection = {};
	
	if(req.body.name && req.body.name.trim().length >0){
		// 如果查询的内容存在 且不为空 ，则开始查找
		name = req.body.name; //查找的内容
		//以正则的方式 进行  i全局查找 , 注意 是个对象模式 {xx:xxx}
		querySelection={ //这个是匹配那个 字段？ 还是 匹配 所有字段的呢？
			"name":new RegExp(name,"i")
		}
	}
	
	// 表模型.paginate({查询内容},{页码和限制},fn结果)
	// 查询内容为{} 则 是 查询所有
	console.log(User.paginate);
	User.paginate(querySelection,{page:page,limit:limit},(err,result)=>{
		
		res.json(result);
		
	})
	
}
exports.login = function(req,res,next){// 登录
	//获取 页码 和 限制 

	var querySelection = {};
	
	if(req.body.name && req.body.name.trim().length >0 &&
		req.body.password && req.body.password.trim().length >0
	){
		// 如果查询的内容存在 且不为空 ，则开始查找
		name = req.body.name; //查找的内容
		password = req.body.password;
		//以正则的方式 进行  i全局查找 , 注意 是个对象模式 {xx:xxx}
		querySelection={ //这个是匹配那个 字段？ 还是 匹配 所有字段的呢？
			"name":new RegExp(name,"i"),
			"password":new RegExp(password,"i")
		}
	}
	
	// 表模型.paginate({查询内容},{页码和限制},fn结果)
	// 查询内容为{} 则 是 查询所有
	console.log("--------------登录----------");
	console.log(User.querySelection);
	User.find(querySelection,(err,result)=>{
		console.log(result);
		res.json(result);
		
	})
	
}
exports.remove = function(req,res,next){  //删除一个
	var id = req.params.id;
	console.log("删除一个------------");
	console.log(id);
	User.findByIdAndRemove(id,function(err,data){
		res.json({
			"message":"delete  OK"
		});
	});
}
exports.removes = function(req,res,next){  //删除多个
	
	var ids = req.body.ids;
	
	if(ids.length >0){
		User.remove({ _id: { $in: ids } })
	      .then(deletedUsers => {
	        res.json({ "message": "delete ok" });
	      })
	      
	    User.remove({_id:{$in:ids} })
	    .then(res=>{
	    	res.json({"message":"delete ids ok"})
	    })
	}else{
		res.status(404)
        .send({ "message": "404" });
	}
	
}




