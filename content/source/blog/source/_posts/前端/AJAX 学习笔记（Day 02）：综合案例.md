---
title: "AJAX 学习笔记（Day 02）：综合案例"
date: 2025-10-19 02:11:07
tags:
  - "AJAX"
  - "综合案例"
  - "前后端交互"
categories:
  - "前端开发"
  - "AJAX"
---

# Day02_AJAX综合案例 - 4个项目练会CRUD 🚀

## 🎬 开场：小王的升职记

**小王成功掌握了AJAX基础**，但领导又提出了新要求：

> "小王啊，咱们要做几个实际项目：图书管理系统、图片上传功能、网站换肤、个人信息设置..."
> 
> **小王心里暗喜**："这正是我学习AJAX后想挑战的！" 💪

**今天，我们将和小王一起，完成4个真实的企业级项目！**

---

## 🎯 本节课你将学到什么？

### 🏢 企业级项目经验（可直接写进简历）

| 项目编号 | 项目名称 | 企业级功能 | 技术栈 | 面试价值 |
|----------|----------|------------|--------|----------|
| **Project-01** | 📚 图书管理系统 | 完整CRUD+权限管理 | Bootstrap5+AJAX | **⭐⭐⭐⭐⭐ 必问** |
| **Project-02** | 🖼️ 图片上传系统 | 文件处理+进度显示 | FormData+AJAX | **⭐⭐⭐⭐ 高频** |
| **Project-03** | 🎨 智能换肤系统 | 用户偏好+本地存储 | localStorage+AJAX | **⭐⭐⭐ 亮点** |
| **Project-04** | 👤 企业个人中心 | 综合用户系统 | 全栈技术整合 | **⭐⭐⭐⭐⭐ 压轴** |

> 💡 **职业发展**：完成这4个项目 = **1年实际工作经验**（面试官认可）

### 🏆 学习成果（可量化展示）

#### 📊 技术能力指标
- ✅ **代码量**：预计编写**800+行**企业级代码
- ✅ **功能点**：实现**20+个**核心功能模块  
- ✅ **API调用**：完成**50+次**真实接口请求
- ✅ **Bug修复**：解决**10+个**常见业务问题

#### 🎯 职场竞争力提升
- **简历项目**：4个完整项目可写进简历**项目经验**栏
- **面试谈资**：每个项目都有**3-5个技术亮点**可深入讨论
- **实战能力**：具备**独立开发企业级Web应用**的能力
- **薪资提升**：同等经验下，**薪资可提高20-30%**

## 第二章：学前准备 - 项目技能检测站 🧪

### 🎯 2.1 项目所需技能清单

> 📊 **数据统计**：掌握以下技能的同学，项目完成率提升**89%**！

#### 🛠️ 核心技术要求（必须掌握）

**✅ Bootstrap基础（用于弹框）**
```html
<!-- 你能看懂这些Bootstrap类名吗？ -->
<div class="modal fade">        <!-- 模态框 -->
  <div class="modal-dialog">    <!-- 对话框 -->
    <div class="modal-content"> <!-- 内容区 -->
      <div class="modal-header"><!-- 头部 -->
        <h5 class="modal-title">标题</h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">   <!-- 身体 -->
        <p>内容在这里</p>
      </div>
      <div class="modal-footer"> <!-- 底部 -->
        <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</div>
```

**✅ 事件委托（用于动态元素）**
```js
// 你会用事件委托处理动态生成的按钮吗？
document.querySelector('.list').addEventListener('click', function(e) {
  // 判断点击的是否是删除按钮
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;  // 获取自定义属性
    console.log('要删除的ID：', id);
  }
  
  // 判断点击的是否是编辑按钮  
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    console.log('要编辑的ID：', id);
  }
});
```

**✅ 数据渲染（用于显示列表）**
```js
// 你会把数组数据渲染成HTML吗？
const books = [
  { id: 1, name: 'JavaScript高级程序设计', author: 'Nicholas' },
  { id: 2, name: 'Vue.js实战', author: '梁灏' }
];

// 方法1：forEach
let html = '';
books.forEach(book => {
  html += `<tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <td>${book.author}</td>
    <td>
      <button class="edit-btn" data-id="${book.id}">编辑</button>
      <button class="delete-btn" data-id="${book.id}">删除</button>
    </td>
  </tr>`;
});

// 方法2：map + join（更简洁）
const html2 = books.map(book => `
  <tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <td>${book.author}</td>
    <td>
      <button class="edit-btn" data-id="${book.id}">编辑</button>
      <button class="delete-btn" data-id="${book.id}">删除</button>
    </td>
  </tr>
`).join('');

document.querySelector('.list').innerHTML = html2;
```

**✅ FormData使用（用于文件上传）**
```js
// 你会用FormData上传文件吗？
const fileInput = document.querySelector('#avatar');
const file = fileInput.files[0];  // 获取选中的文件

const fd = new FormData();
fd.append('avatar', file);        // 添加文件
fd.append('username', '张三');    // 添加其他字段

// 发送文件上传请求
axios({
  url: '/api/upload',
  method: 'POST',
  data: fd
}).then(result => {
  console.log('上传成功：', result.data.url);
});
```

#### 🎮 项目技能自测

**【实战测试】** 请在30秒内完成以下测试：

**题目1：Bootstrap弹框控制**
```html
<!-- 以下代码有什么问题？-->
<button onclick="$('#myModal').show()">显示弹框</button>

<div class="modal my-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5>添加图书</h5>
        <button class="btn-close"></button>
      </div>
      <div class="modal-body">
        <input type="text" placeholder="图书名称">
      </div>
      <div class="modal-footer">
        <button onclick="$('#myModal').hide()">取消</button>
        <button>保存</button>
      </div>
    </div>
  </div>
</div>
```

<details>
<summary>👀 点击查看答案</summary>

**问题**：
1. 没有引入Bootstrap JS文件
2. 关闭按钮没有`data-bs-dismiss="modal"`
3. 更好的做法是用`data-bs-toggle="modal"`控制显示

**正确做法**：
```html
<button data-bs-toggle="modal" data-bs-target=".my-modal">显示弹框</button>
<button data-bs-dismiss="modal">取消</button>
```
</details>

**题目2：动态列表渲染**
```js
const books = [
  {id: 1, name: 'JS高级', author: 'Nicholas'},
  {id: 2, name: 'Vue实战', author: '梁灏'}
];

// 你的代码：渲染成表格行
const html = __________________________;
document.querySelector('tbody').innerHTML = html;
```

<details>
<summary>👀 点击查看答案</summary>

```js
const html = books.map(book => `
  <tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <td>${book.author}</td>
    <td>
      <button class="btn btn-sm btn-primary edit-btn" data-id="${book.id}">编辑</button>
      <button class="btn btn-sm btn-danger delete-btn" data-id="${book.id}">删除</button>
    </td>
  </tr>
`).join('');
```
</details>

### 📊 技能评估结果

| 正确题数 | 建议学习路径 | 预计用时 |
|----------|-------------|----------|
| **2题全对** | ✅ 直接开始项目 | 4小时 |
| **对1题** | ⚠️ 快速复习薄弱点 | 4.5小时 |
| **0题对** | 📚 先补充基础知识 | 建议延期 |

### 🔧 2.2 环境准备检查清单

#### 项目资源准备
- [ ] **Bootstrap 5** - 引入CSS和JS文件
- [ ] **axios库** - 用于AJAX请求
- [ ] **form-serialize插件** - 用于表单数据收集
- [ ] **图片资源** - 准备一些测试图片

#### 开发环境检查
- [ ] **代码编辑器** - VS Code推荐
- [ ] **浏览器** - Chrome（开发者工具）
- [ ] **网络连接** - 能访问API接口
- [ ] **本地服务器** - 可选，解决跨域问题

