var express = require('express');
var router = express.Router();
var dataCtrl = require('../controllers/upload.controller'); // 引入控制器

router.get('/', dataCtrl.getall);       //获取所有数据
router.get('/:id', dataCtrl.getData);   // 获取指定id数据
router.post('/classify/:id', dataCtrl.getClassifyData);   // 获取指定cateId数据

router.delete('/:id', dataCtrl.remove); // 删除id数据
router.put('/data/:id', dataCtrl.update); // 修改id数据
router.post('/data', dataCtrl.create); // 执行控制器中的create方法
router.post('/removes', dataCtrl.removes); // 执行控制器中的create方法
router.post('/list', dataCtrl.list); // 执行控制器中的create方法
router.post('/filedata/:id', dataCtrl.filedata); //上传图片

module.exports = router;