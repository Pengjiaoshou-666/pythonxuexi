let editor;
let messages = [];
let chatCount = parseInt(localStorage.getItem('chatCount')) || 0;

const lessons = {
    currentStep: 0,
    content: [
        {
            title: "变量入门",
            theory: `
                <h3>什么是变量？</h3>
                <p>变量就像是一个容器，可以存储各种类型的数据。在Python中，创建变量非常简单：</p>
                <div class="code-example">
                    name = "小明"  # 存储文本
                    age = 18      # 存储数字
                </div>
                <p>变量名可以包含字母、数字和下划线，但不能以数字开头。</p>
            `,
            practice: {
                text: "创建一个名为 message 的变量，并存入文本 'Hello Python!'",
                hint: "使用等号(=)来给变量赋值",
                solution: (code) => {
                    const normalizedCode = code.replace(/\s+/g, ' ').trim().toLowerCase();
                    const expectedPattern = /message\s*=\s*["']hello python!?["']/i;
                    return expectedPattern.test(code);
                }
            }
        },
        {
            title: "数字运算",
            theory: `
                <h3>Python中的基本运算</h3>
                <p>Python支持所有基本的数学运算：</p>
                <div class="code-example">
                    a = 10 + 5  # 加法：15
                    b = 10 - 5  # 减法：5
                    c = 10 * 5  # 乘法：50
                    d = 10 / 5  # 除法：2.0
                </div>
                <p>你也可以使用变量进行计算：</p>
                <div class="code-example">
                    price = 100
                    discount = 0.8
                    final_price = price * discount
                </div>
            `,
            practice: {
                text: "创建两个数字变量 a 和 b，并计算它们的和存入变量 result",
                hint: "先定义变量 a 和 b，然后用加号计算它们的和",
                solution: (code) => {
                    return code.includes('a') && 
                           code.includes('b') && 
                           code.includes('result') && 
                           code.includes('+');
                }
            }
        }
    ]
};

function showLesson(index) {
    const lesson = lessons.content[index];
    document.getElementById('lesson-content').innerHTML = `
        <h2>${lesson.title}</h2>
        ${lesson.theory}
    `;
    
    document.getElementById('challenge-text').innerHTML = `
        <h3>练习：</h3>
        <p>${lesson.practice.text}</p>
        <p><small>提示：${lesson.practice.hint}</small></p>
    `;
    
    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').disabled = index === lessons.content.length - 1;
}

function nextStep() {
    if (lessons.currentStep < lessons.content.length - 1) {
        lessons.currentStep++;
        showLesson(lessons.currentStep);
    }
}

function prevStep() {
    if (lessons.currentStep > 0) {
        lessons.currentStep--;
        showLesson(lessons.currentStep);
    }
}

function runCode() {
    const code = editor.getValue();
    const currentLesson = lessons.content[lessons.currentStep];
    const resultArea = document.getElementById('result');
    let errorMessage = '';
    
    if (currentLesson.title === "变量入门") {
        if (!code.includes('message')) {
            resultArea.innerHTML = `
                <p>❌ 错误：没有找到 message 变量</p>
                <p>提示：需要创建一个名为 message 的变量，例如：</p>
                <pre>message = "你的文本"</pre>
                <p>需要帮助？在下方问问 Python 助手吧！</p>
            `;
            resultArea.className = 'result-area error';
            errorMessage = '我在变量入门练习中遇到了问题，我的代码是：\n' + code;
            return;
        }
        if (!code.includes('=')) {
            resultArea.innerHTML = `
                <p>❌ 错误：缺少赋值操作</p>
                <p>提示：使用等号(=)给变量赋值，例如：</p>
                <pre>message = "Hello Python!"</pre>
            `;
            resultArea.className = 'result-area error';
            return;
        }
        if (!code.toLowerCase().includes('hello python')) {
            resultArea.innerHTML = `
                <p>❌ 错误：变量值不正确</p>
                <p>提示：变量值应该exactly是 'Hello Python!'，注意大小写和感叹号</p>
                <p>正确写法：</p>
                <pre>message = "Hello Python!"</pre>
            `;
            resultArea.className = 'result-area error';
            return;
        }
    }
    
    if (currentLesson.title === "数字运算") {
        if (!code.includes('a') || !code.includes('b')) {
            resultArea.innerHTML = `
                <p>❌ 错误：缺少必要的变量</p>
                <p>提示：需要创建两个变量 a 和 b，例如：</p>
                <pre>a = 10\nb = 5</pre>
                <p>需要帮助？在下方问问 Python 助手吧！</p>
            `;
            resultArea.className = 'result-area error';
            errorMessage = '我在数字运算练习中遇到了问题，我的代码是：\n' + code;
            return;
        }
        if (!code.includes('result')) {
            resultArea.innerHTML = `
                <p>❌ 错误：缺少结果变量</p>
                <p>提示：需要创建一个名为 result 的变量来存储计算结果，例如：</p>
                <pre>result = a + b</pre>
            `;
            resultArea.className = 'result-area error';
            return;
        }
        if (!code.includes('+')) {
            resultArea.innerHTML = `
                <p>❌ 错误：缺少加法运算</p>
                <p>提示：使用加号(+)来计算两个数的和，完整示例：</p>
                <pre>a = 10
 b = 5
 result = a + b</pre>
            `;
            resultArea.className = 'result-area error';
            return;
        }
    }
    
    if (currentLesson.practice.solution(code)) {
        resultArea.innerHTML = `
            <p>✅ 完全正确！</p>
            <p>你已经成功掌握了这个概念！可以继续下一课了。</p>
        `;
        resultArea.className = 'result-area success';
    } else {
        resultArea.innerHTML = `
            <p>❌ 代码还有一些问题</p>
            <p>仔细检查：</p>
            <ul>
                <li>变量名是否正确</li>
                <li>赋值符号是否正确</li>
                <li>变量值是否符合要求</li>
            </ul>
        `;
        resultArea.className = 'result-area error';
    }
    
    if (errorMessage) {
        document.getElementById('chat-input').value = errorMessage;
    }
}

function clearCode() {
    editor.setValue('');
    editor.focus();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    if (chatCount <= 0) {
        alert('对话次数已用完，请充值后继续使用！');
        showRechargeModal();
        return;
    }
    
    // 清空输入框
    input.value = '';
    
    // 添加用户消息到界面
    addMessageToUI('user', userMessage);
    
    // 构建包含上下文的消息
    const contextMessage = {
        role: "system",
        content: `你是一个Python编程助手，专门帮助学习者解决Python基础问题。
        当前课程：${lessons.content[lessons.currentStep].title}
        课程要求：${lessons.content[lessons.currentStep].practice.text}
        请分析用户代码中的问题，并提供具体的修改建议。`
    };
    
    // 添加消息到历史记录
    messages = [contextMessage]; // 重置消息历史，确保每次对话都有正确的上下文
    messages.push({ role: "user", content: userMessage });
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-ec72bd4eb59b474c82c4b2536a217fe5'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        
        // 添加助手消息到界面
        addMessageToUI('assistant', assistantMessage);
        
        // 添加到历史记录
        messages.push({ role: "assistant", content: assistantMessage });
        
        chatCount--;
        localStorage.setItem('chatCount', chatCount);
        document.getElementById('remaining-count').textContent = chatCount;
    } catch (error) {
        console.error('Error:', error);
        addMessageToUI('assistant', '抱歉，出现了一些错误，请稍后再试。');
    }
}