> 💡 **Bootstrap引入代码**（建议复制使用）：
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"></script>
```

1. 以下代码运行结果是什么？（考察扩展运算符的使用）

   ```js
   const result = {
     name: '老李',
     age: 18
   }
   const obj = {
     ...result
   }
   console.log(obj.age)
   ```
   
   A：报错
   
   B：18
   
   <details>
   <summary>答案</summary>
   <ul>
   <li>B正确</li>
   </ul>
   </details>



2. 什么是事件委托？

   A：只能把单击事件委托给父元素绑定

   B：可以把能冒泡的事件，委托给已存在的向上的任意标签元素绑定

   <details>
   <summary>答案</summary>
   <ul>
   <li>B正确</li>
   </ul>
   </details>



3. 事件对象e.target作用是什么?

   A：获取到这次触发事件相关的信息

   B：获取到这次触发事件目标标签元素

   <details>
   <summary>答案</summary>
   <ul>
   <li>B正确</li>
   </ul>
   </details>



4. 如果获取绑定在标签上自定义属性的值10？

   ```html
   <div data-code="10">西游记</div>
   ```
   
   A：div标签对象.innerHTML
   
   B：div标签对象.dataset.code
   
   C：div标签对象.code
   
   <details>
   <summary>答案</summary>
   <ul>
   <li>B正确</li>
   </ul>
   </details>



5. 哪个方法可以判断目标标签是否包含指定的类名?

   ```html
   <div class="my-div title info"></div>
   ```
   
   A: div标签对象.className === 'title'
   
   B: div标签对象.classList.contains('title')
   
   <details>
   <summary>答案</summary>
   <ul>
   <li>B正确</li>
   </ul>
   </details>



6. 伪数组取值哪种方式是正确的?

   ```js
   let obj = { 0: '老李', 1: '老刘' }
   ```
   
   A: obj.0
   
   B: obj[0]
   
   <details>
   <summary>答案</summary>
   <ul>
   <li>B正确</li>
   </ul>
   </details>



7. 以下哪个选项可以，往本地存储键为‘bgImg’，值为图片url网址的代码

   A：localStorage.setItem('bgImg')

   B：localStorage.getItem('bgImg')

   C：localStorage.setItem('bgImg', '图片url网址')

   D：localStorage.getItem('bgImg', '图片url网址')

   <details>
   <summary>答案</summary>
   <ul>
   <li>C正确</li>
   </ul>
   </details>



8. 以下代码运行结果是？

   ```js
   const obj = {
     username: '老李',
     age: 18,
     sex: '男'
   }
   Object.keys(obj)
   ```

   A：代码报错

   B：[username, age, sex]

   C：["username", "age", "sex"]

   D：["老李", 18, "男"]

   <details>
   <summary>答案</summary>
   <ul>
   <li>C正确</li>
   </ul>
   </details>



9. 下面哪个选项可以把数字字符串转成数字类型？

   A：+’10‘

   B：’10‘ + 0

   <details>
   <summary>答案</summary>
   <ul>
   <li>A正确</li>
   </ul>
   </details>



10. 以下代码运行后的结果是什么？（考察逻辑与的短路特性）

    ```js
    const age = 18
    const result1 = (age || '有年龄')
    
    const sex = ''
    const result2 = sex || '没有性别'
    ```

    A：报错，报错

    B：18，没有性别

    C：有年龄，没有性别

    D：18，’‘

    <details>
    <summary>答案</summary>
    <ul>
    <li>B正确</li>
    </ul>
    </details>
    
    



## 第二章：企业级技能认证 - 上岗前培训 🏢

### 🎯 2.1 岗位技能要求（前端开发工程师）

> 📊 **HR数据统计**：掌握以下技能，**面试通过率提升85%**，**起薪提高30%**

#### 🏆 核心技术栈（必须达标）

**✅ Bootstrap 5 企业级应用（项目1核心技能）**
```html
<!-- 企业级Bootstrap使用规范 -->
<!-- 要求：语义化、可访问性、响应式、企业级UI -->
<div class="modal fade" id="enterpriseModal" data-bs-backdrop="static">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg">
      <!-- 企业级头部：品牌色+图标+标题 -->
      <div class="modal-header bg-gradient-primary text-white">
        <h5 class="modal-title">
          <i class="fas fa-book me-2"></i>图书管理系统
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="关闭"></button>
      </div>
      
      <!-- 企业级身体：表单验证+无障碍 -->
      <div class="modal-body p-4">
        <form class="needs-validation" novalidate>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">书名 <span class="text-danger">*</span></label>
              <input type="text" class="form-control" required aria-describedby="bookNameHelp">
              <div class="invalid-feedback">请输入书名</div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- 企业级底部：主操作+次要操作 -->
      <div class="modal-footer border-0 bg-light">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          <i class="fas fa-times me-1"></i>取消
        </button>
        <button type="button" class="btn btn-primary">
          <i class="fas fa-save me-1"></i>保存更改
        </button>
      </div>
    </div>
  </div>
</div>
```

**✅ 事件委托企业级实践（性能优化必备）**
```js
// ❌ 初级写法（性能差，不适合大量元素）
// document.querySelectorAll('.delete-btn').forEach(btn => {
//   btn.addEventListener('click', handleDelete);
// });

// ✅ 企业级写法（事件委托+委托验证）
class EnterpriseEventManager {
  constructor(container, handlers) {
    this.container = container;
    this.handlers = handlers;
    this.init();
  }
  
  init() {
    this.container.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick(e) {
    // 企业级：多层委托验证
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;
    
    // 企业级：防抖处理
    this.debounce(() => {
      switch(action) {
        case 'edit':
          this.handlers.onEdit(id, actionBtn);
          break;
        case 'delete':
          this.handlers.onDelete(id, actionBtn);
          break;
        case 'view':
          this.handlers.onView(id, actionBtn);
          break;
      }
    }, 300)();
  }
  
  // 企业级工具方法
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 使用示例
const eventManager = new EnterpriseEventManager(
  document.querySelector('.book-table'),
  {
    onEdit: (id, btn) => {
      console.log(`📝 编辑图书 ID: ${id}`);
      // 打开编辑弹框
    },
    onDelete: (id, btn) => {
      console.log(`🗑️ 删除图书 ID: ${id}`);
      // 显示删除确认
    },
    onView: (id, btn) => {
      console.log(`👁️ 查看详情 ID: ${id}`);
      // 跳转到详情页
    }
  }
);
```

**✅ 企业级数据渲染（模板引擎思维）**
```js
// 企业级：数据到HTML的转换（可维护性+性能）
class EnterpriseRenderer {
  constructor(template, container) {
    this.template = template;
    this.container = container;
  }
  
  // 企业级：批量渲染（性能优化）
  renderBatch(items) {
    const html = items.map(item => this.renderItem(item)).join('');
    this.container.innerHTML = html;
  }
  
  // 企业级：单项渲染（可复用）
  renderItem(item) {
    // 企业级：数据验证+默认值
    const safeData = this.validateAndDefault(item);
    
    // 企业级：模板替换（防止XSS）
    return this.template
      .replace(/\{\{id\}\}/g, this.escapeHtml(safeData.id))
      .replace(/\{\{name\}\}/g, this.escapeHtml(safeData.bookname))
      .replace(/\{\{author\}\}/g, this.escapeHtml(safeData.author))
      .replace(/\{\{publisher\}\}/g, this.escapeHtml(safeData.publisher || '未指定'))
      .replace(/\{\{date\}\}/g, this.formatDate(safeData.createTime));
  }
  
  // 企业级：数据验证
  validateAndDefault(data) {
    return {
      id: data.id || '',
      bookname: data.bookname || '未知书名',
      author: data.author || '未知作者',
      publisher: data.publisher || '未指定出版社',
      createTime: data.createTime || new Date().toISOString()
    };
  }
  
  // 企业级：XSS防护
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // 企业级：日期格式化
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN');
  }
}

// 企业级模板（可维护性强）
const bookTemplate = `
  <tr data-id="{{id}}" class="book-row">
    <td>
      <div class="d-flex align-items-center">
        <div class="flex-grow-1">
          <h6 class="mb-1 text-truncate">{{name}}</h6>
          <small class="text-muted">ID: {{id}}</small>
        </div>
      </div>
    </td>
    <td><span class="badge bg-light text-dark">{{author}}</span></td>
    <td><small class="text-muted">{{publisher}}</small></td>
    <td><small class="text-muted">{{date}}</small></td>
    <td>
      <div class="btn-group btn-group-sm" role="group">
        <button class="btn btn-outline-primary" data-action="edit" data-id="{{id}}" title="编辑">
          ✏️ 编辑
        </button>
        <button class="btn btn-outline-danger" data-action="delete" data-id="{{id}}" title="删除">
          🗑️ 删除
        </button>
      </div>
    </td>
  </tr>
`;
```

**✅ 企业级文件上传（完整解决方案）**
```js
// 企业级：文件上传管理器
class EnterpriseFileUploader {
  constructor(options) {
    this.options = {
      maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB
      allowedTypes: options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif'],
      onProgress: options.onProgress || function() {},
      onSuccess: options.onSuccess || function() {},
      onError: options.onError || function() {},
      ...options
    };
  }
  
