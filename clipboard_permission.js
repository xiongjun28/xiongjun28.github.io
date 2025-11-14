const logElement = document.querySelector("#log");
function log(text) {
    logElement.innerText = `${logElement.innerText}${text}\n`;
    logElement.scrollTop = logElement.scrollHeight;
}

// 权限数组
const permissions = [
    "clipboard-read",
    "clipboard-write",
];
// 遍历权限并将结果记录下来
async function processPermissions() {
    for (const permission of permissions) {
        const result = await getPermission(permission);
        log(result);
    }
}
// 在 try...catch 块中查询单个权限并返回结果
async function getPermission(permission) {
    try {
        let result;
        if (permission === "top-level-storage-access") {
            result = await navigator.permissions.query({
                name: permission,
                requestedOrigin: window.location.origin,
            });
        } else {
            result = await navigator.permissions.query({ name: permission });
        }
        return `${permission}：${result.state}`;
    } catch (error) {
        return `${permission}（不支持）`;
    }
}

const clipboardInput = document.getElementById('clipboardInput');

async function readTextClipboard() {
    try {
        // 尝试读取剪贴板内容
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText.length === 0) {
            alert('剪贴板中没有文本内容可读取');
            return;
        }
        log(clipboardText);
    } catch (error) {
        log('读取剪贴(readText)板失败:' + error.message);
    }
}
async function writeTextToClipboard() {
    const content = clipboardInput.value;
    if (!content) {
        alert('输入框中没有内容可写入剪贴板');
        return;
    }
    try {
        await navigator.clipboard.writeText(content);
        log('写剪贴(writeText)板成功');
    } catch (error) {
        log('写剪贴(writeText)板失败:' + error.message);
    }
}

async function readClipboard() {
    try {
        // 尝试读取剪贴板内容
        const clipboardItems = await navigator.clipboard.read();
        if (clipboardItems.length === 0) {
            alert('剪贴板中没有内容可读取');
            return;
        }
        
        let content = '';
        let hasContent = false;
        // 处理剪贴板中的每个项目
        for (const item of clipboardItems) {
            for (const type of item.types) {
                try {
                    const blob = await item.getType(type);
                    if (type.startsWith('text/')) {
                        const text = await blob.text();
                        content += `[${type}]\n${text}\n\n`;
                        hasContent = true;
                    } else if (type.startsWith('image/')) {
                        content += `[${type}] - 图片数据 (${blob.size} 字节)\n`;
                        hasContent = true;
                    } else {
                        content += `[${type}] - 二进制数据 (${blob.size} 字节)\n`;
                        hasContent = true;
                    }
                } catch (e) {
                    console.warn(`无法读取类型 ${type}:`, e);
                }
            }
        }
        if (hasContent) {
            log(content);
        } else {
            log('剪贴板中类型未知');
        } 
    } catch (error) {
        console.error();
        log('读取剪贴(read)板失败:' + error.message);
    }
}
async function writeToClipboard() {
    const content = clipboardInput.value;
    if (!content) {
        alert('输入框中没有内容可写入剪贴板');
        return;
    }

    try {
        const item = new ClipboardItem({
            'text/plain': new Blob([ content ], { type: 'text/plain' })
        });
        await navigator.clipboard.write([ item ]);
        log('写剪贴(write)板成功');
    } catch (error) {
        log('写剪贴(write)板失败:' + error.message);
    }
}

function execCommandCopyOrCut(command) {
    const content = clipboardInput.value;
    if (!content) {
        alert('输入框中没有内容可复制/剪贴');
        return;
    }
    clipboardInput.focus();
    clipboardInput.select();
    try {
        const successful = document.execCommand(command);
        if (successful) {
            log(`${command}成功`);
        } else {
            log(`${command}失败`);
        }
    } catch (error) {
        log(`${command}失败:` + error.message);
    }
}

function changeLanguage(lang) {
      const title = document.getElementById('title');
      const content = document.getElementById('content');
      
      switch (lang) {
        case 'zh':
          title.textContent = '欢迎';
          content.textContent = '这是一个简单的多语言网页示例。';
          break;
        case 'ja':
          title.textContent = 'ようこそ';
          content.textContent = 'これは簡単な多言語ウェブページの例です。';
          break;
        case 'bo':
          title.textContent = 'བོད་སྐོར་གྱི་མིག་གཞི་འཕྲུལ་བཟོད་པའི་མིག་གཞི་འཕྲུལ་བཟོད་པའི་མིག་གཞི་འཕྲུལ་བཟོད་པའི་མིག་གཞི་འཕྲུལ་བཟོ';
          content.textContent = 'བོད་སྐོར་གྱི་མིག་གཞི་འཕྲུལ་བཟོད་པའི་མིག་གཞི་འཕྲུལ་བཟོད་པའི་མིག་གཞི་འཕྲུལ་བཟོད་པའི་མིག་གཞི་འཕྲུལ་བཟོ';
          break;
      }
}
