---
title: "AJAX 学习笔记（Day 01）：入门"
date: 2025-11-17 08:39:07
tags:
  - "AJAX"
  - "入门"
  - "前后端交互"
categories:
  - "前端开发"
  - "AJAX"
---

# Day01_AJAX入门 - 从0到1掌握前后端通信 🚀

## 🎬 开场故事：小王的烦恼

**小王是个前端新手**，他做了个体温登记表单，但发现一个问题：

> 每次提交数据都要**刷新整个页面**，用户体验特别差！
> 
> 领导说："小王啊，能不能像 Gmail 那样，提交数据不刷新页面？"

**小王陷入了沉思**... 🤔

**这时，AJAX 如同救星般出现了！**

---

## 🎯 本节课你将学到什么？

| 学习阶段 | 具体技能 | 成就感等级 |
|----------|----------|------------|
| **阶段1** | 理解AJAX概念和作用 | ⭐⭐ |
| **阶段2** | 发送第一个AJAX请求 | ⭐⭐⭐ |
| **阶段3** | 获取并展示服务器数据 | ⭐⭐⭐⭐ |
| **阶段4** | 完成省份查询小项目 | ⭐⭐⭐⭐⭐ |

> 💡 **学习承诺**：跟着本教程，**2小时内**你就能独立完成一个AJAX应用！

## 第一章：AJAX概念 - 小王的解决方案 💡

### 🎯 1.1 小王的探索之旅

小王开始研究**"不刷新页面提交数据"**的方法，他发现：

#### 传统网页的问题（小王原来的做法）
```
用户填写表单 → 点击提交 → 浏览器刷新整个页面 → 显示结果
         ↑                                    ↓
    页面白屏等待                    整个页面重新加载
```

**问题分析**：
- ❌ 用户体验差：页面闪烁、白屏
- ❌ 浪费资源：重新加载整个页面
- ❌ 丢失状态：页面滚动位置、临时数据都没了

#### AJAX解决方案（小王发现的新方法）
```
用户填写表单 → 点击提交 → JavaScript在后台发送请求 → 局部更新页面
         ↑                                      ↓
    页面保持不变                    只更新需要改变的部分
```

**优势分析**：
- ✅ 用户体验好：页面不闪烁、响应快
- ✅ 节省资源：只传输需要的数据
- ✅ 保持状态：页面其他部分不受影响

### 🎮 1.2 互动演示：体验AJAX的神奇

**【建议实际操作】** 打开以下网站，体验AJAX效果：

1. **Gmail** - 发送邮件时不刷新页面
2. **Google搜索** - 输入时自动出现建议
3. **淘宝购物车** - 添加商品时页面不刷新

> 💡 **观察要点**：注意页面是否刷新？数据如何更新？

### 📚 1.3 AJAX技术解析

#### 什么是AJAX？
**AJAX** = **A**synchronous **J**avaScript **A**nd **X**ML

| 组成部分 | 作用 | 现代替代 |
|----------|------|----------|
| **Asynchronous** 异步 | 不阻塞页面其他操作 | 仍然是核心 |
| **JavaScript** | 实现交互逻辑 | 仍然是核心 |
| **XML** 数据格式 | 早期数据传输格式 | **JSON**（更轻量）|

#### AJAX工作原理（图解）
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   用户操作   │ → │ JavaScript  │ → │  发送请求    │
│  (点击按钮)  │    │   代码执行   │    │  (不刷新)   │
└─────────────┘    └─────────────┘    └─────────────┘
       ↑                    ↓                    ↓
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  更新页面    │ ← │  处理响应    │ ← │  接收数据    │
│  (局部更新)  │    │   JSON解析   │    │  (异步返回)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

#### 现代AJAX技术栈

```js
// 早期：XMLHttpRequest（原生）
const xhr = new XMLHttpRequest()

// 现在：axios（封装库）- 推荐！
axios({ url: '/api/data' })

// 新兴：fetch（原生Promise）
fetch('/api/data')
```

### 🏆 1.4 学习AJAX的实际价值

#### 职业发展
- **面试必备**：95%的前端岗位面试都会问AJAX
- **项目刚需**：现代Web应用几乎离不开AJAX
- **技能进阶**：为学习Vue/React等框架打基础

#### 薪资影响
| 技能水平 | 典型薪资 | AJAX掌握程度 |
|----------|----------|---------------|
| 初级前端 | 8-15K | 基本使用axios |
| 中级前端 | 15-25K | 理解原理+错误处理 |
| 高级前端 | 25K+ | 性能优化+架构设计 |

#### 项目应用
- **管理系统**：增删改查不刷新页面
- **社交平台**：实时消息、动态加载
- **电商平台**：购物车、搜索建议
- **教育平台**：在线答题、进度保存

## 第二章：学前准备 - 技能检测站 🧪

### 🎯 2.1 学习前的自我检测

> 📊 **统计表明**：具备以下基础的同学，学习AJAX的成功率提升85%！

#### 🧩 基础技能清单（必须掌握）

**✅ JavaScript基础语法**
```js
// 你能看懂这些代码吗？
let name = "张三";
let age = 18;
let user = { name, age };  // ES6对象简写
let users = [{ name: "张三" }, { name: "李四" }];

// 数组方法
let names = users.map(user => user.name);  // ["张三", "李四"]
let nameStr = names.join(", ");  // "张三, 李四"
```

**✅ DOM操作基础**
```js
// 你能完成这些DOM操作吗？
document.querySelector("#app");                    // 获取元素
document.querySelector("#app").innerHTML = "内容";  // 设置内容
document.querySelector("#app").classList.add("active"); // 添加类名
```

**✅ 事件处理基础**
```js
// 你能给按钮添加点击事件吗？
document.querySelector("button").addEventListener("click", function() {
  alert("按钮被点击了！");
});
```

#### 🎮 互动测试：30秒自测

**【实战测试】** 请用30秒完成以下题目：

**题目1**：如何获取input输入框的值？
```html
<input type="text" id="username" value="张三">
<script>
  // 你的代码：获取input的值
  let value = __________________________;
  console.log(value); // 应该输出"张三"
</script>
```

<details>
<summary>👀 点击查看答案</summary>

```js
let value = document.querySelector("#username").value;
```
</details>

