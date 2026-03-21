---
title: "AJAX 基础入门教程"
date: 2025-12-20 12:00:04
tags:
  - "AJAX基础"
  - "axios"
  - "HTTP请求"
  - "前后端通信"
categories:
  - "前端开发"
  - "AJAX"
---

# AJAX基础入门教程

## 核心概念

### 什么是AJAX？

AJAX就像是餐厅的"传菜员"，专门负责厨房（服务器）和餐桌（你的网页）之间的沟通。想象一下，如果没有传菜员，每次点菜都要你亲自跑到厨房去告诉厨师，然后等菜做好再端回来——这就是传统的网页刷新方式。

而有了AJAX这个"传菜员"，你只需要告诉它你要什么，它就会悄悄地去厨房告诉厨师，然后把做好的菜端给你，整个过程你都不用离开餐桌（页面不会刷新）。

**专业解释**：AJAX(Asynchronous JavaScript And XML)是一种在无需重新加载整个网页的情况下，能够与服务器交换数据并更新部分网页内容的技术。

### 为什么需要AJAX？

1. **提升用户体验**：就像微信聊天一样，发送消息后不需要刷新整个聊天界面
2. **节省流量**：只获取需要的数据，而不是整个页面
3. **实时交互**：可以像股票行情一样实时更新数据

### AJAX的工作原理

AJAX的工作流程就像这样：

```
用户操作 → JavaScript发起请求 → 服务器处理 → 返回数据 → JavaScript更新页面
```

## 用法详解

### 使用axios库（推荐方式）

axios就像是一把"瑞士军刀"，是专门用来处理AJAX请求的工具库。它比原生的AJAX更简单好用。

#### 基本语法

```javascript
// GET请求 - 获取数据
axios({
  url: "http://example.com/api/data",
  method: "GET",
})
  .then(function (response) {
    console.log("成功获取数据:", response.data);
  })
  .catch(function (error) {
    console.log("出错了:", error);
  });

// POST请求 - 提交数据
axios({
  url: "http://example.com/api/save",
  method: "POST",
  data: {
    name: "张三",
    age: 18,
  },
}).then(function (response) {
  console.log("提交成功:", response.data);
});
```

#### 常用参数说明

| 参数名 | 作用               | 示例                                    |
| ------ | ------------------ | --------------------------------------- |
| url    | 请求地址           | 'http://api.example.com/users'          |
| method | 请求方法           | 'GET'、'POST'、'PUT'、'DELETE'          |
| params | 查询参数（GET）    | {id: 1, name: '张三'}                   |
| data   | 请求体数据（POST） | {username: 'admin', password: '123456'} |

### URL地址的组成

URL就像是我们现实生活中的地址：

```
http://hmajax.itheima.net/api/province?pname=河北省
```

- **协议**（http://）：就像告诉邮递员用哪种交通工具
- **域名**（hmajax.itheima.net）：就像省市区的大地址
- **路径**（/api/province）：就像具体的街道门牌号
- **参数**（?pname=河北省）：就像给快递员的额外说明

## 实战案例

### 案例1：获取省份列表

**需求**：从服务器获取中国所有省份的名称，并显示在页面上。

**实现步骤**：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>获取省份列表</title>
  </head>
  <body>
    <h2>中国省份列表</h2>
    <div id="provinceList">加载中...</div>

    <!-- 引入axios库 -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      // 使用axios获取省份数据
      axios({
        url: "http://hmajax.itheima.net/api/province",
      })
        .then(function (result) {
          // 成功获取数据
          console.log("获取到的数据:", result);

          // 提取省份列表
          const provinces = result.data.list;

          // 将数组转换为HTML字符串
          const htmlStr = provinces
            .map(function (province) {
              return "<p>🏞️ " + province + "</p>";
            })
            .join("");

          // 显示到页面上
          document.getElementById("provinceList").innerHTML = htmlStr;
        })
        .catch(function (error) {
          // 处理错误
          console.log("获取数据失败:", error);
          document.getElementById("provinceList").innerHTML = "❌ 数据加载失败";
        });
    </script>
  </body>
</html>
```

### 案例2：查询城市信息

**需求**：根据选择的省份，显示该省份下的城市列表。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>城市查询</title>
  </head>
  <body>
    <h2>城市查询系统</h2>
    <select id="provinceSelect">
      <option value="">请选择省份</option>
      <option value="河北省">河北省</option>
      <option value="辽宁省">辽宁省</option>
      <option value="山东省">山东省</option>
    </select>

    <div id="cityResult">请先选择省份</div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      // 监听下拉框变化
      document
        .getElementById("provinceSelect")
        .addEventListener("change", function () {
          const selectedProvince = this.value;

          if (selectedProvince === "") {
            document.getElementById("cityResult").innerHTML = "请先选择省份";
            return;
          }

          // 显示加载状态
          document.getElementById("cityResult").innerHTML =
            "🔄 正在查询城市信息...";

          // 使用查询参数获取城市数据
          axios({
            url: "http://hmajax.itheima.net/api/city",
            params: {
              pname: selectedProvince,
            },
          })
            .then(function (result) {
              // 成功获取城市数据
              const cities = result.data.list;

              if (cities.length === 0) {
                document.getElementById("cityResult").innerHTML =
                  "该省份暂无城市数据";
                return;
              }

              // 生成城市列表HTML
              const cityHtml = cities
                .map(function (city) {
                  return (
                    '<span style="margin: 5px; padding: 5px 10px; background: #e3f2fd; border-radius: 5px;">' +
                    city +
                    "</span>"
                  );
                })
                .join("");

              document.getElementById("cityResult").innerHTML =
                "<h3>🏙️ 包含以下城市：</h3>" + cityHtml;
            })
            .catch(function (error) {
              document.getElementById("cityResult").innerHTML =
                "❌ 查询失败，请稍后重试";
              console.log("查询失败:", error);
            });
        });
    </script>
  </body>
</html>
```

