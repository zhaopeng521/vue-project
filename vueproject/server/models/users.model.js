
 //模型层, 表的设计 ,表名 在哪里呢？ 自动生成的？奇怪
 // 这里有多个 中间件  mongoose-paginate 分页模块
 // https://github.com/edwardhotchkiss/mongoose-paginate
 
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');  // 这是 分页模块
var Schema = mongoose.Schema;
 
 
var UserSchema = new Schema({ //在这里 对字段 进行限制
	name:String,
	password:String,
	gender:String,
	mail:String,
	city:String,
	time:{type:Date},
	date:{type:Date},
	interest:[],
	desc:String
});
 
 
UserSchema.plugin(mongoosePaginate); //给mongoose添加分类插件
 


module.exports = mongoose.model("User",UserSchema); // 表的数据结构模型






















