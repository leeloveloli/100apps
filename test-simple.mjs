// 简化版转换测试 - 直接测试核心函数
import { convertData } from './apps/code-converter/utils.js';

// 测试数据
const testData = {
  json: `{
  "name": "张三",
  "age": 30,
  "city": "北京",
  "hobbies": ["读书", "旅行"]
}`,
  
  yaml: `name: 张三
age: 30
city: 北京
hobbies:
  - 读书
  - 旅行`,

  markdown: `# 标题
## 二级标题

这是一段**粗体**文本和*斜体*文本。

- 列表项 1
- 列表项 2

[链接](https://example.com)`,

  html: `<h1>标题</h1>
<h2>二级标题</h2>
<p>这是一段<strong>粗体</strong>文本和<em>斜体</em>文本。</p>
<ul>
  <li>列表项 1</li>
  <li>列表项 2</li>
</ul>`
};

// 测试函数
function testConversions() {
  const tests = [
    // 数据格式互转
    { from: 'json', to: 'yaml', data: testData.json },
    { from: 'yaml', to: 'json', data: testData.yaml },
    { from: 'json', to: 'xml', data: testData.json },
    
    // 标记语言互转
    { from: 'markdown', to: 'html', data: testData.markdown },
    { from: 'html', to: 'markdown', data: testData.html },
    { from: 'markdown', to: 'latex', data: testData.markdown },
    
    // Base64 编码
    { from: 'json', to: 'base64', data: testData.json },
    { from: 'markdown', to: 'base64', data: testData.markdown },
  ];

  tests.forEach(test => {
    console.log(`测试: ${test.from} -> ${test.to}`);
    const result = convertData(test.data, test.from, test.to);
    console.log(result.success ? '✅ 成功' : `❌ 失败: ${result.error}`);
    if (result.success && result.data) {
      console.log(`输出长度: ${result.data.length} 字符\n`);
    }
  });
}

testConversions();