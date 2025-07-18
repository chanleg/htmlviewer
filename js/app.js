// 全局变量
let editor;
let isResizing = false;
let selectedHistoryItem = null;
let allHistoryItems = [];
let currentSearchMarkers = [];
let currentSearchIndex = -1;
let currentSearchTerm = '';

// 默认HTML代码
const defaultCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>欢迎使用HTML编辑器</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .welcome-card {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
        }
        h1 { color: #2c3e50; margin-bottom: 20px; }
        p { color: #7f8c8d; line-height: 1.6; margin-bottom: 15px; }
        .highlight { color: #3498db; font-weight: bold; }
    </style>
</head>
<body>
    <!-- 这是一个欢迎页面的注释 -->
    <div class="welcome-card">
        <!-- 主标题注释 -->
        <h1>🎉 欢迎使用HTML编辑器</h1>
        
        <!-- 功能介绍注释 -->
        <p>这是一个功能强大的在线HTML代码编辑器</p>
        <p>您可以在左侧编辑代码，右侧会实时显示提取的注释</p>
        <p>点击<span class="highlight">"生成预览"</span>按钮可以在新标签页查看效果</p>
        <p>点击<span class="highlight">"保存代码"</span>按钮可以下载HTML文件</p>
        
        <!-- 结尾注释 -->
        <p>开始您的创作之旅吧！✨</p>
    </div>
</body>
</html>`;

// 初始化编辑器
function initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        matchTags: {bothTags: true},
        indentUnit: 2,
        tabSize: 2,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); }
        },
        hintOptions: {
            completeSingle: false
        },
        styleActiveLine: true
    });

    // 设置默认代码
    editor.setValue(defaultCode);

    // 监听代码变化
    editor.on('change', function() {
        extractComments();
        highlightColorCodes();
    });

    // 初始提取注释
    extractComments();
    
    // 初始化颜色高亮
    highlightColorCodes();
}

// 高亮颜色代码
function highlightColorCodes() {
    // 清除之前的标记
    if (window.colorMarkers) {
        window.colorMarkers.forEach(marker => marker.clear());
    }
    window.colorMarkers = [];
    
    // 查找所有颜色代码
    const content = editor.getValue();
    const hexColorRegex = /(#[0-9A-Fa-f]{3,8})\b/g;
    const rgbColorRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g;
    const namedColorRegex = /\b(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow)\b/gi;
    
    // 查找并标记十六进制颜色
    let match;
    while ((match = hexColorRegex.exec(content)) !== null) {
        const color = match[1];
        const pos = editor.posFromIndex(match.index);
        const endPos = editor.posFromIndex(match.index + color.length);
        
        const marker = createColorMarker(color, pos, endPos);
        if (marker) window.colorMarkers.push(marker);
    }
    
    // 查找并标记RGB/RGBA颜色
    while ((match = rgbColorRegex.exec(content)) !== null) {
        const color = match[0];
        const pos = editor.posFromIndex(match.index);
        const endPos = editor.posFromIndex(match.index + color.length);
        
        const marker = createColorMarker(color, pos, endPos);
        if (marker) window.colorMarkers.push(marker);
    }
    
    // 查找并标记命名颜色
    while ((match = namedColorRegex.exec(content)) !== null) {
        const color = match[1];
        const pos = editor.posFromIndex(match.index);
        const endPos = editor.posFromIndex(match.index + color.length);
        
        const marker = createColorMarker(color, pos, endPos);
        if (marker) window.colorMarkers.push(marker);
    }
}

// 创建颜色标记
function createColorMarker(color, pos, endPos) {
    try {
        // 创建包含颜色预览和文本的容器
        const container = document.createElement('span');
        container.className = 'color-code-container';
        
        // 创建颜色预览元素
        const colorPreview = document.createElement('span');
        colorPreview.className = 'color-preview';
        colorPreview.style.backgroundColor = color;
        colorPreview.title = color;
        
        // 创建颜色文本元素
        const colorText = document.createElement('span');
        colorText.className = 'color-text';
        colorText.textContent = color;
        
        // 将预览和文本添加到容器
        container.appendChild(colorPreview);
        container.appendChild(colorText);
        
        // 创建标记
        return editor.markText(pos, endPos, {
            replacedWith: container,
            handleMouseEvents: true
        });
    } catch (e) {
        console.error('创建颜色标记失败:', e);
        return null;
    }
}

// 提取HTML注释
function extractComments() {
    const code = editor.getValue();
    const comments = [];

    // 匹配HTML注释
    let match;
    const htmlCommentRegex = /<!--\s*(.*?)\s*-->/g;
    while ((match = htmlCommentRegex.exec(code)) !== null) {
        const commentText = match[1].trim();
        if (commentText) {
            addComment(comments, commentText, 'html', match.index, code);
        }
    }

    // 匹配CSS注释
    const cssCommentRegex = /\/\*\s*(.*?)\s*\*\//gs;
    while ((match = cssCommentRegex.exec(code)) !== null) {
        const commentText = match[1].trim();
        if (commentText) {
            addComment(comments, commentText, 'css', match.index, code);
        }
    }

    // 逐行处理JS注释，避免URL中的//被误识别
    const lines = code.split('\n');
    let currentIndex = 0;

    lines.forEach((line, lineIndex) => {
        // 查找所有可能的//注释位置
        const commentIndex = line.indexOf('//');
        if (commentIndex !== -1 && !isInString(line, commentIndex)) {
            // 检查//前面是否是URL的一部分（http://或https://）
            const beforeComment = line.substring(0, commentIndex);
            const isUrl = /https?:$/.test(beforeComment.trim());
            
            if (!isUrl) {
                // 提取//后面的注释内容
                const commentText = line.substring(commentIndex + 2).trim();
                if (commentText) {
                    const absoluteCommentIndex = currentIndex + commentIndex;
                    addComment(comments, commentText, 'js', absoluteCommentIndex, code);
                }
            }
        }

        currentIndex += line.length + 1; // +1 for newline
    });

    // 按位置排序
    comments.sort((a, b) => a.index - b.index);
    displayComments(comments);
}

// 辅助函数：添加注释到数组
function addComment(comments, text, type, index, code) {
    const lineNumber = code.substring(0, index).split('\n').length;
    const beforeComment = code.substring(0, index);
    const lastLineStart = beforeComment.lastIndexOf('\n') + 1;
    const lastLine = beforeComment.substring(lastLineStart);
    const indentLevel = Math.floor(lastLine.length / 4);

    comments.push({
        text: text,
        type: type,
        level: Math.min(indentLevel, 3),
        line: lineNumber,
        index: index
    });
}

// 辅助函数：检查是否在字符串内
function isInString(line, position) {
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < position; i++) {
        const char = line[i];
        const prevChar = i > 0 ? line[i-1] : '';
    
        if (char === '"' && prevChar !== '\\' && !inSingle) {
            inDouble = !inDouble;
        } else if (char === "'" && prevChar !== '\\' && !inDouble) {
            inSingle = !inSingle;
        }
    }

    return inSingle || inDouble;
}

// 显示注释
function displayComments(comments) {
    const container = document.getElementById('comments-content');
    
    if (comments.length === 0) {
        container.innerHTML = '<div class="no-comments">暂无注释内容</div>';
        return;
    }

    const html = comments.map((comment, index) => {
        const levelClass = comment.level > 0 ? `level-${comment.level}` : '';
    
        // 根据注释类型添加图标和样式类
        const typeIcon = comment.type === 'html' ? '💬' : 
                         comment.type === 'css' ? '🎨' : 
                         comment.type === 'js' ? '⚡' : '📝';
    
        const typeClass = comment.type ? `type-${comment.type}` : '';
    
        return `<div class="comment-item ${levelClass} ${typeClass}" onclick="jumpToComment(${comment.line}, ${comment.index})">
                    <span class="comment-icon">${typeIcon}</span>
                    <span class="comment-text">${comment.text}</span>
                </div>`;
    }).join('');

    container.innerHTML = html;
}

// 跳转到注释对应的代码行
function jumpToComment(lineNumber, index) {
    // 跳转到指定行
    editor.setCursor(lineNumber - 1, 0);
    editor.focus();
    
    // 滚动到可视区域中央
    const lineHandle = editor.getLineHandle(lineNumber - 1);
    if (lineHandle) {
        const coords = editor.charCoords({line: lineNumber - 1, ch: 0}, "local");
        editor.scrollTo(null, coords.top - editor.getScrollInfo().clientHeight / 2);
    }
    
    // 高亮显示该行
    const from = {line: lineNumber - 1, ch: 0};
    const to = {line: lineNumber - 1, ch: editor.getLine(lineNumber - 1).length};
    const marker = editor.markText(from, to, {
        className: 'highlighted-line',
        clearOnEnter: true
    });
        
    // 2秒后清除高亮
    setTimeout(() => {
        marker.clear();
    }, 2000);
}

// 生成预览
function generatePreview() {
    const code = editor.getValue();
    if (code != defaultCode) {
        var r = window.open("", "", "");
        r.opener = null;
        r.document.write(code);
        r.document.close();
    } else {
        alert("请将需要运行的HTML填写到输入框后再运行！", "alert", "运行提示");
    }
}

// 保存代码
function saveCode() {
    const modal = document.getElementById('save-modal');
    const fileNameInput = document.getElementById('file-name');
    
    // 生成默认文件名
    const code = editor.getValue();
    const titleMatch = code.match(/<title>(.*?)<\/title>/i);
    let defaultName;
    if (titleMatch && titleMatch[1].trim()) {
        defaultName = titleMatch[1].trim().replace(/[<>:"/\\|?*]/g, '');
    } else {
        const now = new Date();
        defaultName = `html-code-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`;
    }
    fileNameInput.value = defaultName;
    
    modal.classList.add('show');
    fileNameInput.focus();
    fileNameInput.select();
}

// 关闭保存模态框
function closeSaveModal() {
    const modal = document.getElementById('save-modal');
    modal.classList.remove('show');
}

// 确认保存
function confirmSave() {
    const code = editor.getValue();
    const fileName = document.getElementById('file-name').value.trim();
    
    if (!fileName) {
        alert('请输入文件名称！');
        return;
    }

    // 保存到localStorage
    const saveTime = new Date().toLocaleString('zh-CN');
    const saveKey = new Date().getTime().toString();
    localStorage.setItem(saveKey, JSON.stringify({
        code: code,
        timestamp: saveTime,
        name: fileName
    }));

    // 获取文件类型
    const fileType = document.getElementById('file-type').value;
    const extension = fileType === 'html' ? '.html' : '.txt';
    const mimeType = fileType === 'html' ? 'text/html' : 'text/plain';

    // 下载文件
    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith(extension) ? fileName : fileName + extension;
    a.click();
    URL.revokeObjectURL(url);

    // 关闭模态框
    closeSaveModal();

    // 显示成功消息
    showSuccessMessage('代码保存成功！');

    // 更新历史记录显示
    updateHistoryDisplay();
}

// 显示成功消息
function showSuccessMessage(message) {
    const messageEl = document.getElementById('success-message');
    messageEl.textContent = message;
    messageEl.classList.add('show');

    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// 搜索代码功能
function searchCode() {
    const searchTerm = document.getElementById('code-search').value.trim();
    
    // 清除之前的搜索标记
    currentSearchMarkers.forEach(marker => marker.clear());
    currentSearchMarkers = [];
    currentSearchIndex = -1;
    
    if (!searchTerm) {
        updateSearchUI();
        return;
    }
    
    currentSearchTerm = searchTerm;
    const content = editor.getValue();
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const from = editor.posFromIndex(match.index);
        const to = editor.posFromIndex(match.index + match[0].length);
        
        const marker = editor.markText(from, to, {
            className: 'search-highlight',
            clearOnEnter: false
        });
        
        currentSearchMarkers.push(marker);
    }
    
    // 如果找到匹配项，跳转到第一个
    if (currentSearchMarkers.length > 0) {
        currentSearchIndex = 0;
        highlightCurrentMatch();
    }
    
    updateSearchUI();
}

// 导航搜索结果
function navigateSearch(direction) {
    if (currentSearchMarkers.length === 0) return;
    
    // 清除当前高亮
    if (currentSearchIndex >= 0 && currentSearchIndex < currentSearchMarkers.length) {
        const currentMarker = currentSearchMarkers[currentSearchIndex];
        const range = currentMarker.find();
        if (range) {
            currentMarker.clear();
            const newMarker = editor.markText(range.from, range.to, {
                className: 'search-highlight',
                clearOnEnter: false
            });
            currentSearchMarkers[currentSearchIndex] = newMarker;
        }
    }
    
    // 更新索引
    currentSearchIndex += direction;
    if (currentSearchIndex >= currentSearchMarkers.length) {
        currentSearchIndex = 0;
    } else if (currentSearchIndex < 0) {
        currentSearchIndex = currentSearchMarkers.length - 1;
    }
    
    highlightCurrentMatch();
    updateSearchUI();
}

// 高亮当前匹配项
function highlightCurrentMatch() {
    if (currentSearchIndex >= 0 && currentSearchIndex < currentSearchMarkers.length) {
        const marker = currentSearchMarkers[currentSearchIndex];
        const range = marker.find();
        if (range) {
            // 清除当前标记并重新创建为当前高亮
            marker.clear();
            const newMarker = editor.markText(range.from, range.to, {
                className: 'search-highlight-current',
                clearOnEnter: false
            });
            currentSearchMarkers[currentSearchIndex] = newMarker;
            
            // 滚动到当前匹配项
            editor.setCursor(range.from);
            editor.scrollIntoView(range.from, 100);
        }
    }
}

// 更新搜索UI
function updateSearchUI() {
    const counter = document.getElementById('search-counter');
    const prevBtn = document.getElementById('search-prev');
    const nextBtn = document.getElementById('search-next');
    
    if (currentSearchMarkers.length === 0) {
        counter.textContent = '';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    } else {
        counter.textContent = `${currentSearchIndex + 1}/${currentSearchMarkers.length}`;
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
}

// 处理搜索框键盘事件
function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) {
            navigateSearch(-1); // Shift+Enter: 上一个
        } else {
            navigateSearch(1);  // Enter: 下一个
        }
    } else if (event.key === 'Escape') {
        // Esc: 清空搜索
        document.getElementById('code-search').value = '';
        searchCode();
        event.target.blur();
    }
}

// 搜索历史记录功能
function searchHistory() {
    const searchTerm = document.getElementById('history-search').value.trim().toLowerCase();
    const historyList = document.getElementById('history-list');
    
    if (!searchTerm) {
        // 如果搜索框为空，显示所有历史记录
        displayFilteredHistory(allHistoryItems);
        return;
    }
    
    // 过滤历史记录
    const filteredItems = allHistoryItems.filter(item => {
        const data = JSON.parse(localStorage.getItem(item));
        const name = (data.name || '未命名文档').toLowerCase();
        const timestamp = data.timestamp.toLowerCase();
        return name.includes(searchTerm) || timestamp.includes(searchTerm);
    });
    
    displayFilteredHistory(filteredItems);
}

// 显示过滤后的历史记录
function displayFilteredHistory(items) {
    const historyList = document.getElementById('history-list');
    
    if (items.length === 0) {
        historyList.innerHTML = '<div class="no-history">未找到匹配的记录</div>';
        return;
    }
    
    const html = items.map(key => {
        const data = JSON.parse(localStorage.getItem(key));
        const displayName = data.name || '未命名文档';
        const timeStr = data.timestamp;
        
        return `
            <div class="history-item" data-key="${key}">
                <div class="history-info" onclick="loadHistory('${key}')">
                    <div>
                        <div class="history-name">${displayName}</div>
                        <div class="history-time">${timeStr}</div>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteHistory('${key}')" title="删除记录">×</button>
            </div>
        `;
    }).join('');
    
    historyList.innerHTML = html;
}

// 更新历史记录显示
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    const keys = Object.keys(localStorage).filter(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return data && data.code && data.timestamp;
        } catch {
            return false;
        }
    }).sort((a, b) => parseInt(b) - parseInt(a)); // 按时间倒序
    
    allHistoryItems = keys; // 保存所有历史记录
    
    if (keys.length === 0) {
        historyList.innerHTML = '<div class="no-history">暂无保存记录</div>';
        return;
    }
    
    displayFilteredHistory(keys);
}

// 删除历史记录
function deleteHistory(key) {
    if (confirm('确定要删除这条记录吗？')) {
        localStorage.removeItem(key);
        updateHistoryDisplay();
        showSuccessMessage('记录删除成功！');
    }
}

// 加载历史记录
function loadHistory(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.code) {
            editor.setValue(data.code);
            extractComments();

            // 更新选中状态
            document.querySelectorAll('.history-item').forEach(item => {
                item.classList.remove('selected');
            });
            document.querySelector(`[data-key="${key}"]`).classList.add('selected');
            selectedHistoryItem = key;
        }
    } catch (error) {
        console.error('加载历史记录失败:', error);
    }
}

// 初始化拖拽调整功能
function initResizer() {
    const resizer = document.getElementById('resizer');
    const leftPanel = document.querySelector('.editor-section');
    const rightPanel = document.querySelector('.comments-section');
    const container = document.querySelector('.main-content');

    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
    });

    function handleMouseMove(e) {
        if (!isResizing) return;

        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width - 8; // 减去resizer宽度
        const mouseX = e.clientX - containerRect.left;
        
        const leftWidth = Math.max(300, Math.min(mouseX, containerWidth - 300));
        const rightWidth = containerWidth - leftWidth;

        leftPanel.style.flex = `0 0 ${leftWidth}px`;
        rightPanel.style.flex = `0 0 ${rightWidth}px`;

        // 刷新编辑器显示
        setTimeout(() => {
            editor.refresh();
        }, 0);
    }

    function handleMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}

// 显示批量导入对话框
function showBatchImportModal() {
    const modal = document.getElementById('batch-import-modal');
    modal.classList.add('show');
}

// 关闭批量导入对话框
function closeBatchImportModal() {
    const modal = document.getElementById('batch-import-modal');
    modal.classList.remove('show');
    // 清空文件选择
    document.getElementById('batch-files').value = '';
    // 隐藏进度条
    document.getElementById('import-progress').style.display = 'none';
}

// 开始批量导入
function startBatchImport() {
    const fileInput = document.getElementById('batch-files');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('请选择要导入的文件！');
        return;
    }
    
    const progressDiv = document.getElementById('import-progress');
    progressDiv.style.display = 'block';
    
    let importedCount = 0;
    const totalFiles = files.length;
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名
            
            // 保存到localStorage
            const saveTime = new Date().toLocaleString('zh-CN');
            const saveKey = new Date().getTime().toString() + '_' + index;
            localStorage.setItem(saveKey, JSON.stringify({
                code: content,
                timestamp: saveTime,
                name: fileName
            }));
            
            importedCount++;
            
            // 更新进度
            const progress = (importedCount / totalFiles) * 100;
            const progressFill = progressDiv.querySelector('.progress-fill');
            const progressText = progressDiv.querySelector('.progress-text');
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = `正在导入... ${importedCount}/${totalFiles}`;
            
            // 如果是最后一个文件
            if (importedCount === totalFiles) {
                setTimeout(() => {
                    closeBatchImportModal();
                    updateHistoryDisplay();
                    showSuccessMessage(`成功导入 ${totalFiles} 个文件！`);
                }, 500);
            }
        };
        
        reader.onerror = function() {
            console.error('读取文件失败:', file.name);
            importedCount++;
            if (importedCount === totalFiles) {
                setTimeout(() => {
                    closeBatchImportModal();
                    updateHistoryDisplay();
                    showSuccessMessage(`导入完成，成功导入 ${importedCount} 个文件！`);
                }, 500);
            }
        };
        
        reader.readAsText(file, 'UTF-8');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initEditor();
    initResizer();
    updateHistoryDisplay();
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl+S 保存
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveCode();
        }
        // Ctrl+Enter 预览
        else if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            generatePreview();
        }
        // Ctrl+F 搜索
        else if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            document.getElementById('code-search').focus();
        }
        // F3 下一个搜索结果
        else if (e.key === 'F3') {
            e.preventDefault();
            if (e.shiftKey) {
                navigateSearch(-1); // Shift+F3: 上一个
            } else {
                navigateSearch(1);  // F3: 下一个
            }
        }
        // Esc 关闭模态框或清空搜索
        else if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-overlay.show');
            if (modals.length > 0) {
                modals.forEach(modal => modal.classList.remove('show'));
            } else {
                // 如果没有打开的模态框，清空搜索
                const searchBox = document.getElementById('code-search');
                if (document.activeElement === searchBox) {
                    searchBox.value = '';
                    searchCode();
                    searchBox.blur();
                }
            }
        }
    });
    
    // 监听编辑器滚动事件，重新渲染颜色标记
    editor.on('scroll', function() {
        setTimeout(highlightColorCodes, 100);
    });
    
    // 监听窗口大小变化，重新渲染颜色标记
    window.addEventListener('resize', function() {
        setTimeout(highlightColorCodes, 100);
    });
        
    // 保存对话框回车确认
    document.getElementById('file-name').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            confirmSave();
        }
    });
});