const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const blogRoutes = require('./src/routes/blogRoutes');
const githubRoutes = require('./src/routes/githubRoutes');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 设置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.set('layout', 'layout');
app.use(expressLayouts);

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// 路由
app.use('/', blogRoutes);
app.use('/github', githubRoutes);

// 首页路由
app.get('/', (req, res) => {
  res.render('index', { title: '我的个人博客' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: '错误',
    message: '服务器发生错误',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 连接数据库
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB 连接成功');
    } else {
      console.log('未配置MongoDB连接，跳过数据库连接');
    }
  } catch (error) {
    console.error('MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

// 启动服务器
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    // 尝试连接数据库
    await connectDB();
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error.message);
    process.exit(1);
  }
};

startServer(); 