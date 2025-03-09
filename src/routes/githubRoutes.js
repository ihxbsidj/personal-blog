const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

// 获取GitHub仓库列表
router.get('/repos', githubController.getRepositories);

// 获取特定仓库详情
router.get('/repos/:owner/:repo', githubController.getRepositoryDetails);

// 获取仓库内容
router.get('/repos/:owner/:repo/contents/:path(*)', githubController.getRepositoryContents);

// 触发GitHub Actions部署
router.post('/deploy/:owner/:repo', githubController.triggerDeployment);

// 获取部署状态
router.get('/deploy/:owner/:repo/status/:deployId', githubController.getDeploymentStatus);

module.exports = router; 