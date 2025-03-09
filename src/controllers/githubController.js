const { Octokit } = require('octokit');
const axios = require('axios');

// 创建Octokit实例
const getOctokit = () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub Token未配置，请在.env文件中设置GITHUB_TOKEN');
  }
  return new Octokit({ auth: token });
};

// 获取用户仓库列表
exports.getRepositories = async (req, res) => {
  try {
    const octokit = getOctokit();
    const username = process.env.GITHUB_USERNAME || req.query.username;
    
    if (!username) {
      return res.render('github/repos', { 
        title: 'GitHub仓库',
        error: '请提供GitHub用户名',
        repos: []
      });
    }
    
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 100
    });
    
    res.render('github/repos', { 
      title: 'GitHub仓库',
      repos,
      username
    });
  } catch (error) {
    console.error('获取GitHub仓库失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '获取GitHub仓库失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// 获取仓库详情
exports.getRepositoryDetails = async (req, res) => {
  try {
    const octokit = getOctokit();
    const { owner, repo } = req.params;
    
    // 获取仓库信息
    const { data: repository } = await octokit.rest.repos.get({
      owner,
      repo
    });
    
    // 获取最近的提交
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 10
    });
    
    // 获取工作流程
    let workflows = [];
    try {
      const { data: workflowsData } = await octokit.rest.actions.listRepoWorkflows({
        owner,
        repo
      });
      workflows = workflowsData.workflows;
    } catch (error) {
      console.warn('获取工作流程失败:', error);
    }
    
    res.render('github/repo-details', { 
      title: `${repository.name} - 仓库详情`,
      repository,
      commits,
      workflows
    });
  } catch (error) {
    console.error('获取仓库详情失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '获取仓库详情失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// 获取仓库内容
exports.getRepositoryContents = async (req, res) => {
  try {
    const octokit = getOctokit();
    const { owner, repo, path } = req.params;
    
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path || ''
    });
    
    // 如果是目录，显示目录内容
    if (Array.isArray(contents)) {
      return res.render('github/repo-contents', { 
        title: `${repo}/${path || ''} - 目录内容`,
        contents,
        owner,
        repo,
        path: path || '',
        parentPath: path ? path.split('/').slice(0, -1).join('/') : null
      });
    }
    
    // 如果是文件，显示文件内容
    const fileContent = Buffer.from(contents.content, 'base64').toString('utf-8');
    res.render('github/file-content', { 
      title: `${repo}/${path} - 文件内容`,
      file: contents,
      content: fileContent,
      owner,
      repo,
      path,
      parentPath: path.split('/').slice(0, -1).join('/')
    });
  } catch (error) {
    console.error('获取仓库内容失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '获取仓库内容失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// 触发GitHub Actions部署
exports.triggerDeployment = async (req, res) => {
  try {
    const octokit = getOctokit();
    const { owner, repo } = req.params;
    const { workflow_id, ref = 'main' } = req.body;
    
    if (!workflow_id) {
      return res.status(400).json({ 
        success: false, 
        message: '请提供工作流ID' 
      });
    }
    
    // 触发工作流程
    const { data: workflowRun } = await octokit.rest.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id,
      ref
    });
    
    res.json({ 
      success: true, 
      message: '部署已触发',
      data: workflowRun
    });
  } catch (error) {
    console.error('触发部署失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '触发部署失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器错误'
    });
  }
};

// 获取部署状态
exports.getDeploymentStatus = async (req, res) => {
  try {
    const octokit = getOctokit();
    const { owner, repo, deployId } = req.params;
    
    // 获取工作流运行状态
    const { data: workflowRun } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: deployId
    });
    
    // 获取工作流作业
    const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: deployId
    });
    
    res.json({ 
      success: true, 
      data: {
        status: workflowRun.status,
        conclusion: workflowRun.conclusion,
        jobs: jobs.jobs
      }
    });
  } catch (error) {
    console.error('获取部署状态失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取部署状态失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器错误'
    });
  }
}; 