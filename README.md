# 个人博客系统

这是一个基于Node.js的个人博客系统，支持GitHub集成和Azure自动部署。

## 功能特点

- 博客文章的创建、编辑和删除
- GitHub仓库集成，浏览您的GitHub仓库
- 通过GitHub Actions自动部署到Azure Web App
- 响应式设计，适配各种设备
- 可选的MongoDB数据库支持

## 技术栈

- **后端**: Node.js, Express.js
- **前端**: EJS, Bootstrap 5, JavaScript
- **数据库**: MongoDB (可选)
- **API集成**: GitHub API
- **部署**: GitHub Actions, Azure Web App

## 快速开始

### 前提条件

- Node.js (v14+)
- npm 或 yarn
- MongoDB (可选)
- GitHub账号
- Azure账号和Web App服务

### 安装步骤

1. 克隆仓库
   ```
   git clone https://github.com/yourusername/personal-blog.git
   cd personal-blog
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 配置环境变量
   ```
   cp .env.example .env
   ```
   然后编辑`.env`文件，填入您的配置信息。

4. 启动应用
   ```
   npm run dev
   ```

5. 访问应用
   在浏览器中打开 `http://localhost:3000`

## 部署到Azure

### 配置GitHub Actions

1. 在Azure门户中创建Web App服务

2. 获取Azure发布配置文件
   - 在Azure门户中，导航到您的Web App
   - 点击"获取发布配置文件"并下载文件

3. 在GitHub仓库中添加Secrets
   - AZURE_WEBAPP_NAME: 您的Azure Web App名称
   - AZURE_WEBAPP_PUBLISH_PROFILE: 发布配置文件的内容

4. 推送代码到main分支或手动触发工作流
   - GitHub Actions将自动构建并部署应用到Azure

## 项目结构

```
personal-blog/
├── .github/                # GitHub Actions工作流配置
├── src/
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── public/             # 静态资源
│   ├── routes/             # 路由
│   └── views/              # 视图模板
├── .env.example            # 环境变量示例
├── app.js                  # 应用入口
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 许可证

[MIT](LICENSE)

## 联系方式

如有任何问题或建议，请通过GitHub Issues联系我。 