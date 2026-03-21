---
title: "SQL 进阶：数据更新、空值处理与视图"
date: 2026-03-16 17:37:26
tags:
  - "SQL"
  - "INSERT"
  - "UPDATE"
  - "DELETE"
  - "视图"
categories:
  - "数据库"
  - "SQL"
---

# SQL 进阶：数据更新、空值处理与视图

## 一、数据更新

数据更新包含**插入、修改、删除**三类核心操作，是SQL对表数据的基础操作，需严格匹配数据类型、遵守完整性约束。

### 1. 插入数据（INSERT）

**核心语法**：
```sql
INSERT INTO <表名> (列1,列2,...,列n)
VALUES (值1,值2,...,值n);
-- 插入子查询结果
INSERT INTO <表名> (列1,列2,...,列n)
<子查询>;
```
**关键规则**：`VALUES`子句的**值的个数、数据类型**必须与`INTO`后的列名一一匹配；若省略列名，默认对表中所有列按定义顺序插入。

**例题1-单元组插入**：向student表插入2025级新生数据
```sql
INSERT INTO student (SNO, Sname, Sbirthday, Smajor)
VALUES ('20250001', '二五新生', '2007-09-01', 'CS');
```

**例题2-子查询结果插入**：求各专业学生平均年龄并存入新建表S_major_age
```sql
-- 第一步：新建表
CREATE TABLE S_major_age (
    Smajor CHAR(20),
    avg_age INT
);
-- 第二步：插入子查询结果
INSERT INTO S_major_age (Smajor, avg_age)
SELECT Smajor, EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM Sbirthday)
FROM student
GROUP BY Smajor;
```

### 2. 修改数据（UPDATE）
**核心语法**：
```sql
UPDATE <表名>
SET 列1=表达式1, 列2=表达式2,..., 列n=表达式n
[WHERE <条件>];
```
**关键规则**：
- `WHERE`子句限定修改范围，**省略则修改表中所有元组**；
- 支持带子查询的条件，表达式可直接使用列名做运算（如`XF=XF-5`）；
- 执行时会检查**实体完整性、用户定义完整性**（如成绩范围0~100，超出则报错）。

**例题1-修改单个元组**：将学号20250001的学生出生日期改为2007-05-02
```sql
UPDATE student
SET Sbirthday = '2007-05-02'
WHERE SNO = '20250001';
```

**例题2-修改多个元组**：将202502学期课程号10086的学分数减5
```sql
UPDATE course
SET XF = XF - 5
WHERE semester = '202502' AND CNO = '10086';
```

**例题3-带子查询的修改**：将计算机专业（CS）学生的成绩置0
```sql
UPDATE course
SET grade = 0
WHERE SNO IN (SELECT SNO FROM student WHERE Smajor = 'CS');
```

### 3. 删除数据（DELETE）
**核心语法**：
```sql
DELETE FROM <表名>
[WHERE <条件>];
```
**关键规则**：
- `WHERE`子句限定删除范围，**省略则删除表中所有元组（表定义保留，仅清空数据）**；
- 支持带子查询的条件，删除后数据不可恢复，需谨慎操作。

**例题1-删除单个元组**：删除学号20250001的学生记录
```sql
DELETE FROM student
WHERE SNO = '20250001';
```

**例题2-删除所有元组**：删除所有学生的选课记录（清空SC表）
```sql
DELETE FROM SC;
```

**例题3-带子查询的删除**：删除智科专业（IS）学生的选课记录
```sql
DELETE FROM SC
WHERE SNO IN (SELECT SNO FROM student WHERE Smajor = 'IS');
```

## 二、空值处理
### 1. 空值的定义
空值（`NULL`）表示**未知、不存在或无意义**，并非0或空字符串，如未考试的课程成绩、未填写的个人信息。

### 2. 空值的判断
**核心语法**：仅能使用`IS NULL`（判断为空）或`IS NOT NULL`（判断非空），**不可用`=`或`!=`判断空值**。
```sql
-- 查找student表中姓名或性别漏填的学生
SELECT * FROM student
WHERE Sname IS NULL OR Ssex IS NULL;
```
**注意**：主键（如SNO）隐含`NOT NULL`约束，不可能为空，无需判断。

### 3. 空值的约束规则
1. 定义基本表时，用`NOT NULL`指定的属性**不可取空值**；
2. **主键属性强制非空**，且主键同时隐含`UNIQUE`（唯一）约束；
3. 无`NOT NULL`约束的属性，默认可取空值。