function addMessageToUI(role, content) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 添加回车发送功能
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

window.onload = () => {
    editor = CodeMirror(document.getElementById('code-editor'), {
        mode: 'python',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        extraKeys: {
            "Tab": function(cm) {
                cm.replaceSelection("    ", "end");
            }
        }
    });

    showLesson(0);
    initChatCount();
};

function initChatCount() {
    document.getElementById('remaining-count').textContent = chatCount;
}

function showRechargeModal() {
    document.getElementById('recharge-modal').style.display = 'block';
}

function closeRechargeModal() {
    document.getElementById('recharge-modal').style.display = 'none';
}

// 初始化 LeanCloud
AV.init({
    appId: "ExQzKb6BwcDY7hoogtflusJQ-gzGzoHsz",
    appKey: "NzmUTgZOtJ8R9S84mOzCwyND",
    serverURL: "https://exqzkb6b.lc-cn-n1-shared.com"
});

function redeemCode() {
    const code = prompt('请输入充值码：');
    // 从 LeanCloud 检查充值码
    const query = new AV.Query('RedeemCode');
    query.equalTo('code', code);
    query.first().then(redeemCode => {
        if (redeemCode && !redeemCode.get('used')) {
            // 更新用户的对话次数
            chatCount += redeemCode.get('count');
            localStorage.setItem('chatCount', chatCount);
            document.getElementById('remaining-count').textContent = chatCount;
            
            // 标记充值码为已使用
            redeemCode.set('used', true);
            return redeemCode.save();
        } else {
            alert(redeemCode ? '该充值码已被使用！' : '无效的充值码！');
        }
    }).then(() => {
        alert(`充值成功！已添加${redeemCode.get('count')}次对话次数。`);
        closeRechargeModal();
    }).catch(error => {
        console.error('保存失败：', error);
    });
}