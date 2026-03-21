import type { ContentSourceDescriptor, LaunchManifestEntry } from "@/lib/content/types";

export const launchAuthorProfileSource = {
  sourceRoot: "blog",
  sourcePath: "source/_data/about.yml",
} satisfies ContentSourceDescriptor;

export const launchPostManifest = [
  {
    slug: "javascript-basics-and-data-types",
    sourceRoot: "blog",
    sourcePath: "source/_posts/前端/JavaScript 学习笔记（1）：基础语法与数据类型.md",
  },
  {
    slug: "web-api-dom-basics",
    sourceRoot: "blog",
    sourcePath: "source/_posts/前端/Web API 学习笔记（1）：DOM 基础操作.md",
  },
  {
    slug: "ajax-basics-intro",
    sourceRoot: "blog",
    sourcePath: "source/_posts/前端/AJAX 基础入门教程.md",
  },
  {
    slug: "javascript-async-core",
    sourceRoot: "blog",
    sourcePath: "source/_posts/Udemy JS/JavaScript 异步编程核心：AJAX、Promise 与 Async／Await.md",
  },
  {
    slug: "typescript-practical-foundations",
    sourceRoot: "blog",
    sourcePath: "source/_posts/Udemy TS/TypeScript 入门到实战笔记：安装、编译与类型系统.md",
  },
  {
    slug: "network-application-layer",
    sourceRoot: "blog",
    sourcePath: "source/_posts/计算机网络/计算机网络应用层：DHCP、DNS、FTP 与 HTTP.md",
  },
  {
    slug: "database-systems-foundations",
    sourceRoot: "myblog",
    sourcePath: "数据库/1数据库系统基础：概念、发展阶段与数据模型.md",
  },
  {
    slug: "sql-ddl-query-basics",
    sourceRoot: "myblog",
    sourcePath: "数据库/3SQL 基础：DDL、表定义与查询核心.md",
  },
  {
    slug: "sql-advanced-updates-views",
    sourceRoot: "myblog",
    sourcePath: "数据库/4SQL 进阶：数据更新、空值处理与视图.md",
  },
  {
    slug: "network-layer-ipv4-routing",
    sourceRoot: "myblog",
    sourcePath: "计算机网络/计算机网络网络层：分组转发、IPv4 与路由选择.md",
  },
  {
    slug: "codeforces-2162f-beautiful-intervals",
    sourceRoot: "myblog",
    sourcePath: "题解/Codeforces 2162F Beautiful Intervals 题解（MEX 枚举思路）.md",
  },
  {
    slug: "cpp-stl-to-javascript-mapping",
    sourceRoot: "myblog",
    sourcePath: "杂项/C++ STL 到 JavaScript：常用数据结构映射速查.md",
  },
] satisfies readonly LaunchManifestEntry[];
