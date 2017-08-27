 //模型层, 表的设计 ,表名 在哪里呢？ 自动生成的？奇怪
 

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');  // 这是 分页模块
var Schema = mongoose.Schema;// 利用mongoose下的Schema(架构、模型)
var ObjectId = Schema.ObjectId; //提供的 自定义类型 ObjectId 
 
var NewsSchema = new Schema({ //在这里 对字段 进行限制
 	title: {type: String},
 	content:String,
 	desc:String,
 	commentCount:Number,
 	cateId:ObjectId,
 	cate:{},
 	date:{type:Date,default:Date.now},
 	author:String
});

 
//NewsSchema.plugin(materializedPlugin); //给mongoose添加分类插件
NewsSchema.plugin(mongoosePaginate); //给mongoose添加分类插件


module.exports = mongoose.model("news",NewsSchema); // 表的数据结构模型















