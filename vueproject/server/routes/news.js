var express = require("express");
var router = express.Router();

var dataCtrl = require("../controllers/news.controller"); //引入控制器

router.post("/data",dataCtrl.create); // 添加，dataCtrl.create 是个函数, restful api的方式

router.post("/list",dataCtrl.list); // 查询，

router.post("/data/removes",dataCtrl.removes); // 删除多个，根据ids

router.delete("/data/:id",dataCtrl.remove); // 删除一个,根据id

router.put("/data/:id",dataCtrl.update); // 修改，根据id

module.exports = router;
