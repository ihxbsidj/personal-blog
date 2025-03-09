/**
 * 主JavaScript文件
 */
document.addEventListener('DOMContentLoaded', function() {
  // 激活当前导航项
  activateCurrentNavItem();
  
  // 初始化工具提示
  initTooltips();
  
  // 初始化部署按钮
  initDeployButtons();
});

/**
 * 激活当前导航项
 */
function activateCurrentNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // 首页特殊处理
    if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    } 
    // 其他页面，检查路径是否以链接开头
    else if (href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    }
  });
}

/**
 * 初始化Bootstrap工具提示
 */
function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

/**
 * 初始化部署按钮
 */
function initDeployButtons() {
  const deployButtons = document.querySelectorAll('.trigger-deploy');
  if (!deployButtons.length) return;
  
  deployButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const owner = this.dataset.owner;
      const repo = this.dataset.repo;
      const workflowId = this.dataset.workflowId;
      
      if (!owner || !repo || !workflowId) {
        console.error('缺少必要的数据属性');
        return;
      }
      
      try {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 触发中...';
        
        const response = await fetch(`/github/deploy/${owner}/${repo}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ workflow_id: workflowId })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showAlert('success', '部署已成功触发！');
        } else {
          showAlert('danger', `触发部署失败: ${data.message}`);
        }
      } catch (error) {
        console.error('触发部署出错:', error);
        showAlert('danger', '触发部署时发生错误，请查看控制台获取详情。');
      } finally {
        button.disabled = false;
        button.innerHTML = '<i class="bi bi-play"></i> 触发部署';
      }
    });
  });
}

/**
 * 显示警告消息
 */
function showAlert(type, message) {
  // 创建警告元素
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute('role', 'alert');
  
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // 添加到页面
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alertDiv, main.firstChild);
    
    // 5秒后自动关闭
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alertDiv);
      bsAlert.close();
    }, 5000);
  }
} 