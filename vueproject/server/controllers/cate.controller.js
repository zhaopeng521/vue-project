// 控制器

const mongoose = require("mongoose");
const Cate = require("../models/cate.model");  //引入 控制器对应的数据模型

exports.create = function(req,res,next){  // 增加
	// 实例化 数据模型，参数： req.body, req.query, req.params
	const cate = new Cate(req.body);  
	
	cate.save().then(data=>{
		res.json(data);
	})
}

exports.update = function(req, res, next) {
    const cate = new Cate(req.body);
    const id = req.params.id;

    Cate.findByIdAndUpdate(id, { $set: req.body }, { new: false })
        .then((data) => {
            res.send({ data });
        })
};



// 递归操作， 获取 树形 结构 的 数据
function reverseTree(data,parentId){
	var result = [];
	var temp;
	var data = JSON.parse(JSON.stringify(data)); //格式化data数据，解析成 默认的 object格式
	for( var i in data){
		if(data[i].parentId == parentId){ 
			//如果 该数据的 parentId 和 查询的id 一样，该数据也是需求的数据
			result.push(data[i]);
			temp = reverseTree(data,data[i]._id); //无线递归下去
			if(temp.length > 0){  //递归终止条件，如果子还是不为 [],则 给该项添加 children属性
				data[i].children = temp; // 把 子项 赋值到  父项 的 children属性上
				//这样 result数组就是 树形结构了 [ {xxx,children:[{ }] },..... ]
			}
		}
	}
	return result;
}


exports.getAll = function(req,res,next){  //查询所有
	var type = req.params.type;
	Cate.find({type:type},function(err,data){
		var rpTree = reverseTree(data,null); //data就是数据，null就是根_id 对应的那条无父级的数据
		res.json(rpTree);
	});
}

exports.remove = function(req, res, next) {
    var id = req.params.id;
    var ids = [];
    Cate.findOne({ _id: id }, function(err, doc) {
        if (doc) {
            ids = [doc._id];
            doc.getChildren().then(function(docs) {
                for (var i = 0; i < docs.length; i++) {
                    ids.push(docs[i]._id);
                }

                Cate.remove({ _id: { $in: ids } })
                    .then(deleted => {
                        res.json({ "message": "delete ok" });
                    })
            });

        }

    })
};






