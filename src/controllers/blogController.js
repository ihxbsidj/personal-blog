const Post = require('../models/Post');

// 获取所有博客文章
exports.getAllPosts = async (req, res) => {
  try {
    // 如果MongoDB已配置，从数据库获取文章
    if (process.env.MONGODB_URI) {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.render('blog/index', { title: '博客文章列表', posts });
    } 
    
    // 否则使用示例数据
    const samplePosts = [
      {
        _id: '1',
        title: '示例文章1',
        content: '这是一篇示例文章的内容...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        title: '示例文章2',
        content: '这是另一篇示例文章的内容...',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    res.render('blog/index', { title: '博客文章列表', posts: samplePosts });
  } catch (error) {
    console.error('获取博客文章失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '获取博客文章失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// 获取单篇博客文章
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 如果MongoDB已配置，从数据库获取文章
    if (process.env.MONGODB_URI) {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).render('error', { 
          title: '未找到',
          message: '未找到该博客文章',
          error: {}
        });
      }
      return res.render('blog/show', { title: post.title, post });
    }
    
    // 否则使用示例数据
    if (id === '1' || id === '2') {
      const samplePost = {
        _id: id,
        title: `示例文章${id}`,
        content: `这是示例文章${id}的详细内容...`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return res.render('blog/show', { title: samplePost.title, post: samplePost });
    }
    
    res.status(404).render('error', { 
      title: '未找到',
      message: '未找到该博客文章',
      error: {}
    });
  } catch (error) {
    console.error('获取博客文章详情失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '获取博客文章详情失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// 获取创建博客表单
exports.getNewPostForm = (req, res) => {
  res.render('blog/new', { title: '创建新博客' });
};

// 创建新博客
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // 验证输入
    if (!title || !content) {
      return res.render('blog/new', { 
        title: '创建新博客',
        error: '标题和内容不能为空',
        post: { title, content }
      });
    }
    
    // 如果MongoDB已配置，保存到数据库
    if (process.env.MONGODB_URI) {
      const newPost = new Post({ title, content });
      await newPost.save();
      return res.redirect(`/blog/${newPost._id}`);
    }
    
    // 否则显示成功消息
    res.render('success', { 
      title: '创建成功',
      message: '博客文章创建成功（示例模式）',
      redirectUrl: '/blog',
      redirectText: '返回博客列表'
    });
  } catch (error) {
    console.error('创建博客文章失败:', error);
    res.render('blog/new', { 
      title: '创建新博客',
      error: '创建博客文章失败',
      post: req.body
    });
  }
};

// 获取编辑博客表单
exports.getEditPostForm = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 如果MongoDB已配置，从数据库获取文章
    if (process.env.MONGODB_URI) {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).render('error', { 
          title: '未找到',
          message: '未找到该博客文章',
          error: {}
        });
      }
      return res.render('blog/edit', { title: `编辑: ${post.title}`, post });
    }
    
    // 否则使用示例数据
    if (id === '1' || id === '2') {
      const samplePost = {
        _id: id,
        title: `示例文章${id}`,
        content: `这是示例文章${id}的详细内容...`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return res.render('blog/edit', { title: `编辑: ${samplePost.title}`, post: samplePost });
    }
    
    res.status(404).render('error', { 
      title: '未找到',
      message: '未找到该博客文章',
      error: {}
    });
  } catch (error) {
    console.error('获取编辑表单失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '获取编辑表单失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// 更新博客
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // 验证输入
    if (!title || !content) {
      return res.render('blog/edit', { 
        title: '编辑博客',
        error: '标题和内容不能为空',
        post: { _id: id, title, content }
      });
    }
    
    // 如果MongoDB已配置，更新数据库
    if (process.env.MONGODB_URI) {
      const post = await Post.findByIdAndUpdate(
        id, 
        { title, content, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      if (!post) {
        return res.status(404).render('error', { 
          title: '未找到',
          message: '未找到该博客文章',
          error: {}
        });
      }
      
      return res.redirect(`/blog/${post._id}`);
    }
    
    // 否则显示成功消息
    res.render('success', { 
      title: '更新成功',
      message: '博客文章更新成功（示例模式）',
      redirectUrl: `/blog/${id}`,
      redirectText: '查看文章'
    });
  } catch (error) {
    console.error('更新博客文章失败:', error);
    res.render('blog/edit', { 
      title: '编辑博客',
      error: '更新博客文章失败',
      post: { _id: req.params.id, ...req.body }
    });
  }
};

// 删除博客
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 如果MongoDB已配置，从数据库删除
    if (process.env.MONGODB_URI) {
      const post = await Post.findByIdAndDelete(id);
      
      if (!post) {
        return res.status(404).render('error', { 
          title: '未找到',
          message: '未找到该博客文章',
          error: {}
        });
      }
    }
    
    // 重定向到博客列表
    res.redirect('/blog');
  } catch (error) {
    console.error('删除博客文章失败:', error);
    res.status(500).render('error', { 
      title: '错误',
      message: '删除博客文章失败',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}; 