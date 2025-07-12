#!/usr/bin/env node

// 简单的转换测试脚本
console.log('开始测试代码转换器...\n');

// 测试数据
const testData = {
  json: `{"name": "张三", "age": 30}`,
  yaml: `name: 张三\nage: 30`,
  markdown: `# 标题\n\n这是**粗体**文本。`,
  html: `<h1>标题</h1><p>这是<strong>粗体</strong>文本。</p>`
};

// 模拟转换测试
const tests = [
  // JSON测试
  { name: 'JSON -> YAML', input: testData.json, from: 'json', to: 'yaml' },
  { name: 'JSON -> XML', input: testData.json, from: 'json', to: 'xml' },
  { name: 'JSON -> CSV', input: testData.json, from: 'json', to: 'csv' },
  { name: 'JSON -> Base64', input: testData.json, from: 'json', to: 'base64' },
  { name: 'JSON -> Markdown', input: testData.json, from: 'json', to: 'markdown' },
  { name: 'JSON -> HTML', input: testData.json, from: 'json', to: 'html' },
  
  // 标记语言测试
  { name: 'Markdown -> HTML', input: testData.markdown, from: 'markdown', to: 'html' },
  { name: 'HTML -> Markdown', input: testData.html, from: 'html', to: 'markdown' },
  { name: 'Markdown -> LaTeX', input: testData.markdown, from: 'markdown', to: 'latex' },
  { name: 'Markdown -> RST', input: testData.markdown, from: 'markdown', to: 'rst' },
];

console.log('测试用例:');
tests.forEach((test, i) => {
  console.log(`${i + 1}. ${test.name}`);
  console.log(`   输入: ${test.input.slice(0, 30)}...`);
  console.log(`   格式: ${test.from} -> ${test.to}`);
  
  // 这里应该调用实际的转换函数
  // const result = convertData(test.input, test.from, test.to);
  // console.log(result.success ? '   ✅ 成功' : `   ❌ 失败: ${result.error}`);
  
  console.log('   📝 待测试\n');
});

console.log('=== 手动测试建议 ===');
console.log('1. 在浏览器中打开应用');
console.log('2. 测试每个格式的示例按钮');
console.log('3. 尝试以下转换:');
console.log('   - JSON ↔ YAML ↔ XML ↔ CSV');
console.log('   - Markdown ↔ HTML ↔ LaTeX ↔ RST');
console.log('   - 任意格式 ↔ Base64');
console.log('4. 检查错误处理和边界情况');
console.log('5. 验证UI分类显示是否正确');

console.log('\n✅ 测试脚本完成');