## 三、视图（View）
### 1. 视图的基本概念
视图是**从基本表/其他视图导出的虚表**，仅存储视图的**定义（查询语句）**，不存储实际数据；基本表数据发生变化，视图查询结果会**实时同步**。

### 2. 视图的创建（CREATE VIEW）
**核心语法**：
```sql
CREATE VIEW <视图名> (列1,列2,...,列n)
AS <子查询>
[WITH CHECK OPTION];
```
**关键规则**：
- 若子查询的列是**表达式/聚合函数**，需为其指定别名；
- `WITH CHECK OPTION`：对视图执行增/删/改时，**强制保证操作结果符合子查询的条件**，否则拒绝执行；
- 视图可基于**单个基本表、多个基本表、已有视图**创建。

#### 分类&例题
##### （1）基于单个基本表的视图（行列子集视图）
建立软件工程专业（SE）学生视图，要求增删改时仍保证为SE专业：
```sql
CREATE VIEW View_SE
AS SELECT * FROM student
WHERE Smajor = 'SE'
WITH CHECK OPTION;
```
**行列子集视图**：仅去掉基本表的部分行/列，保留主键的视图，是最基础的视图类型。

##### （2）基于多个基本表的视图
建立软件工程专业学生选修999号课程的视图（含学号、姓名、成绩）：
```sql
CREATE VIEW View_SE_999 (SNO, Sname, grade)
AS SELECT s.SNO, s.Sname, sc.grade
FROM student s, SC sc
WHERE s.Smajor = 'SE' AND s.SNO = sc.SNO AND sc.CNO = '999';
```

##### （3）基于已有视图的视图
在View_SE_999基础上，建立成绩≥90分的学生视图：
```sql
CREATE VIEW View_SE_999_90
AS SELECT * FROM View_SE_999
WHERE grade >= 90;
```

##### （4）含表达式的视图
建立学生视图（含学号、姓名、学院、年龄，年龄通过出生日期计算）：
```sql
CREATE VIEW View_Stu_Age (SNO, Sname, Sdept, Sage)
AS SELECT SNO, Sname, Sdept, EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM Sbirthday)
FROM student;
```

### 3. 视图的删除（DROP VIEW）
**核心语法**：
```sql
DROP VIEW <视图名> [CASCADE];
```
**关键规则**：
- `CASCADE`：**级联删除**，若该视图上导出了其他视图，会同时删除所有衍生视图；
- 省略`CASCADE`时，若视图有衍生视图，执行删除会**报错**；
- 删除视图仅删除视图定义，**不影响原基本表数据**。

**例题**：级联删除视图View_SE（及其衍生视图）
```sql
DROP VIEW View_SE CASCADE;
```

### 4. 视图的查询（SELECT）
视图的查询语法**与基本表完全一致**，数据库会通过**视图消解**将视图查询转化为对基本表的等价查询，用户无需关注底层实现。
```sql
-- 查询View_SE视图中所有女生信息
SELECT * FROM View_SE
WHERE Ssex = '女';
```

### 5. 视图的更新（增/删/改）
视图的更新语法与基本表一致，最终会**转化为对原基本表的更新**，但存在限制：
1. 带`WITH CHECK OPTION`的视图，更新结果必须符合视图定义条件；
2. 含**聚合函数、分组、表达式、DISTINCT**的视图，**不可更新**；
3. 多表联合创建的视图，更新通常仅能影响**一个基本表**。

**例题**：将信息管理专业视图View_IS中学号2018005的学生姓名改为“刘星奇”
```sql
UPDATE View_IS
SET Sname = '刘星奇'
WHERE SNO = '2018005';
```

### 6. 视图的核心作用
1. **简化用户操作**：将复杂的多表连接/嵌套查询封装为视图，用户直接查询视图即可，无需重复编写复杂语句；
2. **多角度看待数据**：同一基本表可创建不同视图，满足不同用户（学生、老师、管理员）的数据分析需求；
3. **提供逻辑独立性**：若基本表的结构发生修改，只需调整视图定义，无需修改用户的查询语句，降低耦合；
4. **数据安全保护**：仅将用户需要的列/行封装为视图，隐藏基本表中的机密数据（如学生的身份证号、手机号）；
5. **清晰表达查询需求**：视图可将临时的查询结果固化为逻辑表，便于后续反复查询和二次分析。

