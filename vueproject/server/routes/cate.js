
var express = require("express");
var router = express.Router();

var dataCtrl = require("../controllers/cate.controller"); //引入控制器

router.post("/data",dataCtrl.create); // 添加，dataCtrl.create 是个函数, restful api的方式

router.get("/:type",dataCtrl.getAll); // 查询，根据type 获取该type下 所有的树形数据

router.put("/data/:id",dataCtrl.update); // 更新，根据id 更新节点

router.delete("/data/:id",dataCtrl.remove); // 删除，根据 id删除 节点 和 所有子节点

module.exports = router;