### 案例3：用户登录功能

**需求**：实现一个简单的用户登录功能。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>用户登录</title>
    <style>
      .login-container {
        width: 300px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      button {
        width: 100%;
        padding: 10px;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background: #45a049;
      }
      .message {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
      }
      .success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      .error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <h2>用户登录</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="username">用户名：</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="请输入用户名"
            required />
        </div>
        <div class="form-group">
          <label for="password">密码：</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="请输入密码"
            required />
        </div>
        <button type="submit">登录</button>
      </form>
      <div id="message"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      // 处理表单提交
      document
        .getElementById("loginForm")
        .addEventListener("submit", function (e) {
          e.preventDefault(); // 阻止表单默认提交

          // 获取表单数据
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;

          // 简单验证
          if (username.length < 3) {
            showMessage("用户名至少需要3个字符", "error");
            return;
          }

          if (password.length < 6) {
            showMessage("密码至少需要6个字符", "error");
            return;
          }

          // 显示加载状态
          showMessage("🔄 正在登录...", "info");

          // 发送登录请求
          axios({
            url: "http://hmajax.itheima.net/api/login",
            method: "POST",
            data: {
              username: username,
              password: password,
            },
          })
            .then(function (result) {
              // 登录成功
              console.log("登录成功:", result);
              showMessage("✅ 登录成功！欢迎回来", "success");

              // 这里可以保存登录状态，跳转到其他页面等
              // localStorage.setItem('token', result.data.token);
            })
            .catch(function (error) {
              // 登录失败
              console.log("登录失败:", error);
              const errorMsg =
                error.response &&
                error.response.data &&
                error.response.data.message
                  ? error.response.data.message
                  : "登录失败，请检查用户名和密码";
              showMessage("❌ " + errorMsg, "error");
            });
        });

      // 显示消息函数
      function showMessage(text, type) {
        const messageDiv = document.getElementById("message");
        messageDiv.className = "message " + type;
        messageDiv.textContent = text;

        // 3秒后清除消息
        setTimeout(function () {
          messageDiv.className = "";
          messageDiv.textContent = "";
        }, 3000);
      }
    </script>
  </body>
</html>
```

## 拓展知识

### 1. HTTP请求方法详解

| 方法   | 作用     | 类比               |
| ------ | -------- | ------------------ |
| GET    | 获取数据 | 去图书馆借书       |
| POST   | 提交数据 | 向图书馆捐赠图书   |
| PUT    | 更新数据 | 更换图书馆的某本书 |
| DELETE | 删除数据 | 从图书馆移除某本书 |
| PATCH  | 部分更新 | 只更换书的封面     |

### 2. 常见状态码含义

| 状态码 | 含义       | 类比          |
| ------ | ---------- | ------------- |
| 200    | 成功       | 任务完成 ✅   |
| 404    | 未找到     | 走错了房间 ❌ |
| 500    | 服务器错误 | 厨房着火了 🔥 |
| 403    | 禁止访问   | 没有权限 🚫   |

### 3. 调试技巧

1. **使用浏览器开发者工具**：
   - F12打开开发者工具
   - Network标签页查看请求详情
   - Console标签页查看输出信息

2. **常见错误排查**：
   - 检查URL是否正确
   - 确认网络连接是否正常
   - 查看控制台错误信息
   - 验证请求参数格式

### 4. 学习建议

1. **从简单开始**：先掌握GET请求，再学习POST请求
2. **多动手实践**：每个案例都要亲自敲代码
3. **学会看文档**：遇到问题时先查看官方文档
4. **善用搜索引擎**：遇到错误信息可以搜索解决方案
5. **保持耐心**：AJAX需要一定的网络知识基础，不要急于求成

## 本课小结

今天我们学习了：

- ✅ AJAX的基本概念和工作原理
- ✅ 使用axios库发送请求的方法
- ✅ URL地址的组成结构
- ✅ 实现了省份列表、城市查询、用户登录三个实际案例
- ✅ 了解了HTTP方法和状态码的基础知识

下节课我们将学习更多AJAX的综合应用案例，包括图书管理系统、图片上传等实用功能。

**课后练习**：

1. 尝试修改省份列表案例，添加加载动画效果
2. 在城市查询案例中添加错误处理提示
3. 为登录功能添加记住用户名选项
