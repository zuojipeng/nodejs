var express = require('express');
var router = express.Router();

// 引入后台admin控制器
var adminController=require('../controllers/adminController.js');
console.log(adminController);

/* 管理员后台首页 */
router.get('/',adminController.Index)


// 栏目管理
router.get('/itemAdd',adminController.ItemAdd)

// 添加栏目插入到数据库
router.post('/itemInsert',adminController.ItemInsert)

// 展示栏目列表
router.get('/itemList',adminController.ItemList)

// 编辑栏目
router.get('/itemEdit/:_id',adminController.ItemEdit)

// 修改栏目提交
router.post('/itemUpdate',adminController.itemUpdate)

// 删除栏目
router.get('/itemDel/:_id',adminController.itemDel)

// 发布文章
router.get('/articleAdd',adminController.ArticleAdd)

// 插入文章信息
router.post('/articleInsert',adminController.ArticleInsert)

// 文章列表
router.get('/articleList',adminController.ArticleList)

//文章编辑修改
router.get('/articleEdit/:_id',adminController.ArticleEdit)

// 修改文章
router.post('/articleUpdate',adminController.ArticleUpdate);
// 修改文章封面
router.post('/articleUpdateImage',adminController.ArticleUpdateImage);

// 删除文章
router.get('/articleRemove/:_id',adminController.ArticleRemove)

// 链接管理
router.get('/lianjieAdd',adminController.LianjieAdd)

// 链接添加页面
router.post('/lianjieInsert',adminController.LianjieInsert)

// 链接列表
router.get('/lianjieList',adminController.LianjieList)


// 添加管理员
router.get('/adminAdd',adminController.AdminAdd)

// 插入管理员数据
router.post('/adminInsert',adminController.AdminInsert)

// 验证码
router.get('/code',adminController.Code)

// 登录的操作
router.post('/doLogin',adminController.DoLogin)

//登录页面
router.get('/login',adminController.Login)

// 退出登录
router.get('/logout',adminController.Logout)
module.exports = router;