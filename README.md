# HTML 渲染工具 v1.5

<div align="center">

![HTML Editor](https://img.shields.io/badge/HTML-Editor-orange?style=for-the-badge&logo=html5)
![CSS](https://img.shields.io/badge/CSS-Styling-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-Interactive-yellow?style=for-the-badge&logo=javascript)
![CodeMirror](https://img.shields.io/badge/CodeMirror-5.65.16-green?style=for-the-badge)

**一个功能强大的在线HTML代码编辑器和预览工具**

提供实时编辑、语法高亮、颜色预览、注释提取、历史记录等多种专业功能

[🚀 快速开始](#-快速开始) • [📖 功能特性](#-功能特性) • [🛠️ 技术架构](#️-技术架构) • [📱 使用指南](#-使用指南)

</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [功能特性](#-功能特性)
- [技术架构](#️-技术架构)
- [快速开始](#-快速开始)
- [详细使用指南](#-详细使用指南)
- [项目结构](#-项目结构)
- [配置说明](#-配置说明)
- [浏览器兼容性](#-浏览器兼容性)
- [性能优化](#-性能优化)
- [开发指南](#-开发指南)
- [常见问题](#-常见问题)
- [版本历史](#-版本历史)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

## 🎯 项目概述

HTML 渲染工具 v1.5 是一个基于现代Web技术构建的专业HTML代码编辑器，旨在为开发者提供高效、直观的HTML开发体验。该工具集成了代码编辑、实时预览、智能分析等多种功能，特别适合前端开发、教学演示、快速原型制作等场景。

### 🎨 设计理念

- **简洁高效**: 专注于核心功能，提供流畅的编辑体验
- **智能辅助**: 自动化的代码分析和智能提示功能
- **可视化**: 直观的颜色预览和注释展示
- **响应式**: 适配各种设备和屏幕尺寸
- **模块化**: 清晰的代码架构，便于维护和扩展

## 🌟 功能特性

### 📝 专业代码编辑

#### CodeMirror 编辑器
- **语法高亮**: 支持 HTML、CSS、JavaScript 的完整语法高亮
- **智能缩进**: 自动识别代码结构，提供智能缩进
- **括号匹配**: 实时匹配括号、标签等配对符号
- **代码折叠**: 支持代码块的折叠和展开功能
- **自动补全**: 智能的代码自动补全和提示
- **多光标编辑**: 支持多光标同时编辑
- **行号显示**: 清晰的行号和当前行高亮

#### 编辑器配置
```javascript
{
  mode: 'htmlmixed',           // 混合HTML模式
  theme: 'monokai',            // Monokai主题
  lineNumbers: true,           // 显示行号
  lineWrapping: true,          // 自动换行
  autoCloseTags: true,         // 自动闭合标签
  autoCloseBrackets: true,     // 自动闭合括号
  matchBrackets: true,         // 括号匹配
  foldGutter: true,            // 代码折叠
  styleActiveLine: true        // 当前行高亮
}
```

### 🎨 实时颜色预览

#### 支持的颜色格式
- **十六进制**: `#RGB`, `#RRGGBB`, `#RRGGBBAA`
- **RGB函数**: `rgb(255, 255, 255)`, `rgba(255, 255, 255, 0.5)`
- **命名颜色**: `red`, `blue`, `green`, `transparent` 等CSS标准颜色
- **HSL函数**: `hsl(360, 100%, 50%)`, `hsla(360, 100%, 50%, 0.5)`

#### 预览特性
- **实时渲染**: 代码输入时即时显示颜色预览
- **交互效果**: 鼠标悬停时的动态缩放效果
- **精确定位**: 准确识别颜色代码位置，避免误识别
- **性能优化**: 智能的重绘机制，确保流畅的编辑体验

### 💬 智能注释提取

#### 多语言支持
- **HTML注释**: `<!-- 注释内容 -->`
- **CSS注释**: `/* 注释内容 */`
- **JavaScript注释**: `// 单行注释`

#### 智能分析
- **层级识别**: 根据代码缩进自动识别注释层级（最多3级）
- **类型分类**: 不同类型注释使用不同图标和颜色标识
- **上下文感知**: 智能过滤URL中的`//`，避免误识别
- **快速导航**: 点击注释直接跳转到对应代码行

#### 注释层级样式
```css
.comment-item.level-1 { margin-left: 20px; border-left-color: #e74c3c; }
.comment-item.level-2 { margin-left: 40px; border-left-color: #f39c12; }
.comment-item.level-3 { margin-left: 60px; border-left-color: #27ae60; }
```

### 🔍 高级搜索功能

#### 搜索特性
- **实时搜索**: 输入即搜索，无需等待
- **正则表达式**: 支持复杂的搜索模式
- **大小写敏感**: 可选的大小写匹配模式
- **全词匹配**: 精确的单词边界匹配

#### 导航功能
- **结果计数**: 显示当前结果位置和总数 `1/5`
- **快速导航**: 上一个/下一个结果的快速跳转
- **高亮显示**: 搜索结果的醒目高亮标记
- **自动滚动**: 自动滚动到当前搜索结果位置

#### 键盘快捷键
- `Ctrl + F`: 打开搜索框
- `Enter`: 下一个搜索结果
- `Shift + Enter`: 上一个搜索结果
- `F3`: 下一个搜索结果
- `Shift + F3`: 上一个搜索结果
- `Esc`: 清空搜索并关闭

### 📚 历史记录管理

#### 自动保存机制
- **实时保存**: 代码变更时自动保存到本地存储
- **版本控制**: 每次保存创建新的版本记录
- **智能命名**: 自动提取`<title>`标签作为文件名
- **时间戳**: 精确的保存时间记录

#### 历史记录功能
- **版本列表**: 按时间倒序显示所有历史版本
- **快速预览**: 鼠标悬停显示版本详情
- **一键恢复**: 点击即可恢复到指定版本
- **批量管理**: 支持批量删除和导出
- **搜索过滤**: 按文件名或时间搜索历史记录

#### 存储结构
```javascript
{
  code: "HTML代码内容",
  timestamp: "2024-01-01 12:00:00",
  name: "文件名称",
  size: 1024,
  version: "1.0"
}
```

### 💾 文件操作系统

#### 保存功能
- **多格式支持**: HTML、TXT等多种文件格式
- **智能命名**: 自动生成或自定义文件名
- **编码选择**: UTF-8、GBK等编码格式支持
- **压缩选项**: 可选的代码压缩和格式化

#### 批量导入
- **多文件选择**: 支持同时选择多个文件
- **格式检测**: 自动识别文件类型和编码
- **进度显示**: 实时显示导入进度
- **错误处理**: 完善的错误提示和处理机制

#### 导出功能
- **单文件导出**: 将当前代码导出为文件
- **批量导出**: 导出多个历史版本
- **打包下载**: ZIP格式的批量下载
- **格式转换**: 支持多种输出格式

### 🚀 实时预览系统

#### 预览特性
- **即时渲染**: 一键在新窗口预览HTML效果
- **安全隔离**: 预览窗口与编辑器完全隔离
- **完整支持**: 支持HTML、CSS、JavaScript的完整渲染
- **响应式预览**: 支持不同设备尺寸的预览

#### 预览模式
- **新窗口预览**: 在新标签页中打开预览
- **内嵌预览**: 在编辑器内部显示预览
- **移动端预览**: 模拟移动设备的预览效果
- **打印预览**: 支持打印样式的预览

## 🛠️ 技术架构

### 核心技术栈

#### 前端框架
- **CodeMirror 5.65.16**: 专业代码编辑器核心
- **Vanilla JavaScript**: 原生JavaScript，无框架依赖
- **CSS3**: 现代CSS特性，包括Grid、Flexbox、动画
- **HTML5**: 语义化标签和现代Web API

#### 外部依赖
```html
<!-- CodeMirror 核心 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>

<!-- 语言模式 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js"></script>

<!-- 功能插件 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.js"></script>
```

### 架构设计

#### 模块化结构