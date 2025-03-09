const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// 博客列表页
router.get('/blog', blogController.getAllPosts);

// 博客详情页
router.get('/blog/:id', blogController.getPostById);

// 创建博客页面
router.get('/blog/new', blogController.getNewPostForm);

// 创建博客提交
router.post('/blog', blogController.createPost);

// 编辑博客页面
router.get('/blog/:id/edit', blogController.getEditPostForm);

// 更新博客
router.post('/blog/:id', blogController.updatePost);

// 删除博客
router.post('/blog/:id/delete', blogController.deletePost);

module.exports = router; 