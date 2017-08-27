 //模型层, 表的设计 ,表名 在哪里呢？ 自动生成的？奇怪
 
 // mongodb 是无架构的，非关系型，没有 字段 和 类型的限制   这里需要插件的帮助，才能限制
 
// 引入 mongoose     默认无架构的（非关系形，没有字段、字段类型的限制）
// 引入 materialized 管理分类的 中间件模块
// mongoose.Schema  就是 mongodb的 自定义架构（限制字段、字段类型的） => 变成类似的关系型数据库
//    如：  字段名: String/Number     或者
//        字段名: {type:String/Number}

var mongoose = require('mongoose'),
    materializedPlugin = require('mongoose-materialized'),
    Schema = mongoose.Schema;
 
 
var CateSchema = new Schema({ //在这里 对字段 进行限制
	type:Number, 
 	title: {type: String}
});
 
 
CateSchema.plugin(materializedPlugin); //给mongoose添加分类插件
 


module.exports = mongoose.model("Cate",CateSchema); // 表的数据结构模型