**题目2**：如何将数组渲染成HTML列表？
```js
let fruits = ["苹果", "香蕉", "橙子"];
// 你的代码：生成<li>苹果</li><li>香蕉</li><li>橙子</li>
let html = __________________________;
console.log(html);
```

<details>
<summary>👀 点击查看答案</summary>

```js
let html = fruits.map(fruit => `<li>${fruit}</li>`).join("");
```
</details>

#### 📊 能力评估结果

| 正确题数 | 建议行动 | 预计学习时间 |
|----------|----------|--------------|
| **2题全对** | ✅ 直接开始学习AJAX | 2小时 |
| **对1题** | ⚠️ 快速复习DOM操作 | 2.5小时 |
| **0题对** | 📚 先学习JS基础 | 建议延期学习 |

### 🛠️ 2.2 环境准备检查清单

#### 开发工具准备
- [ ] **代码编辑器**：VS Code（推荐）或其他编辑器
- [ ] **浏览器**：Chrome（推荐）或其他现代浏览器
- [ ] **网络连接**：能够访问在线API接口

#### 基础知识储备
- [ ] **HTML基础**：了解基本标签和结构
- [ ] **CSS基础**：了解基本样式设置
- [ ] **JavaScript基础**：了解变量、函数、数组、对象

> 💡 **如果基础薄弱怎么办？**
> 1. 先学习免费的JavaScript入门教程
> 2. 跟随MDN文档复习基础知识
> 3. 加入学习群组寻求帮助

## 第三章：学习路线图 - 渐进式 mastery 🗺️

### 🎯 3.1 本节课学习路径

```
🚀 第1步：概念理解（15分钟）
    ↓
⚡ 第2步：工具准备（10分钟）  
    ↓
🎯 第3步：第一个请求（30分钟）
    ↓
🔧 第4步：数据处理（25分钟）
    ↓
💪 第5步：实战项目（40分钟）
    ↓
🏆 第6步：总结提升（10分钟）
```

### 📋 3.2 详细内容安排

#### 🎯 第一阶段：概念扫清（15分钟）
- **AJAX是什么？** - 用故事理解概念
- **为什么要学？** - 实际应用场景
- **技术原理** - 图解工作流程

#### ⚡ 第二阶段：工具准备（10分钟）
- **axios介绍** - 为什么选择它
- **环境搭建** - 引入库的3种方式
- **Hello World** - 发送第一个请求

#### 🎯 第三阶段：核心技能（30分钟）
- **GET请求** - 获取省份数据
- **数据处理** - JSON解析和展示
- **错误处理** - 异常情况处理

#### 🔧 第四阶段：进阶应用（25分钟）
- **查询参数** - 带条件获取数据
- **URL结构** - 理解网址组成
- **POST请求** - 提交数据到服务器

#### 💪 第五阶段：项目实战（40分钟）
- **省份城市查询** - 完整小项目
- **用户登录功能** - 综合案例
- **表单序列化** - 简化数据收集

#### 🏆 第六阶段：总结提升（10分钟）
- **知识回顾** - 重点总结
- **面试要点** - 常见面试题
- **下一步学习** - 进阶方向

### ⏰ 3.3 时间分配建议

| 时间段 | 学习内容 | 建议休息 |
|--------|----------|----------|
| **0-30分钟** | 概念+工具+第一个请求 | 每15分钟休息1分钟 |
| **30-60分钟** | 数据处理+查询参数 | 30分钟时休息5分钟 |
| **60-90分钟** | POST请求+项目实战 | 60分钟时休息10分钟 |
| **90-130分钟** | 完整项目开发 | 每30分钟休息5分钟 |

> 💡 **番茄工作法**：建议25分钟学习+5分钟休息，保持高效专注

## 第四章：axios入门 - 你的第一个AJAX请求 🎯

### 🎯 4.1 学习目标

**本节结束后，你将能够：**
- ✅ 成功引入axios库
- ✅ 发送你的第一个GET请求  
- ✅ 获取并显示服务器数据
- ✅ 处理请求错误

### 🛠️ 4.2 环境搭建 - 3种方式引入axios

#### 方式1：CDN引入（最适合新手）
```html
<!DOCTYPE html>
<html>
<head>
    <title>AJAX学习</title>
</head>
<body>
    <!-- 你的HTML内容 -->
    
    <!-- ✅ 步骤1：引入axios -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    
    <!-- ✅ 步骤2：写你的代码 -->
    <script>
        // 这里可以开始使用axios了！
        console.log('axios加载成功！', typeof axios);
    </script>
</body>
</html>
```

> 💡 **验证方法**：打开控制台，如果看到"axios加载成功！object"，说明引入成功！

#### 方式2：本地文件（适合离线学习）
```html
<!-- 1. 先下载axios文件到本地 -->
<!-- 2. 然后这样引入： -->
<script src="./js/axios.min.js"></script>
```

#### 方式3：npm安装（适合项目开发）
```bash
# 在项目目录下运行
npm install axios

# 然后在代码中引入
import axios from 'axios';
```

### 🚀 4.3 发送第一个请求 - 手把手教学