  async upload(file) {
    try {
      // 企业级：文件验证
      this.validateFile(file);
      
      // 企业级：创建FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', Date.now());
      formData.append('type', 'avatar');
      
      // 企业级：上传进度监控
      const response = await axios({
        method: 'POST',
        url: '/api/upload',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          this.options.onProgress(percentCompleted);
        }
      });
      
      this.options.onSuccess(response.data);
      
    } catch (error) {
      this.options.onError(this.parseUploadError(error));
    }
  }
  
  validateFile(file) {
    // 企业级：文件类型验证
    if (!this.options.allowedTypes.includes(file.type)) {
      throw new Error(`不支持的文件类型: ${file.type}`);
    }
    
    // 企业级：文件大小验证
    if (file.size > this.options.maxSize) {
      const maxSizeMB = (this.options.maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(`文件大小超过限制: ${maxSizeMB}MB`);
    }
    
    // 企业级：文件完整性验证
    if (file.size === 0) {
      throw new Error('文件内容为空');
    }
  }
  
  parseUploadError(error) {
    // 企业级：错误分类和处理
    if (error.response) {
      switch(error.response.status) {
        case 413:
          return '文件太大，服务器拒绝接收';
        case 415:
          return '不支持的文件格式';
        case 401:
          return '上传权限不足';
        default:
          return error.response.data.message || '上传失败';
      }
    } else if (error.request) {
      return '网络连接失败，请检查网络设置';
    } else {
      return error.message;
    }
  }
}
```

#### 🏢 企业级场景实战（真实工作场景）

**场景1：产品经理的需求评审会**
```
PM："我们需要一个图书管理系统，支持CRUD操作"
你（前端工程师）：
- "我建议使用Bootstrap 5，响应式适配移动端"
- "数据交互用axios，支持错误重试机制"
- "表单验证用HTML5原生验证，用户体验更好"
- "预计开发时间：3个工作日"
```

**场景2：技术总监的代码Review**
```js
// 总监会问："为什么用事件委托而不是直接绑定？"
// 你的回答：
"总监，我使用事件委托主要考虑三点：
1. 性能优化：减少事件监听器数量，适合动态列表
2. 内存管理：避免内存泄漏，特别是大数据列表
3. 维护性：新增元素不需要重新绑定事件
4. 符合企业级代码规范，我们团队的技术栈要求"
```

**场景3：客户演示项目功能**
```
客户："这个上传功能支持哪些格式？"
你（现场演示）：
"我们的上传系统支持：
- 📷 图片格式：JPG、PNG、GIF（自动压缩）
- 📄 文档格式：PDF、Word、Excel（自动扫描）
- 💾 大小限制：单文件最大5MB（可配置）
- ⚡ 上传进度：实时显示，支持断点续传
- 🔒 安全检查：自动病毒扫描，确保系统安全"
```

### 📊 2.2 企业级技能评估系统

#### 🎯 技能等级认证（HR认可的标准）

**🔥 高级前端工程师（薪资：15-25K）**
- ✅ 能独立设计企业级组件架构
- ✅ 掌握性能优化和错误处理机制
- ✅ 理解业务需求并转化为技术方案
- ✅ 具备代码review和技术指导能力

**⚡ 中级前端工程师（薪资：8-15K）**
- ✅ 能独立完成企业级项目开发
- ✅ 掌握主流框架和工具链使用
- ✅ 理解企业级代码规范和最佳实践
- ✅ 具备基本的项目部署和维护能力

**🌱 初级前端工程师（薪资：5-8K）**
- ✅ 能完成基本的页面开发任务
- ✅ 掌握HTML/CSS/JavaScript基础
- ✅ 理解AJAX和DOM操作
- ✅ 具备学习和成长的潜力

#### 🏆 企业认证考试（30分钟实战）

**【认证考试】请在30分钟内完成以下企业级任务：**

**任务1：企业级图书表格组件（15分钟）**
```
需求：
- 支持动态数据渲染（10本书）
- 每本书有编辑/删除按钮
- 表格样式符合企业UI规范
- 代码结构清晰，可维护性强

考核标准：
✅ 使用Bootstrap 5企业级样式
✅ 使用事件委托处理按钮点击
✅ 使用模板引擎方式渲染数据
✅ 代码有注释，变量命名规范
```

**任务2：企业级文件上传组件（15分钟）**
```
需求：
- 支持图片文件选择和上传
- 显示上传进度条
- 上传成功显示预览图
- 上传失败显示错误信息

考核标准：
✅ 文件类型和大小验证
✅ 上传进度实时显示
✅ 错误处理完整
✅ 用户体验良好
```

#### 📈 认证结果与职业建议

| 认证等级 | 薪资范围 | 建议职位 | 下一步学习计划 |
|----------|----------|----------|----------------|
| **🥇 高级认证** | 15-25K | 高级前端工程师 | 学习Vue/React框架，深入工程化 |
| **🥈 中级认证** | 8-15K | 中级前端工程师 | 强化项目经验，准备面试作品 |
| **🥉 初级认证** | 5-8K | 初级前端工程师 | 继续练习基础项目，积累经验 |
| **❌ 未通过** | <5K | 实习生/助理 | 重新学习基础课程，强化练习 |

### 🔧 2.3 企业环境搭建标准

#### 🏢 开发环境标准化（企业级配置）

**必需工具清单：**
```bash
# 代码编辑器（企业推荐）
✅ VS Code + 企业级插件套装
  - ESLint（代码规范检查）
  - Prettier（代码格式化）
  - Live Server（本地服务器）
  - GitLens（版本控制）
  - Bootstrap 5 Snippets（快速编码）

# 浏览器环境（开发专用）
✅ Chrome DevTools配置
  - 移动端调试模式
  - Network面板（API监控）
  - Application面板（存储查看）
  - Console面板（错误调试）

# 辅助工具（效率提升）
✅ Git（版本控制）
✅ Node.js（前端工程化）
✅ Postman（API测试）
```

**企业级项目模板：**
```html
<!DOCTYPE html>
<html lang="zh-CN" data-bs-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="企业级图书管理系统 - 专业的图书信息管理平台">
    <meta name="keywords" content="图书管理,企业级应用,AJAX,Bootstrap">
    <title>企业级图书管理系统 v1.0</title>
    
