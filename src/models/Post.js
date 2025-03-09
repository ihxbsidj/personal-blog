const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请提供文章标题'],
    trim: true,
    maxlength: [200, '标题不能超过200个字符']
  },
  content: {
    type: String,
    required: [true, '请提供文章内容'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    default: '博客管理员'
  }
});

// 如果MongoDB未连接，则不创建模型
let Post;
try {
  Post = mongoose.model('Post');
} catch (error) {
  Post = mongoose.model('Post', PostSchema);
}

module.exports = Post; 