#### 步骤1：创建基础HTML页面
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个AJAX请求</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .container { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .province-item { padding: 8px; margin: 4px 0; background: white; border-radius: 4px; }
        .loading { color: #666; font-style: italic; }
        .error { color: red; background: #ffe6e6; padding: 10px; border-radius: 4px; }
        .success { color: green; background: #e6ffe6; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 中国省份查询系统</h1>
        <p>这是你的第一个AJAX应用！</p>
        
        <button id="loadBtn" onclick="loadProvinces()">📥 加载省份数据</button>
        <button id="clearBtn" onclick="clearData()">🗑️ 清空数据</button>
        
        <div id="status"></div>
        <div id="result"></div>
    </div>

    <!-- ✅ 引入axios -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    
    <!-- ✅ 你的代码 -->
    <script>
        // 加载省份数据函数
        function loadProvinces() {
            console.log('🚀 开始加载数据...');
            
            // 显示加载状态
            document.getElementById('status').innerHTML = '<div class="loading">⏳ 正在加载数据，请稍候...</div>';
            
            // ✅ 发送AJAX请求
            axios({
                url: 'http://hmajax.itheima.net/api/province',
                method: 'GET'  // 获取数据用GET
            }).then(response => {
                console.log('✅ 请求成功！', response);
                handleSuccess(response.data);
            }).catch(error => {
                console.log('❌ 请求失败！', error);
                handleError(error);
            });
        }
        
        // 处理成功响应
        function handleSuccess(data) {
            // 清除状态信息
            document.getElementById('status').innerHTML = '<div class="success">✅ 数据加载成功！</div>';
            
            // 提取省份列表
            const provinces = data.list;
            console.log('📊 省份数据：', provinces);
            
            // 生成HTML
            let html = '<h3>📍 中国省份列表（共' + provinces.length + '个）</h3>';
            html += '<div>';
            provinces.forEach((province, index) => {
                html += `<div class="province-item">
                    <strong>${index + 1}.</strong> ${province}
                </div>`;
            });
            html += '</div>';
            
            // 显示结果
            document.getElementById('result').innerHTML = html;
            
            // 3秒后隐藏成功消息
            setTimeout(() => {
                document.getElementById('status').innerHTML = '';
            }, 3000);
        }
        
        // 处理错误响应
        function handleError(error) {
            let errorMsg = '请求失败：';
            
            if (error.response) {
                // 服务器响应了，但状态码不是2xx
                errorMsg += `服务器返回错误 - 状态码：${error.response.status}`;
            } else if (error.request) {
                // 请求发送了，但没有收到响应
                errorMsg += '网络连接失败，请检查网络';
            } else {
                // 其他错误
                errorMsg += error.message;
            }
            
            document.getElementById('status').innerHTML = `<div class="error">❌ ${errorMsg}</div>`;
            document.getElementById('result').innerHTML = '';
        }
        
        // 清空数据
        function clearData() {
            document.getElementById('status').innerHTML = '';
            document.getElementById('result').innerHTML = '';
            console.log('🗑️ 数据已清空');
        }
        
        // 页面加载完成后的提示
        console.log('🎉 页面加载完成！点击"加载省份数据"按钮开始你的第一个AJAX请求！');
    </script>
</body>
</html>
```

### 🎯 4.4 代码解析 - 每一行都有解释

#### axios请求的基本结构
```js
axios({
    url: 'http://hmajax.itheima.net/api/province',  // 请求地址
    method: 'GET'                                   // 请求方法
}).then(response => {
    // ✅ 成功时的处理
    console.log('服务器返回的数据：', response.data);
}).catch(error => {
    // ❌ 失败时的处理  
    console.log('出错了：', error);
});
```

#### 响应数据的结构
```js
// 服务器返回的数据格式
{
    data: {
        list: ["北京市", "天津市", "河北省", ...],
        message: "获取成功"
    },
    status: 200,
    statusText: "OK"
}

// 提取有用数据
const provinces = response.data.list;  // 获取省份数组
```

### 💡 4.5 调试技巧 - 新手必看

#### 🔍 使用浏览器开发者工具
1. **F12打开控制台** - 查看console.log输出
2. **Network面板** - 监控网络请求
3. **Elements面板** - 检查HTML元素

#### 🚨 常见错误及解决

| 错误现象 | 可能原因 | 解决方法 |
|----------|----------|----------|
| **axios未定义** | 没引入axios库 | 检查`<script>`标签是否正确 |
| **跨域错误** | 浏览器安全限制 | 使用支持的API地址 |
| **404错误** | 地址写错了 | 检查URL是否正确 |
| **网络超时** | 网络连接问题 | 检查网络连接 |

#### ✅ 成功验证清单
- [ ] 点击按钮后显示"正在加载"
- [ ] Network面板能看到请求发送
- [ ] 控制台打印出返回的数据
- [ ] 页面上正确显示省份列表
- [ ] 没有红色的错误信息

> 🎉 **恭喜你！** 到这里，你已经成功发送了第一个AJAX请求！你已经超越了50%的前端初学者！

     ![image-20230403173156484](images/image-20230403173156484.png)

2. 什么是服务器？

   * 可以暂时理解为提供数据的一台电脑

3. 为何学 AJAX ?

   * 以前我们的数据都是写在代码里固定的, 无法随时变化
   * 现在我们的数据可以从服务器上进行获取，让数据变活

4. 怎么学 AJAX ?

   * 这里使用一个第三方库叫 axios, 后续在学习 XMLHttpRequest 对象了解 AJAX 底层原理
   * 因为 axios 库语法简单，让我们有更多精力关注在与服务器通信上，而且后续 Vue，React 学习中，也使用 axios 库与服务器通信

5. 需求：从服务器获取省份列表数据，展示到页面上（体验 axios 语法的使用）

   > 获取省份列表数据 - 目标资源地址：http://hmajax.itheima.net/api/province

   * 完成效果：

     ![image-20230220113157010](images/image-20230220113157010.png)

6. 接下来讲解 axios 语法，步骤：

  1. 引入 axios.js 文件到自己的网页中

     > axios.js文件链接: https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js

  2. 明确axios函数的使用语法

     ```js
     axios({
       url: '目标资源地址'
     }).then((result) => {
       // 对服务器返回的数据做后续处理
     })
     ```

     > 注意：请求的 url 地址, 就是标记资源的网址
     >
     > 注意：then 方法这里先体验使用，由来后续会讲到



7. 对应代码

  ```html
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJAX概念和axios使用</title>
  </head>

  <body>
    <!--
      axios库地址：https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
      省份数据地址：http://hmajax.itheima.net/api/province

      目标: 使用axios库, 获取省份列表数据, 展示到页面上
      1. 引入axios库
    -->
    <p class="my-p"></p>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      // 2. 使用axios函数
      axios({
        url: 'http://hmajax.itheima.net/api/province'
      }).then(result => {
        console.log(result)
        // 好习惯：多打印，确认属性名
        console.log(result.data.list)
        console.log(result.data.list.join('<br>'))
        // 把准备好省份列表，插入到页面
        document.querySelector('.my-p').innerHTML = result.data.list.join('<br>')
      })
    </script>
  </body>

  </html>
````

### 🎉 恭喜你完成了第一个AJAX请求！

**你已经学会了：**
- ✅ 引入axios库
- ✅ 发送GET请求
- ✅ 获取服务器数据
- ✅ 将数据显示到页面

**下一步我们要学习：** URL和查询参数的使用！

## 第2章：认识URL和查询参数 🔗

### 2.1 URL是什么？（网址的组成）

**URL就像现实生活中的地址一样**，告诉浏览器去哪里找资源。

**URL的组成**（记住这3个就够用了）：
```
http://hmajax.itheima.net/api/province
└─┘ └──────────────┘ └────────┘
协议      域名         资源路径
```

| 部分 | 作用 | 例子 |
|------|------|------|
| **协议** | 通信规则 | http:// 或 https:// |
| **域名** | 服务器地址 | hmajax.itheima.net |
| **路径** | 具体资源位置 | /api/province |

### 2.2 查询参数是什么？

**查询参数 = 给服务器的额外信息**

**生活中的例子**：
- 你去餐厅点餐："我要一份肯德基**全家桶**"
- 这里的"全家桶"就是查询参数，告诉服务员你要的具体是什么

**语法格式**：
```
网址?参数名1=值1&参数名2=值2
```

**实际例子**：
```
# 获取河北省的城市列表
http://hmajax.itheima.net/api/city?pname=河北省

# 获取河北省石家庄市的所有地区
http://hmajax.itheima.net/api/area?pname=河北省&cname=石家庄市
```

### 2.3 动手实践：查询城市列表

**需求**：根据省份名称，查询该省的所有城市

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>查询城市列表</title>
</head>
<body>
    <h2>请选择省份查看城市</h2>
    <select id="province">
        <option value="">请选择省份</option>
        <option value="河北省">河北省</option>
        <option value="辽宁省">辽宁省</option>
        <option value="山东省">山东省</option>
    </select>
    
    <div id="city-list"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        // 当选择省份时，查询对应的城市
        document.getElementById('province').addEventListener('change', function() {
            const pname = this.value;
            if (!pname) return;
            
            // 使用查询参数获取城市列表
            axios({
                url: 'http://hmajax.itheima.net/api/city',
                params: {
                    pname: pname  // 这就是查询参数！
                }
            }).then(result => {
                const cities = result.data.list;
                const html = cities.map(city => `<p>🏙️ ${city}</p>`).join('');
                document.getElementById('city-list').innerHTML = html;
            });
        });
    </script>
</body>
</html>
```

## 第五章：恭喜你！第一阶段完成 🎉

### 🏆 5.1 你现在已经掌握了

✅ **AJAX基本概念** - 理解异步通信的原理
✅ **axios使用方法** - 会发送GET请求
✅ **数据处理技能** - 会解析JSON并显示到页面
✅ **错误处理能力** - 会处理请求失败的情况
✅ **调试技巧** - 会使用控制台和网络面板

### 📊 5.2 学习进度评估

#### 🎯 自我检测清单
- [ ] 我能解释什么是AJAX，为什么要用它
- [ ] 我会引入axios库到HTML页面
- [ ] 我能写出完整的axios请求代码
- [ ] 我会处理请求成功和失败的情况
- [ ] 我能把获取的数据展示在页面上

#### 🏅 成就解锁
- 🎯 **【AJAX新手】** 成就 - 发送第一个请求
- 🔄 **【数据获取者】** 成就 - 成功获取服务器数据
- 💪 **【错误处理者】** 成就 - 处理请求错误
- 🎨 **【界面美化师】** 成就 - 数据可视化展示

### 🚀 5.3 下一步学习计划

#### 立即行动（建议今天完成）
1. **练习**：修改代码，获取城市数据而不是省份数据
2. **挑战**：尝试显示天气信息
3. **分享**：把你的第一个AJAX项目发给朋友看

#### 进阶学习（明天继续）
1. **查询参数**：学习如何带条件请求数据
2. **POST请求**：学习如何提交数据到服务器
3. **综合项目**：完成省份城市联动查询

> 💡 **学习建议**：不要急着往下学，先把今天的知识完全掌握。建议自己独立重写一遍代码，确保真正理解！

---

## 📚 附录：学习资源

### 🔗 推荐学习网站
- [MDN AJAX教程](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX) - 权威文档
- [axios官方文档](https://axios-http.com/) - 详细API说明
- [菜鸟教程AJAX](https://www.runoob.com/ajax/ajax-tutorial.html) - 中文入门

### 📖 相关概念预习
- **Promise**：axios返回的是Promise对象
- **异步编程**：理解JavaScript的异步执行机制
- **HTTP协议**：了解请求方法(GET/POST等)

### ❓ 常见问题解答

**Q1: 为什么我的请求报404错误？**
A: 检查URL是否正确，确认API地址可用

**Q2: 跨域错误怎么解决？**
A: 使用支持CORS的API，或配置代理服务器

**Q3: axios和fetch有什么区别？**
A: axios更简单易用，自动处理JSON转换

**Q4: 学习AJAX需要多长时间？**
A: 基础使用1-2天，熟练掌握1-2周

---

**🎯 恭喜完成Day01学习！你已经踏出了成为前端工程师的重要一步！**

**明天见，我们将学习更强大的AJAX技能！** 💪

9. 什么是资源路径 ?

   - 一个服务器内有多个资源，用于标识你要访问的资源具体的位置

     ![image-20230403185428276](images/image-20230403185428276.png)

10. 接下来做个需求，访问新闻列表的 URL 网址，打印新闻数据

    - 效果图如下：

    ![image-20230220122455915](images/image-20230220122455915.png)

    > 新闻列表数据 URL 网址：http://hmajax.itheima.net/api/news

    ```js
    axios({
      url: "http://hmajax.itheima.net/api/news",
    }).then((result) => {
      console.log(result);
    });
    ```

    > url 解释：从黑马服务器使用 http 协议，访问/api/news 路径下的新闻列表资源

### 小结

1. URL 是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>统一资源定位符，网址，用于访问服务器上资源
   </li>
   </ul>
   </details>

2. 请解释这个 URL，每个部分作用？

   http://hmajax.itheima.net/api/news

   <details>
   <summary>答案</summary>
   <ul>
   <li>协议://域名/资源路径
   </li>
   </ul>
   </details>

### 4.2 HTTP 请求方法

#### 常用请求方法

1. GET：获取资源
2. POST：创建资源
3. PUT：更新资源
4. DELETE：删除资源
5. PATCH：部分更新

#### 请求方法特点

1. GET
   - 参数通过 URL 传递
   - 有长度限制
   - 可被缓存
2. POST
   - 参数在请求体中
   - 无长度限制
   - 更安全
   - 不可被缓存

## 五、实战案例

### 5.1 登录注册功能实现

#### 功能需求

1. 用户输入用户名和密码
2. 点击登录按钮发送请求
3. 处理响应结果
4. 登录成功跳转首页

#### 代码实现

```js
// 1. 获取表单数据
const loginForm = document.querySelector(".login-form");
const formData = new FormData(loginForm);

// 2. 发送登录请求
axios({
  url: "/api/login",
  method: "post",
  data: {
    username: formData.get("username"),
    password: formData.get("password"),
  },
})
  .then((res) => {
    if (res.data.code === 200) {
      // 登录成功
      localStorage.setItem("token", res.data.token);
      window.location.href = "/index.html";
    }
  })
  .catch((err) => {
    console.error("登录失败:", err);
  });
```



2. 查询参数的语法 ？

   - 在 url 网址后面用?拼接格式：http://xxxx.com/xxx/xxx?参数名1=值1&参数名2=值2
   - 参数名一般是后端规定的，值前端看情况传递即可

3. axios 如何携带查询参数?

   - 使用 params 选项即可

     ```js
     axios({
       url: "目标资源地址",
       params: {
         参数名: 值,
       },
     }).then((result) => {
       // 对服务器返回的数据做后续处理
     });
     ```

     > 查询城市列表的 url 地址：[http://hmajax.itheima.net/api/city](http://hmajax.itheima.net/api/city?pname=河北省)
     >
     > 参数名：pname （值要携带省份名字）

4. 需求：获取“河北省”下属的城市列表，展示到页面，对应代码：

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>查询参数</title>
     </head>
     <body>
       <!-- 
       城市列表: http://hmajax.itheima.net/api/city
       参数名: pname
       值: 省份名字
     -->
       <p></p>
       <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
       <script>
         axios({
           url: "http://hmajax.itheima.net/api/city",
           // 查询参数
           params: {
             pname: "辽宁省",
           },
         }).then((result) => {
           console.log(result.data.list);
           document.querySelector("p").innerHTML =
             result.data.list.join("<br>");
         });
       </script>
     </body>
   </html>
   ```

### 小结

1. URL 查询参数有什么用？

   <details>
   <summary>答案</summary>
   <ul>
   <li>浏览器提供给服务器额外信息，获取对应的数据
   </li>
   </ul>
   </details>

2. axios 要如何携带查询参数？

   <details>
   <summary>答案</summary>
   <ul>
   <li>使用 params 选项，携带参数名和值在对象结构中
   </li>
   </ul>
   </details>

## 04.案例-查询-地区列表

### 目标

巩固查询参数的使用，并查看多对查询参数如何传递

### 讲解

1. 需求：根据输入的省份名字和城市名字，查询下属地区列表

   - 完成效果如下：

     ![image-20230220125428695](images/image-20230220125428695.png)

   - 相关参数

     > 查询地区: http://hmajax.itheima.net/api/area
     >
     > 参数名：
     >
     > pname：省份名字
     >
     > cname：城市名字

2. 正确代码如下：

   ```js
   /*
         获取地区列表: http://hmajax.itheima.net/api/area
         查询参数:
           pname: 省份或直辖市名字
           cname: 城市名字
       */
   // 目标: 根据省份和城市名字, 查询地区列表
   // 1. 查询按钮-点击事件
   document.querySelector(".sel-btn").addEventListener("click", () => {
     // 2. 获取省份和城市名字
     let pname = document.querySelector(".province").value;
     let cname = document.querySelector(".city").value;
   
     // 3. 基于axios请求地区列表数据
     axios({
       url: "http://hmajax.itheima.net/api/area",
       params: {
         pname,
         cname,
       },
     }).then((result) => {
       // console.log(result)
       // 4. 把数据转li标签插入到页面上
       let list = result.data.list;
       console.log(list);
       let theLi = list
         .map((areaName) => `<li class="list-group-item">${areaName}</li>`)
         .join("");
       console.log(theLi);
       document.querySelector(".list-group").innerHTML = theLi;
     });
   });
   ```

### 小结

1. ES6 对象属性和值简写的前提是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>当属性名和value位置变量名同名即可简写
   </li>
   </ul>
   </details>

## 05.常用请求方法和数据提交

### 目标

掌握如何向服务器提交数据，而不单单是获取数据

### 讲解

1. 想要提交数据，先来了解什么是请求方法

   - 请求方法是一些固定单词的英文，例如：GET，POST，PUT，DELETE，PATCH（这些都是 http 协议规定的），每个单词对应一种对服务器资源要执行的操作

     ![image-20230220130833363](images/image-20230220130833363.png)

     ![image-20230404104319428](images/image-20230404104319428.png)

   - 前面我们获取数据其实用的就是 GET 请求方法，但是 axios 内部设置了默认请求方法就是 GET，我们就没有写

   - 但是提交数据需要使用 POST 请求方法

2. 什么时候进行数据提交呢？

   - 例如：多端要查看同一份订单数据，或者使用同一个账号进行登录，那订单/用户名+密码，就需要保存在服务器上，随时随地进行访问

     ![image-20230404104328384](images/image-20230404104328384.png)

     ![image-20230404104333584](images/image-20230404104333584.png)

3. axios 如何提交数据到服务器呢？

   - 需要学习，method 和 data 这 2 个新的选项了（大家不用担心，这 2 个学完，axios 常用的选项就都学完了）

     ```js
     axios({
       url: "目标资源地址",
       method: "请求方法",
       data: {
         参数名: 值,
       },
     }).then((result) => {
       // 对服务器返回的数据做后续处理
     });
     ```

4. 需求：注册账号，提交用户名和密码到服务器保存

   > 注册用户 URL 网址：http://hmajax.itheima.net/api/register
   >
   > 请求方法：POST
   >
   > 参数名：
   >
   > username：用户名（要求中英文和数字组成，最少 8 位）
   >
   > password：密码（最少 6 位）

   ![image-20230404104350387](images/image-20230404104350387.png)

5. 正确代码如下：

   ```js
   /*
     注册用户：http://hmajax.itheima.net/api/register
     请求方法：POST
     参数名：
       username：用户名（中英文和数字组成，最少8位）
       password：密码  （最少6位）
   
     目标：点击按钮，通过axios提交用户和密码，完成注册
   */
   document.querySelector(".btn").addEventListener("click", () => {
     axios({
       url: "http://hmajax.itheima.net/api/register",
       method: "POST",
       data: {
         username: "itheima007",
         password: "7654321",
       },
     });
   });
   ```

### 小结

1. 请求方法最常用的是哪 2 个，分别有什么作用？

   <details>
   <summary>答案</summary>
   <ul>
   <li>POST 提交数据，GET 查询数据
   </li>
   </ul>
   </details>

2. axios 的核心配置项？

   <details>
   <summary>答案</summary>
   <ul>
   <li>url：目标资源地址，method：请求方法，params：查询参数，data：提交的数据
   </li>
   </ul>
   </details>

## 06.axios 错误处理

### 目标

掌握接收 axios 响应错误信息的处理语法

### 讲解

1. 如果注册相同的用户名，则会遇到注册失败的请求，也就是 axios 请求响应失败了，你会在控制台看到如图的错误：

   ![image-20230220131753051](images/image-20230220131753051.png)

2. 在 axios 语法中要如何处理呢？

   - 因为，普通用户不会去控制台里看错误信息，我们要编写代码拿到错误并展示给用户在页面上

3. 使用 axios 的 catch 方法，捕获这次请求响应的错误并做后续处理，语法如下：

   ```js
   axios({
     // ...请求选项
   })
     .then((result) => {
       // 处理成功数据
     })
     .catch((error) => {
       // 处理失败错误
     });
   ```

4. 需求：再次重复注册相同用户名，提示用户注册失败的原因

   ![image-20230404104440224](images/image-20230404104440224.png)

   ![image-20230404104447501](images/image-20230404104447501.png)

5. 对应代码

   ```js
   document.querySelector(".btn").addEventListener("click", () => {
     axios({
       url: "http://hmajax.itheima.net/api/register",
       method: "post",
       data: {
         username: "itheima007",
         password: "7654321",
       },
     })
       .then((result) => {
         // 成功
         console.log(result);
       })
       .catch((error) => {
         // 失败
         // 处理错误信息
         console.log(error);
         console.log(error.response.data.message);
         alert(error.response.data.message);
       });
   });
   ```

### 小结

1. axios 如何拿到请求响应失败的信息？

   <details>
   <summary>答案</summary>
   <ul>
   <li>通过 axios 函数调用后，在后面接着调用 .catch 方法捕获
   </li>
   </ul>
   </details>

## 07.HTTP 协议-请求报文

### 目标

了解 HTTP 协议中，请求报文的组成和作用

### 讲解

1. 首先，HTTP 协议规定了浏览器和服务器返回内容的<span style="color: red;">格式</span>

2. 请求报文：是浏览器按照协议规定发送给服务器的内容，例如刚刚注册用户时，发起的请求报文：

   ![image-20230404104508764](images/image-20230404104508764.png)

   ![image-20230220132229960](images/image-20230220132229960.png)

3. 这里的格式包含：

   - 请求行：请求方法，URL，协议
   - 请求头：以键值对的格式携带的附加信息，比如：Content-Type（指定了本次传递的内容类型）
   - 空行：分割请求头，空行之后的是发送给服务器的资源
   - 请求体：发送的资源

4. 我们切换到浏览器中，来看看刚才注册用户发送的这个请求报文以及内容去哪里查看呢

5. 代码：直接在上个代码基础上复制，然后运行查看请求报文对应关系即可

### 小结

1. 浏览器发送给服务器的内容叫做，请求报文

2. 请求报文的组成是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>请求行，请求头，空行，请求体
   </li>
   </ul>
   </details>

3. 通过 Chrome 的网络面板如何查看请求体？

   ![image-20230220132617016](images/image-20230220132617016.png)

## 08.请求报文-错误排查

### 目标

了解学习了查看请求报文之后的作用，可以用来辅助错误排查

### 讲解

1. 学习了查看请求报文有什么用呢？
   - 可以用来确认我们代码发送的请求数据是否真的正确
2. 配套模板代码里，对应 08 标题文件夹里是我同桌的代码，它把登录也写完了，但是无法登录，我们来到模板代码中，找到运行后，在<span style="color: red;">不逐行查看代码的情况下</span>，查看请求报文，看看它登录提交的相关信息对不对，帮他找找问题出现的原因
3. 发现请求体数据有问题，往代码中定位，找到类名写错误了
4. 代码：在配套文件夹素材里，找到需要对应代码，直接运行，根据报错信息，找到错误原因

### 小结

1. 学会了查看请求报文，对实际开发有什么帮助呢？

   <details>
   <summary>答案</summary>
   <ul>
   <li>可以快速确认我们发送的内容是否正确
   </li>
   </ul>
   </details>

## 09.HTTP 协议-响应报文

### 目标

了解响应报文的组成

### 讲解

1. 响应报文：是服务器按照协议固定的格式，返回给浏览器的内容

   ![image-20230404104556531](images/image-20230404104556531.png)

   ![image-20230220133141151](images/image-20230220133141151.png)

2. 响应报文的组成：

   - 响应行（状态行）：协议，HTTP 响应状态码，状态信息
   - 响应头：以键值对的格式携带的附加信息，比如：Content-Type（告诉浏览器，本次返回的内容类型）
   - 空行：分割响应头，控制之后的是服务器返回的资源
   - 响应体：返回的资源

3. HTTP 响应状态码：

   - 用来表明请求是否成功完成

   - 例如：404（客户端要找的资源，在服务器上不存在）

     ![image-20230220133344116](images/image-20230220133344116.png)

### 小结

1. 响应报文的组成？

   <details>
   <summary>答案</summary>
   <ul>
   <li>响应行，响应头，空行，响应体
   </li>
   </ul>
   </details>

2. HTTP 响应状态码是做什么的？

   <details>
   <summary>答案</summary>
   <ul>
   <li>表明请求是否成功完成，2xx都是成功的
   </li>
   </ul>
   </details>

## 10.接口文档

### 目标

掌握接口文档的使用，配合 axios 与服务器进行数据交互

### 讲解

1. 接口文档：描述接口的文章（一般是后端工程师，编写和提供）
2. 接口：指的使用 AJAX 和 服务器通讯时，使用的 URL，请求方法，以及参数，例如：[AJAX 阶段接口文档](https://apifox.com/apidoc/shared-1b0dd84f-faa8-435d-b355-5a8a329e34a8)
3. 例如：获取城市列表接口样子

   ![image-20230404104720587](images/image-20230404104720587.png)

4. 需求：打开 AJAX 阶段接口文档，查看登录接口，并编写代码，完成一次登录的效果吧
5. 代码如下：

   ```js
   document.querySelector(".btn").addEventListener("click", () => {
     // 用户登录
     axios({
       url: "http://hmajax.itheima.net/api/login",
       method: "post",
       data: {
         username: "itheima007",
         password: "7654321",
       },
     });
   });
   ```

### 小结

1. 接口文档是什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>由后端提供的描述接口的文章
   </li>
   </ul>
   </details>

2. 接口文档里包含什么？

   <details>
   <summary>答案</summary>
   <ul>
   <li>请求的 URL 网址，请求方法，请求参数和说明
   </li>
   </ul>
   </details>

## 11.案例-用户登录-主要业务

### 目标

尝试通过页面获取用户名和密码，进行登录

### 讲解

1. 先来到备课代码中，运行完成的页面，查看要完成的登录效果（登录成功和失败）

2. 需求：编写代码，查看接口文档，填写相关信息，完成登录业务

3. 分析实现的步骤

   1. 点击登录，获取并判断用户名和长度

   2. 提交数据和服务器通信

   3. 提示信息，反馈给用户（这节课先来完成前 2 个步骤）

      ![image-20230404104851497](images/image-20230404104851497.png)

4. 代码如下：

   ```js
   // 目标1：点击登录时，用户名和密码长度判断，并提交数据和服务器通信
   
   // 1.1 登录-点击事件
   document.querySelector(".btn-login").addEventListener("click", () => {
     // 1.2 获取用户名和密码
     const username = document.querySelector(".username").value;
     const password = document.querySelector(".password").value;
     // console.log(username, password)
   
     // 1.3 判断长度
     if (username.length < 8) {
       console.log("用户名必须大于等于8位");
       return; // 阻止代码继续执行
     }
     if (password.length < 6) {
       console.log("密码必须大于等于6位");
       return; // 阻止代码继续执行
     }
   
     // 1.4 基于axios提交用户名和密码
     // console.log('提交数据到服务器')
     axios({
       url: "http://hmajax.itheima.net/api/login",
       method: "POST",
       data: {
         username,
         password,
       },
     })
       .then((result) => {
         console.log(result);
         console.log(result.data.message);
       })
       .catch((error) => {
         console.log(error);
         console.log(error.response.data.message);
       });
   });
   ```

### 小结

1. 总结下用户登录案例的思路？

   <details>
   <summary>答案</summary>
   <ul>
   <li>1. 登录按钮-绑定点击事件
   2. 从页面输入框里，获取用户名和密码
   3. 判断长度是否符合要求
   4. 基于 axios 提交用户名和密码
   </li>
   </ul>
   </details>

## 12.案例-用户登录-提示信息

### 目标

根据准备好的提示标签和样式，给用户反馈提示

### 讲解

1. 需求：使用提前准备好的提示框，来把登录成功/失败结果提示给用户

   ![image-20230404104955330](images/image-20230404104955330.png)

   ![image-20230404105003019](images/image-20230404105003019.png)

2. 使用提示框，反馈提示消息，因为有 4 处地方需要提示框，所以封装成函数

   1. 获取提示框

   2. 封装提示框函数，重复调用，满足提示需求

      功能：

      1. 显示提示框
      2. 不同提示文字 msg，和成功绿色失败红色 isSuccess 参数（true 成功，false 失败）
      3. 过 2 秒后，让提示框自动消失

3. 对应提示框核心代码：

   ```js
   /**
    * 2.2 封装提示框函数，重复调用，满足提示需求
    * 功能：
    * 1. 显示提示框
    * 2. 不同提示文字msg，和成功绿色失败红色isSuccess（true成功，false失败）
    * 3. 过2秒后，让提示框自动消失
    */
   function alertFn(msg, isSuccess) {
     // 1> 显示提示框
     myAlert.classList.add("show");
   
     // 2> 实现细节
     myAlert.innerText = msg;
     const bgStyle = isSuccess ? "alert-success" : "alert-danger";
     myAlert.classList.add(bgStyle);
   
     // 3> 过2秒隐藏
     setTimeout(() => {
       myAlert.classList.remove("show");
       // 提示：避免类名冲突，重置背景色
       myAlert.classList.remove(bgStyle);
     }, 2000);
   }
   ```

### 小结

1. 我们什么时候需要封装函数？

   <details>
   <summary>答案</summary>
   <ul>
   <li>遇到相同逻辑，重复代码要复用的时候
   </li>
   </ul>
   </details>

2. 如何封装一个函数呢？

   <details>
   <summary>答案</summary>
   <ul>
   <li>先明确要完成的需求，以及需要的参数，再来实现其中的细节，然后在需要的地方调用
   </li>
   </ul>
   </details>

3. 我们的提示框是如何控制出现/隐藏的？

   <details>
   <summary>答案</summary>
   <ul>
   <li>添加或移除显示的类名即可
   </li>
   </ul>
   </details>

## 13.form-serialize 插件

### 目标

使用 form-serialize 插件，快速收集目标表单范围内表单元素的值

### 讲解

1. 我们前面收集表单元素的值，是一个个标签获取的

   ![image-20230404105134538](images/image-20230404105134538.png)

2. 如果一套表单里有很多很多表单元素，如何一次性快速收集出来呢？

   ![image-20230404105141226](images/image-20230404105141226.png)

3. 使用 form-serialize 插件提供的 serialize 函数就可以办到

4. form-serialize 插件语法：

   1. 引入 form-serialize 插件到自己网页中

   2. 使用 serialize 函数

      - 参数 1：要获取的 form 表单标签对象（要求表单元素需要有 name 属性-用来作为收集的数据中属性名）

      - 参数 2：配置对象
        - hash：
          - true - 收集出来的是一个 JS 对象结构
          - false - 收集出来的是一个查询字符串格式
        - empty：
          - true - 收集空值
          - false - 不收集空值

5. 需求：收集登录表单里用户名和密码

6. 对应代码：

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>form-serialize插件使用</title>
     </head>
   
     <body>
       <form action="javascript:;" class="example-form">
         <input type="text" name="username" />
         <br />
         <input type="text" name="password" />
         <br />
         <input type="button" class="btn" value="提交" />
       </form>
       <!-- 
       目标：在点击提交时，使用form-serialize插件，快速收集表单元素值
       1. 把插件引入到自己网页中
     -->
       <script src="./lib/form-serialize.js"></script>
       <script>
         document.querySelector(".btn").addEventListener("click", () => {
           /**
            * 2. 使用serialize函数，快速收集表单元素的值
            * 参数1：要获取哪个表单的数据
            *  表单元素设置name属性，值会作为对象的属性名
            *  建议name属性的值，最好和接口文档参数名一致
            * 参数2：配置对象
            *  hash 设置获取数据结构
            *    - true：JS对象（推荐）一般请求体里提交给服务器
            *    - false: 查询字符串
            *  empty 设置是否获取空值
            *    - true: 获取空值（推荐）数据结构和标签结构一致
            *    - false：不获取空值
            */
           const form = document.querySelector(".example-form");
           const data = serialize(form, { hash: true, empty: true });
           // const data = serialize(form, { hash: false, empty: true })
           // const data = serialize(form, { hash: true, empty: false })
           console.log(data);
         });
       </script>
     </body>
   </html>
   ```

### 小结

1. 我们什么时候使用 form-serialize 插件？

   <details>
   <summary>答案</summary>
   <ul>
   <li>快速收集表单元素的值</li>
   </ul>
   </details>

2. 如何使用 form-serialize 插件？

   <details>
   <summary>答案</summary>
   <ul>
   <li>1. 先引入插件到自己的网页中，2. 准备form和表单元素的name属性，3.使用serialize函数，传入form表单和配置对象
   </li>
   </ul>
   </details>

3. 配置对象中 hash 和 empty 有什么用？

   <details>
   <summary>答案</summary>
   <ul>
   <li>hash 决定是收集为 JS 对象还是查询参数字符串，empty 决定是否收集空值
   </li>
   </ul>
   </details>

## 14.案例-用户登录-form-serialize

### 目标

尝试通过 form-serialize 重新修改用户登录案例-收集用户名和密码

### 讲解

1. 基于模板代码，使用 form-serialize 插件来收集用户名和密码
2. 在原来的代码基础上修改即可

   1. 先引入插件

      ```html
      <!-- 3.1 引入插件 -->
      <script src="./lib/form-serialize.js"></script>
      ```

   2. 然后修改代码

      ```js
      // 3.2 使用serialize函数，收集登录表单里用户名和密码
      const form = document.querySelector(".login-form");
      const data = serialize(form, { hash: true, empty: true });
      console.log(data);
      // {username: 'itheima007', password: '7654321'}
      const { username, password } = data;
      ```

### 小结

1. 如何把一个第三方插件使用在已完成的案例中？

   <details>
   <summary>答案</summary>
   <ul>
   <li>引入后，只需要使用在要修改的地方，修改一点就要确认测试一下
   </li>
   </ul>
   </details>

## 今日重点(必须会)

1. axios 的配置项有哪几个，作用分别是什么？
2. 接口文档都包含哪些信息？
3. 在浏览器中如何查看查询参数/请求体，以及响应体数据？
4. 请求报文和响应报文由几个部分组成，每个部分的作用？

## 今日作业(必完成)

参考作业文件夹的 md 要求

## 参考文献

1. [客户端->百度百科](https://baike.baidu.com/item/%E5%AE%A2%E6%88%B7%E7%AB%AF/101081?fr=aladdin)
2. [浏览器解释->百度百科](https://baike.baidu.com/item/%E6%B5%8F%E8%A7%88%E5%99%A8/213911?fr=aladdin)
3. [服务器解释->百度百科](https://baike.baidu.com/item/%E6%9C%8D%E5%8A%A1%E5%99%A8/100571?fr=aladdin)
4. [url 解释->百度百科](https://baike.baidu.com/item/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E5%AE%9A%E4%BD%8D%E7%B3%BB%E7%BB%9F/5937042?fromtitle=URL&fromid=110640&fr=aladdin)
5. [http 协议->百度百科](https://baike.baidu.com/item/HTTP?fromtitle=HTTP%E5%8D%8F%E8%AE%AE&fromid=1276942)
6. [主机名->百度百科](https://baike.baidu.com/item/%E4%B8%BB%E6%9C%BA%E5%90%8D)
7. [端口号->百度百科](https://baike.baidu.com/item/%E7%AB%AF%E5%8F%A3%E5%8F%B)
8. [Ajax 解释->百度-懂啦](https://baike.baidu.com/tashuo/browse/content?id=11fca6ecdc2c066af4c5594f&lemmaId=8425&fromLemmaModule=pcBottom&lemmaTitle=ajax)
9. [Ajax 解释->MDN 解释 Ajax 是与服务器通信而不只是请求](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX/Getting_Started)
10. [axios->百度(可以点击播报听读音)](https://baike.baidu.com/item/axios)
11. [axios(github)地址](https://github.com/axios/axios)
12. [axios 官方推荐官网](https://axios-http.com/)
13. [axios(npmjs)地址](https://www.npmjs.com/package/axios)
14. [GET 和 POST 区别->百度百科](https://baike.baidu.com/item/post/2171305)
15. [报文讲解->百度百科](https://baike.baidu.com/item/%E6%8A%A5%E6%96%87/3164352)
16. [HTTP 状态码->百度百科](https://baike.baidu.com/item/HTTP%E7%8A%B6%E6%80%81%E7%A0%81/5053660)
17. [接口概念->百度百科](https://baike.baidu.com/item/%E6%8E%A5%E5%8F%A3/2886384)