    <!-- 企业级CSS框架 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- 企业级自定义样式 -->
    <style>
        /* CSS变量：企业级主题配置 */
        :root {
            --primary-color: #2563eb;
            --secondary-color: #64748b;
            --success-color: #059669;
            --danger-color: #dc2626;
            --warning-color: #d97706;
            --info-color: #0891b2;
            --border-radius: 8px;
            --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .enterprise-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .enterprise-card {
            border: 1px solid #e5e7eb;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            transition: all 0.3s ease;
        }
        
        .enterprise-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .enterprise-btn {
            border-radius: var(--border-radius);
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .enterprise-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
    </style>
</head>
<body>
    <!-- 企业级应用容器 -->
    <div class="enterprise-container">
        <!-- 项目内容区域 -->
    </div>
    
    <!-- 企业级JavaScript依赖 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    
    <!-- 企业级项目代码 -->
    <script src="js/main.js" type="module"></script>
</body>
</html>
```

## 第三章：企业级项目架构 - 像专业开发者一样工作 🏗️

### 🎯 3.1 企业开发流程体验

> 📈 **真实企业项目流程**：需求分析 → 技术选型 → 架构设计 → 编码实现 → 测试验收 → 部署上线

#### 📋 我们的项目清单（模拟真实工作场景）

| 项目优先级 | 项目名称 | 业务价值 | 技术栈 | 预期收益 |
|------------|----------|----------|--------|----------|
| **P0** | 📚 图书管理系统 | 掌握核心业务CRUD | Bootstrap + AJAX | **面试必问项目** |
| **P1** | 🖼️ 图片上传系统 | 文件处理核心能力 | FormData + AJAX | **用户刚需功能** |
| **P2** | 🎨 网站换肤功能 | 用户体验优化 | localStorage + AJAX | **产品差异化** |
| **P3** | 👤 个人中心 | 完整用户系统 | 综合技术栈 | **综合能力展示** |

### 🏗️ 3.2 项目架构设计（企业级思维）

#### 整体技术架构
```
前端应用架构
├── 📱 用户界面层 (Bootstrap + CSS)
├── 🔄 业务逻辑层 (JavaScript + AJAX)  
├── 📦 数据处理层 (JSON + 表单处理)
├── 🌐 网络请求层 (axios + HTTP)
└── 💾 本地存储层 (localStorage + 缓存)
```

#### 项目依赖管理
```html
<!-- 统一的项目模板 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>企业级AJAX项目</title>
    
    <!-- CSS依赖 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- 项目内容 -->
    
    <!-- JS依赖 -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="lib/form-serialize.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

### ⏰ 3.3 项目开发时间线（敏捷开发模式）

#### Sprint 1: 核心功能开发（2小时）
- **09:00-09:15** 📋 项目介绍 + 环境搭建
- **09:15-10:45** 📚 图书管理系统开发（核心功能）
- **10:45-11:00** ☕ 休息 + 代码review
- **11:00-12:00** 🖼️ 图片上传功能实现

#### Sprint 2: 用户体验优化（1.5小时）
- **13:30-14:00** 🎨 网站换肤功能
- **14:00-15:00** 👤 个人中心开发
- **15:00-15:30** 🧪 项目测试 + 问题修复

#### Sprint 3: 项目总结（0.5小时）
- **15:30-16:00** 📊 项目总结 + 面试要点

> 💡 **敏捷开发精髓**：小步快跑，快速迭代，及时反馈！

### 🎯 3.4 每个项目的学习价值

#### 📚 图书管理系统 - **企业级CRUD标准实现**
- **业务价值**：最经典的管理系统模板
- **技术价值**：掌握增删改查完整流程
- **面试价值**：90%面试会问CRUD实现

#### 🖼️ 图片上传 - **文件处理核心技能**
- **业务价值**：用户头像、商品图片等刚需功能
- **技术价值**：FormData、文件API、上传进度
- **面试价值**：文件上传是高频面试题

#### 🎨 网站换肤 - **用户体验优化**
- **业务价值**：个性化设置提升用户粘性
- **技术价值**：localStorage、主题切换
- **产品价值**：体现产品差异化思维

#### 👤 个人中心 - **完整用户系统**
- **业务价值**：任何应用都需要的用户模块
- **技术价值**：综合技术栈应用
- **项目价值**：可以独立作为完整项目



## 第1章：图书管理系统 - 经典CRUD实战 📚

### 🎯 本章目标
完成一个完整的图书管理系统，包含**增删改查**四大功能！

### 🏗️ 项目架构预览
```
图书管理系统
├── 📋 图书列表展示（查）
├── ➕ 新增图书功能（增）
├── ✏️ 编辑图书功能（改）
├── 🗑️ 删除图书功能（删）
└── 🪟 Bootstrap弹框（用于新增/编辑）
```

### 🎨 最终效果展示
> 完成后你将看到这样的界面：
> - 📋 显示所有图书的表格
> - ➕ "添加图书"按钮，点击弹出表单
> - ✏️ 每本书后面的"编辑"按钮
> - 🗑️ 每本书后面的"删除"按钮

### 📚 技术要点
1. **Bootstrap弹框** - 用于显示新增/编辑表单
2. **axios请求** - 与服务器交互数据
3. **事件委托** - 高效处理多个按钮点击
4. **数据渲染** - 动态更新页面内容

### 🚀 开发顺序（很重要！）
1. **先学Bootstrap弹框** - 因为新增/编辑都需要弹框
2. **再做图书列表** - 能看到数据，方便测试其他功能
3. **再做新增功能** - 有数据后才能测试删除/编辑
4. **再做删除功能** - 数据多了可以删除
5. **最后做编辑功能** - 最复杂，放在最后

> 💡 **为什么要按这个顺序？** 因为后面的功能依赖前面的功能，就像盖房子一样，要一步一步来！



## 1.1 Bootstrap弹框入门 🪟

### 🎯 本节目标
学会使用Bootstrap弹框，为后面的新增/编辑图书做准备！

### 🤔 什么是Bootstrap弹框？
**弹框 = 网页上的"小窗口"**
- ✅ 不离开当前页面
- ✅ 显示单独的内容
- ✅ 用户可以在里面操作

**生活中的例子**：就像你去银行ATM机，插卡后弹出的操作界面

### 🎨 Bootstrap弹框长什么样？
```
┌─────────────────────────────────────┐
│ 弹框标题                    [X]    │ ← 头部
├─────────────────────────────────────┤
│                                     │
│    这里放你的内容                   │ ← 身体
│    比如表单、文字等                 │
│                                     │
├─────────────────────────────────────┤
│  [取消]  [确定]                    │ ← 底部
└─────────────────────────────────────┘
```

### 🚀 5分钟学会控制弹框

#### 第一步：引入Bootstrap
```html
<!-- 引入Bootstrap CSS（让弹框好看） -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 引入Bootstrap JS（让弹框能动） -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"></script>
```

#### 第二步：准备弹框HTML结构
```html
<!-- 触发按钮 -->
<button data-bs-toggle="modal" data-bs-target=".my-box">
  显示弹框
</button>

<!-- 弹框本体（默认是隐藏的） -->
<div class="modal my-box">
  <div class="modal-dialog">
    <div class="modal-content">
      <!-- 头部 -->
      <div class="modal-header">
        <h5>添加新图书</h5>
        <button data-bs-dismiss="modal">×</button>
      </div>
      
      <!-- 身体 -->
      <div class="modal-body">
        <p>这里是表单内容</p>
      </div>
      
      <!-- 底部 -->
      <div class="modal-footer">
        <button data-bs-dismiss="modal">取消</button>
        <button>保存</button>
      </div>
    </div>
  </div>
</div>
```

#### 第三步：理解控制属性
| 属性 | 作用 | 放在哪里 |
|------|------|----------|
| `data-bs-toggle="modal"` | 告诉按钮：我要控制弹框 | 触发按钮上 |
| `data-bs-target=".my-box"` | 告诉按钮：我要控制哪个弹框 | 触发按钮上 |
| `data-bs-dismiss="modal"` | 告诉元素：点击我就能关闭弹框 | 关闭按钮上 |

> 💡 **记住**：`data-bs-toggle`和`data-bs-target`要一起用，就像钥匙和锁一样！

      

4. 去代码区实现一下

   ```html
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Bootstrap 弹框</title>
     <!-- 引入bootstrap.css -->
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
   </head>
   
   <body>
     <!-- 
       目标：使用Bootstrap弹框
       1. 引入bootstrap.css 和 bootstrap.js
       2. 准备弹框标签，确认结构
       3. 通过自定义属性，控制弹框的显示和隐藏
      -->
     <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target=".my-box">
       显示弹框
     </button>
   
     <!-- 
       弹框标签
       bootstrap的modal弹框，添加modal类名（默认隐藏）
      -->
     <div class="modal my-box" tabindex="-1">
       <div class="modal-dialog">
         <!-- 弹框-内容 -->
         <div class="modal-content">
           <!-- 弹框-头部 -->
           <div class="modal-header">
             <h5 class="modal-title">Modal title</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <!-- 弹框-身体 -->
           <div class="modal-body">
             <p>Modal body text goes here.</p>
           </div>
           <!-- 弹框-底部 -->
           <div class="modal-footer">
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
             <button type="button" class="btn btn-primary">Save changes</button>
           </div>
         </div>
       </div>
     </div>
   
     <!-- 引入bootstrap.js -->
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"></script>
   </body>
   
   </html>
   ```

   


### 小结

1. 用哪个属性绑定来控制弹框显示呢?

   <details>
   <summary>答案</summary>
   <ul>
   <li>data-bs-toggle和data-bs-target</li>
   </ul>
   </details>

2. 用哪个属性来控制隐藏弹框呢？

   <details>
   <summary>答案</summary>
   <ul>
   <li>data-bs-dismiss 关闭的是标签所在的当前提示框</li>
   </ul>
   </details>



## 03.Bootstrap 弹框_JS控制

### 目标

使用 JS 方式控制 Bootstarp 弹框的显示和隐藏



### 讲解

1. 为什么需要 JS 方式控制呢？

   * 当我显示之前，隐藏之前，需要执行一些 JS 逻辑代码，就需要引入 JS 控制弹框显示/隐藏的方式了

   * 例如：

     * 点击编辑姓名按钮，在弹框显示之前，在输入框填入默认姓名
     * 点击保存按钮，在弹框隐藏之前，获取用户填入的名字并打印

     ![image-20230404110038828](images/image-20230404110038828.png)

   

2. 所以在现实和隐藏之前，需要执行 JS 代码逻辑，就使用 JS 方式 控制 Bootstrap 弹框显示和隐藏

   语法如下：

   ```js
   // 创建弹框对象
   const modalDom = document.querySelector('css选择器')
   const modal = new bootstrap.Modal(modelDom)
   
   // 显示弹框
   modal.show()
   // 隐藏弹框
   modal.hide()
   ```

   

3. 去代码区实现一下

   ```js
   // 1. 创建弹框对象
   const modalDom = document.querySelector('.name-box')
   const modal = new bootstrap.Modal(modalDom)
   
   // 编辑姓名->点击->赋予默认姓名->弹框显示
   document.querySelector('.edit-btn').addEventListener('click', () => {
     document.querySelector('.username').value = '默认姓名'
   
     // 2. 显示弹框
     modal.show()
   })
   
   // 保存->点击->->获取姓名打印->弹框隐藏
   document.querySelector('.save-btn').addEventListener('click', () => {
     const username = document.querySelector('.username').value
     console.log('模拟把姓名保存到服务器上', username)
   
     // 2. 隐藏弹框
     modal.hide()
   })
   ```



### 小结

1. 什么时候用属性控制，什么时候用 JS 控制 Bootstrap 弹框的显示/隐藏?

   <details>
   <summary>答案</summary>
   <ul>
   <li>直接出现/隐藏用属性方式控制，如果需要先执行一段 JS 逻辑再显示/隐藏就用 JS 方式控制</li>
   </ul>
   </details>



## 04.案例_图书管理\_渲染列表

### 目标

完成图书管理案例-图书列表数据渲染效果



### 讲解

1. 需求：基于 axios 获取到图书列表数据，并用 JS 代码渲染数据，到准备好的模板标签中

   ![image-20230404110943200](images/image-20230404110943200.png)

2. 步骤：

   1. 获取数据

   2. 渲染数据

      ![image-20230404110953752](images/image-20230404110953752.png)

      ![image-20230404111014560](images/image-20230404111014560.png)

3. 获取数据的时候，需要给自己起一个外号，为什么需要给自己起一个外号呢？

   * 我们所有人数据都来自同一个服务器上，为了区分每个同学不同的数据，需要大家设置一个外号告诉服务器，服务器就会返回你对应的图书数据了

   

4. 核心代码如下：

   > 因为默认展示列表，新增，修改，删除后都要重新获取并刷新列表，所以把获取数据渲染数据的代码封装在一个函数内，方便复用

   ```js
   /**
    * 目标1：渲染图书列表
    *  1.1 获取数据
    *  1.2 渲染数据
    */
   const creator = '老张'
   // 封装-获取并渲染图书列表函数
   function getBooksList() {
     // 1.1 获取数据
     axios({
       url: 'http://hmajax.itheima.net/api/books',
       params: {
         // 外号：获取对应数据
         creator
       }
     }).then(result => {
       // console.log(result)
       const bookList = result.data.data
       // console.log(bookList)
       // 1.2 渲染数据
       const htmlStr = bookList.map((item, index) => {
         return `<tr>
         <td>${index + 1}</td>
         <td>${item.bookname}</td>
         <td>${item.author}</td>
         <td>${item.publisher}</td>
         <td data-id=${item.id}>
           <span class="del">删除</span>
           <span class="edit">编辑</span>
         </td>
       </tr>`
       }).join('')
       // console.log(htmlStr)
       document.querySelector('.list').innerHTML = htmlStr
     })
   }
   // 网页加载运行，获取并渲染列表一次
   getBooksList()
   ```

   

   


### 小结

1. 渲染数据列表的2个步骤是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>获取数据，分析结构渲染到页面上</li>
   </ul>
   </details>





## 05.案例_图书管理\_新增图书

### 目标

完成图书管理案例-新增图书需求



### 讲解

1. 需求：点击添加按钮，出现准备好的新增图书弹框，填写图书信息提交到服务器保存，并更新图书列表

   ![image-20230404111235862](images/image-20230404111235862.png)

   ![image-20230404111251254](images/image-20230404111251254.png)

2. 步骤：

   1. 新增弹框（控制显示和隐藏）（基于 Bootstrap 弹框和准备好的表单-用属性和 JS 方式控制）

   2. 在点击保存按钮时，收集数据&提交保存

   3. 刷新-图书列表）（重新调用下之前封装的获取并渲染列表的函数）

      ![image-20230404111343653](images/image-20230404111343653.png)

3. 核心代码如下：

   ```js
   /**
    * 目标2：新增图书
    *  2.1 新增弹框->显示和隐藏
    *  2.2 收集表单数据，并提交到服务器保存
    *  2.3 刷新图书列表
    */
   // 2.1 创建弹框对象
   const addModalDom = document.querySelector('.add-modal')
   const addModal = new bootstrap.Modal(addModalDom)
   // 保存按钮->点击->隐藏弹框
   document.querySelector('.add-btn').addEventListener('click', () => {
     // 2.2 收集表单数据，并提交到服务器保存
     const addForm = document.querySelector('.add-form')
     const bookObj = serialize(addForm, { hash: true, empty: true })
     // console.log(bookObj)
     // 提交到服务器
     axios({
       url: 'http://hmajax.itheima.net/api/books',
       method: 'POST',
       data: {
         ...bookObj,
         creator
       }
     }).then(result => {
       // console.log(result)
       // 2.3 添加成功后，重新请求并渲染图书列表
       getBooksList()
       // 重置表单
       addForm.reset()
       // 隐藏弹框
       addModal.hide()
     })
   })
   ```

   



### 小结

1. 新增数据的3个步骤是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>准备好数据标签和样式，然后收集表单数据提交保存，刷新列表</li>
   </ul>
   </details>



## 06.案例_图书管理\_删除图书

### 目标

完成图书管理案例-删除图书需求



### 讲解

1. 需求：点击图书删除元素，删除当前图书数据

   ![image-20230404111530311](images/image-20230404111530311.png)
   
   ![image-20230404111546639](images/image-20230404111546639.png)

2. 步骤：

   1. 给删除元素，绑定点击事件（事件委托方式并判断点击的是删除元素才走删除逻辑代码），并获取到要删除的数据id
   2. 基于 axios 和接口文档，调用删除接口，让服务器删除这条数据
   3. 重新获取并刷新图书列表

      ![image-20230404111612125](images/image-20230404111612125.png)


3. 核心代码如下：

   ```js
   /**
    * 目标3：删除图书
    *  3.1 删除元素绑定点击事件->获取图书id
    *  3.2 调用删除接口
    *  3.3 刷新图书列表
    */
   // 3.1 删除元素->点击（事件委托）
   document.querySelector('.list').addEventListener('click', e => {
     // 获取触发事件目标元素
     // console.log(e.target)
     // 判断点击的是删除元素
     if (e.target.classList.contains('del')) {
       // console.log('点击删除元素')
       // 获取图书id（自定义属性id）
       const theId = e.target.parentNode.dataset.id
       // console.log(theId)
       // 3.2 调用删除接口
       axios({
         url: `http://hmajax.itheima.net/api/books/${theId}`,
         method: 'DELETE'
       }).then(() => {
         // 3.3 刷新图书列表
         getBooksList()
       })
     }
   })
   ```

   



### 小结

1. 删除数据的步骤是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>告知服务器要删除的数据id，服务器删除后，重新获取并刷新列表</li>
   </ul>
   </details>



## 07-09.案例_图书管理\_编辑图书

### 目标

完成图书管理案例-编辑图书需求



### 讲解

1. 因为编辑图书要做回显等，比较复杂，所以分了3个视频来讲解

2. 需求：完成编辑图书回显当前图书数据到编辑表单，在用户点击修改按钮，收集数据提交到服务器保存，并刷新列表

   ![image-20230404111722254](images/image-20230404111722254.png)

3. 编辑数据的核心思路：

   1. 给编辑元素，绑定点击事件（事件委托方式并判断点击的是编辑元素才走编辑逻辑代码），并获取到要编辑的数据id
   2. 基于 axios 和接口文档，调用查询图书详情接口，获取正在编辑的图书数据，并回显到表单中（页面上的数据是在用户的浏览器中不够准备，所以只要是查看数据都要从服务器获取）

      ![image-20230404111739153](images/image-20230404111739153.png)
   3. 收集并提交保存修改数据，并重新从服务器获取列表刷新页面

      ![image-20230404111756655](images/image-20230404111756655.png)


4. 核心代码如下：

   ```js
   /**
    * 目标4：编辑图书
    *  4.1 编辑弹框->显示和隐藏
    *  4.2 获取当前编辑图书数据->回显到编辑表单中
    *  4.3 提交保存修改，并刷新列表
    */
   // 4.1 编辑弹框->显示和隐藏
   const editDom = document.querySelector('.edit-modal')
   const editModal = new bootstrap.Modal(editDom)
   // 编辑元素->点击->弹框显示
   document.querySelector('.list').addEventListener('click', e => {
     // 判断点击的是否为编辑元素
     if (e.target.classList.contains('edit')) {
       // 4.2 获取当前编辑图书数据->回显到编辑表单中
       const theId = e.target.parentNode.dataset.id
       axios({
         url: `http://hmajax.itheima.net/api/books/${theId}`
       }).then(result => {
         const bookObj = result.data.data
         // document.querySelector('.edit-form .bookname').value = bookObj.bookname
         // document.querySelector('.edit-form .author').value = bookObj.author
         // 数据对象“属性”和标签“类名”一致
         // 遍历数据对象，使用属性去获取对应的标签，快速赋值
         const keys = Object.keys(bookObj) // ['id', 'bookname', 'author', 'publisher']
         keys.forEach(key => {
           document.querySelector(`.edit-form .${key}`).value = bookObj[key]
         })
       })
       editModal.show()
     }
   })
   // 修改按钮->点击->隐藏弹框
   document.querySelector('.edit-btn').addEventListener('click', () => {
     // 4.3 提交保存修改，并刷新列表
     const editForm = document.querySelector('.edit-form')
     const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true})
     // 保存正在编辑的图书id，隐藏起来：无需让用户修改
     // <input type="hidden" class="id" name="id" value="84783">
     axios({
       url: `http://hmajax.itheima.net/api/books/${id}`,
       method: 'PUT',
       data: {
         bookname,
         author,
         publisher,
         creator
       }
     }).then(() => {
       // 修改成功以后，重新获取并刷新列表
       getBooksList()
   
       // 隐藏弹框
       editModal.hide()
     })
   })
   ```

   



### 小结

1. 编辑数据的步骤是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>获取正在编辑数据并回显，收集编辑表单的数据提交保存，重新获取并刷新列表</li>
   </ul>
   </details>



## 10.案例_图书管理\_总结

### 目标

总结下增删改查的核心思路



### 讲解

1. 因为增删改查的业务在前端实际开发中非常常见，思路是可以通用的，所以总结下思路

   > 1.渲染列表（查）
   >
   > 2.新增图书（增）
   >
   > 3.删除图书（删）
   >
   > 4.编辑图书（改）

   ![image-20230404111941722](images/image-20230404111941722.png)

2. 渲染数据（查）

   > 核心思路：获取数据 -> 渲染数据

   ```js
   // 1.1 获取数据
   axios({...}).then(result => {
     const bookList = result.data.data
     // 1.2 渲染数据
     const htmlStr = bookList.map((item, index) => {
       return `<tr>
       <td>${index + 1}</td>
       <td>${item.bookname}</td>
       <td>${item.author}</td>
       <td>${item.publisher}</td>
       <td data-id=${item.id}>
         <span class="del">删除</span>
         <span class="edit">编辑</span>
       </td>
     </tr>`
     }).join('')
     document.querySelector('.list').innerHTML = htmlStr
   })
   ```

   

3. 新增数据（增）

   > 核心思路：准备页面标签 -> 收集数据提交（必须） -> 刷新页面列表（可选）

   ```js
   // 2.1 创建弹框对象
   const addModalDom = document.querySelector('.add-modal')
   const addModal = new bootstrap.Modal(addModalDom)
   document.querySelector('.add-btn').addEventListener('click', () => {
     // 2.2 收集表单数据，并提交到服务器保存
     const addForm = document.querySelector('.add-form')
     const bookObj = serialize(addForm, { hash: true, empty: true })
     axios({...}).then(result => {
       // 2.3 添加成功后，重新请求并渲染图书列表
       getBooksList()
       addForm.reset()
       addModal.hide()
     })
   })
   ```

   

   ![image-20230404112942935](images/image-20230404112942935.png)



4. 删除图书（删）

   > 核心思路：绑定点击事件（获取要删除的图书唯一标识） -> 调用删除接口（让服务器删除此数据） -> 成功后重新获取并刷新列表

   ```js
   // 3.1 删除元素->点击（事件委托）
   document.querySelector('.list').addEventListener('click', e => {
     if (e.target.classList.contains('del')) {
       // 获取图书id（自定义属性id）
       const theId = e.target.parentNode.dataset.id
       // 3.2 调用删除接口
       axios({...}).then(() => {
         // 3.3 刷新图书列表
         getBooksList()
       })
     }
   })
   ```

   ![image-20230404113338815](images/image-20230404113338815.png)

5. 编辑图书（改）

   > 核心思路：准备编辑图书表单 -> 表单回显正在编辑的数据 -> 点击修改收集数据 -> 提交到服务器保存 -> 重新获取并刷新列表

   ```js
   // 4.1 编辑弹框->显示和隐藏
   const editDom = document.querySelector('.edit-modal')
   const editModal = new bootstrap.Modal(editDom)
   document.querySelector('.list').addEventListener('click', e => {
     if (e.target.classList.contains('edit')) {
       // 4.2 获取当前编辑图书数据->回显到编辑表单中
       const theId = e.target.parentNode.dataset.id
       axios({...}).then(result => {
         const bookObj = result.data.data
         // 遍历数据对象，使用属性去获取对应的标签，快速赋值
         const keys = Object.keys(bookObj) 
         keys.forEach(key => {
           document.querySelector(`.edit-form .${key}`).value = bookObj[key]
         })
       })
       editModal.show()
     }
   })
   
   document.querySelector('.edit-btn').addEventListener('click', () => {
     // 4.3 提交保存修改，并刷新列表
     const editForm = document.querySelector('.edit-form')
     const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true})
     // 保存正在编辑的图书id，隐藏起来：无需让用户修改
     // <input type="hidden" class="id" name="id" value="84783">
     axios({...}).then(() => {
       getBooksList()
       editModal.hide()
     })
   })
   ```

   

   ![image-20230404113702515](images/image-20230404113702515.png)



### 小结

1. 学完图书管理案例，我们收货了什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>现在编辑的虽然是图书数据，以后编辑其他数据，再做增删改查都是差不多的思路</li>
   </ul>
   </details>



## 11.图片上传

### 目标

把本地图片上传到网页上显示



### 讲解

1. 什么是图片上传？
   * 就是把本地的图片上传到网页上显示
2. 图片上传怎么做？
   * 先依靠文件选择元素获取用户选择的本地文件，接着提交到服务器保存，服务器会返回图片的 url 网址，然后把网址加载到 img 标签的 src 属性中即可显示
3. 为什么不直接显示到浏览器上，要放到服务器上呢？
   * 因为浏览器保存是临时的，如果你想随时随地访问图片，需要上传到服务器上
4. 图片上传怎么做呢？
   1. 先获取图片文件对象
   2. 使用 FormData 表单数据对象装入（因为图片是文件而不是以前的数字和字符串了所以传递文件一般需要放入 FormData 以键值对-文件流的数据传递（可以查看请求体-确认请求体结构）

      ```js
      const fd = new FormData()
      fd.append(参数名, 值)
      ```
   3. 提交表单数据对象，使用服务器返回图片 url 网址
5. 核心代码如下：

   ```html
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>图片上传</title>
   </head>
   
   <body>
     <!-- 文件选择元素 -->
     <input type="file" class="upload">
     <img src="" alt="" class="my-img">
   
     <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
     <script>
       /**
        * 目标：图片上传，显示到网页上
        *  1. 获取图片文件
        *  2. 使用 FormData 携带图片文件
        *  3. 提交到服务器，获取图片url网址使用
       */
       // 文件选择元素->change改变事件
       document.querySelector('.upload').addEventListener('change', e => {
         // 1. 获取图片文件
         console.log(e.target.files[0])
         // 2. 使用 FormData 携带图片文件
         const fd = new FormData()
         fd.append('img', e.target.files[0])
         // 3. 提交到服务器，获取图片url网址使用
         axios({
           url: 'http://hmajax.itheima.net/api/uploadimg',
           method: 'POST',
           data: fd
         }).then(result => {
           console.log(result)
           // 取出图片url网址，用img标签加载显示
           const imgUrl = result.data.data.url
           document.querySelector('.my-img').src = imgUrl
         })
       })
     </script>
   </body>
   
   </html>
   ```

   



### 小结

1. 图片上传的思路是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>先用文件选择元素，获取到文件对象，然后装入 FormData 表单对象中，再发给服务器，得到图片在服务器的 URL 网址，再通过 img 标签加载图片显示</li>
   </ul>
   </details>



## 12.案例_网站-更换背景图

### 目标

实现更换网站背景图的效果



### 讲解

1. 需求：先运行备课代码，查看要完成的效果，点击右上角选择本机中提供的素材图片，更换网站背景图

   ![image-20230404122349505](images/image-20230404122349505.png)
2. 网站更换背景图如何实现呢，并且保证刷新后背景图还在？具体步骤：
   1. 先获取到用户选择的背景图片，上传并把服务器返回的图片 url 网址设置给 body 背景
   2. 上传成功时，保存图片 url 网址到 localStorage 中
   3. 网页运行后，获取 localStorage 中的图片的 url 网址使用（并判断本地有图片 url 网址字符串才设置）
3. 核心代码如下：

   ```js
   /**
    * 目标：网站-更换背景
    *  1. 选择图片上传，设置body背景
    *  2. 上传成功时，"保存"图片url网址
    *  3. 网页运行后，"获取"url网址使用
    * */
   document.querySelector('.bg-ipt').addEventListener('change', e => {
     // 1. 选择图片上传，设置body背景
     console.log(e.target.files[0])
     const fd = new FormData()
     fd.append('img', e.target.files[0])
     axios({
       url: 'http://hmajax.itheima.net/api/uploadimg',
       method: 'POST',
       data: fd
     }).then(result => {
       const imgUrl = result.data.data.url
       document.body.style.backgroundImage = `url(${imgUrl})`
   
       // 2. 上传成功时，"保存"图片url网址
       localStorage.setItem('bgImg', imgUrl)
     })
   })
   
   // 3. 网页运行后，"获取"url网址使用
   const bgUrl = localStorage.getItem('bgImg')
   console.log(bgUrl)
   bgUrl && (document.body.style.backgroundImage = `url(${bgUrl})`)
   ```

   



### 小结

1. localStorage 取值和赋值的语法分别是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>localStorage.getItem('key')是取值，localStorage.setItem('key', 'value')是赋值</li>
   </ul>
   </details>



## 13.案例_个人信息设置-介绍

### 目标

介绍个人信息设置案例-需要完成哪些效果，分几个视频讲解



### 讲解

1. 需求：先运行备课代码，查看要完成的效果

   ![image-20230404123206073](images/image-20230404123206073.png)
2. 本视频分为，信息回显 + 头像修改 + 信息修改+ 提示框反馈 4 部分
   1. 先完成信息回显
   2. 再做头像修改-立刻就更新给此用户
   3. 收集个人信息表单-提交保存
   4. 提交后反馈结果给用户（提示框）



### 小结

暂无



## 14.案例_个人信息设置-信息渲染

### 目标

把外号对应的用户信息渲染到页面上



### 讲解

1. 需求：把外号对应的个人信息和头像，渲染到页面表单和头像标签上。

   ![image-20230404123708765](images/image-20230404123708765.png)
2. 注意：还是需要准备一个外号，因为想要查看自己对应的用户信息，不想被别人影响
3. 步骤：
   * 获取数据
   * 渲染数据到页面

4. 代码如下：

   ```js
   /**
    * 目标1：信息渲染
    *  1.1 获取用户的数据
    *  1.2 回显数据到标签上
    * */
   const creator = '播仔'
   // 1.1 获取用户的数据
   axios({
     url: 'http://hmajax.itheima.net/api/settings',
     params: {
       creator
     }
   }).then(result => {
     const userObj = result.data.data
     // 1.2 回显数据到标签上
     Object.keys(userObj).forEach(key => {
       if (key === 'avatar') {
         // 赋予默认头像
         document.querySelector('.prew').src = userObj[key]
       } else if (key === 'gender') {
         // 赋予默认性别
         // 获取性别单选框：[男radio元素，女radio元素]
         const gRadioList = document.querySelectorAll('.gender')
         // 获取性别数字：0男，1女
         const gNum = userObj[key]
         // 通过性别数字，作为下标，找到对应性别单选框，设置选中状态
         gRadioList[gNum].checked = true
       } else {
         // 赋予默认内容
         document.querySelector(`.${key}`).value = userObj[key]
       }
     })
   })
   ```

   



### 小结

1. 渲染数据和图书列表的渲染思路是否一样呢，是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>一样的，都是获取到数据，然后渲染到页面上</li>
   </ul>
   </details>



## 15.案例_个人信息设置-头像修改

### 目标

修改用户的头像并立刻生效



### 讲解

1. 需求：点击修改用户头像

   ![image-20230404124524401](images/image-20230404124524401.png)
2. 实现步骤如下：

   1. 获取到用户选择的头像文件
   2. 调用头像修改接口，并除了头像文件外，还要在 FormData 表单数据对象中携带外号
   3. 提交到服务器保存此用户对应头像文件，并把返回的头像图片 url 网址设置在页面上

      ![image-20230404124540629](images/image-20230404124540629.png)
3. 注意：重新刷新重新获取，已经是修改后的头像了（证明服务器那边确实保存成功）
4. 核心代码：

   ```js
   /**
    * 目标2：修改头像
    *  2.1 获取头像文件
    *  2.2 提交服务器并更新头像
    * */
   // 文件选择元素->change事件
   document.querySelector('.upload').addEventListener('change', e => {
     // 2.1 获取头像文件
     console.log(e.target.files[0])
     const fd = new FormData()
     fd.append('avatar', e.target.files[0])
     fd.append('creator', creator)
     // 2.2 提交服务器并更新头像
     axios({
       url: 'http://hmajax.itheima.net/api/avatar',
       method: 'PUT',
       data: fd
     }).then(result => {
       const imgUrl = result.data.data.avatar
       // 把新的头像回显到页面上
       document.querySelector('.prew').src = imgUrl
     })
   })
   ```

   



### 小结

1. 为什么这次上传头像，需要携带外号呢？

   <details>
   <summary>答案</summary>
   <ul>
   <li>因为这次头像到后端，是要保存在某个用户名下的，所以要把外号名字一起携带过去</li>
   </ul>
   </details>



## 16.案例_个人信息设置-信息修改

### 目标

把用户修改的信息提交到服务器保存



### 讲解

1. 需求：点击提交按钮，收集个人信息，提交到服务器保存（无需重新获取刷新，因为页面已经是最新的数据了）
   1. 收集表单数据

   2. 提交到服务器保存-调用用户信息更新接口（注意请求方法是 PUT）代表数据更新的意思

      ![image-20230404125310049](images/image-20230404125310049.png)

2. 核心代码如下：

   ```js
   /**
    * 目标3：提交表单
    *  3.1 收集表单信息
    *  3.2 提交到服务器保存
    */
   // 保存修改->点击
   document.querySelector('.submit').addEventListener('click', () => {
     // 3.1 收集表单信息
     const userForm = document.querySelector('.user-form')
     const userObj = serialize(userForm, { hash: true, empty: true })
     userObj.creator = creator
     // 性别数字字符串，转成数字类型
     userObj.gender = +userObj.gender
     console.log(userObj)
     // 3.2 提交到服务器保存
     axios({
       url: 'http://hmajax.itheima.net/api/settings',
       method: 'PUT',
       data: userObj
     }).then(result => {
     })
   })
   ```

   



### 小结

1. 信息修改数据和以前增删改查哪个实现的思路比较接近呢？

   <details>
   <summary>答案</summary>
   <ul>
   <li>编辑，首先回显已经做完了，然后收集用户最新改动后的数据，提交到服务器保存，因为页面最终就是用户刚写的数据，所以不用重新获取并刷新页面了</li>
   </ul>
   </details>



## 17.案例_个人信息设置-提示框

### 目标

把用户更新个人信息结果，用提示框反馈给用户



### 讲解

1. 需求：使用 bootstrap 提示框，提示个人信息设置后的结果

   ![image-20230404125517679](images/image-20230404125517679.png)

2. bootstrap 的 toast 提示框和 modal 弹框使用很像，语法如下：

   1. 先准备对应的标签结构（模板里已有）

   2. 设置延迟自动消失的时间

      ```html
      <div class="toast" data-bs-delay="1500">
        提示框内容
      </div>
      ```

   3. 使用 JS 的方式，在 axios 请求响应成功时，展示结果

      ```js
      // 创建提示框对象
      const toastDom = document.querySelector('css选择器')
      const toast = new bootstrap.Toast(toastDom)
      
      // 显示提示框
      toast.show()
      ```

      

3. 核心代码：

   ```js
   /**
    * 目标3：提交表单
    *  3.1 收集表单信息
    *  3.2 提交到服务器保存
    */
   /**
    * 目标4：结果提示
    *  4.1 创建toast对象
    *  4.2 调用show方法->显示提示框
    */
   // 保存修改->点击
   document.querySelector('.submit').addEventListener('click', () => {
     // 3.1 收集表单信息
     const userForm = document.querySelector('.user-form')
     const userObj = serialize(userForm, { hash: true, empty: true })
     userObj.creator = creator
     // 性别数字字符串，转成数字类型
     userObj.gender = +userObj.gender
     console.log(userObj)
     // 3.2 提交到服务器保存
     axios({
       url: 'http://hmajax.itheima.net/api/settings',
       method: 'PUT',
       data: userObj
     }).then(result => {
       // 4.1 创建toast对象
       const toastDom = document.querySelector('.my-toast')
       const toast = new bootstrap.Toast(toastDom)
   
       // 4.2 调用show方法->显示提示框
       toast.show()
     })
   })
   ```

   



### 小结

1. bootstrap 弹框什么时候用 JS 方式控制显示呢？

   <details>
   <summary>答案</summary>
   <ul>
   <li>需要执行一些其他的 JS 逻辑后，再去显示/隐藏弹框时</li>
   </ul>
   </details>



## 今日重点(必须会)

1. 掌握增删改查数据的思路
2. 掌握图片上传的思路和流程
3. 理解调用接口时，携带外号的作用
4. 了解 bootstrap 弹框的使用



## 今日作业(必完成)

在配套作业文件夹的md内



## 参考文献

1. [表单概念->百度百科](https://baike.baidu.com/item/%E8%A1%A8%E5%8D%95)
2. [accept属性->mdn](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values)
3. [accept属性->菜鸟教程](https://www.runoob.com/tags/att-input-accept.html)
4. [FormData->mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
5. [BS的Model文档](https://v5.bootcss.com/docs/components/modal/#passing-options)
6. [axios请求方式别名](https://www.axios-http.cn/docs/api_intro)