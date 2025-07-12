// 测试代码转换器的所有转换功能
const { convertData, formatInfo } = require('./apps/code-converter/utils.ts');

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

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>张三</name>
  <age>30</age>
  <city>北京</city>
  <hobbies>
    <hobby>读书</hobby>
    <hobby>旅行</hobby>
  </hobbies>
</person>`,

  csv: `name,age,city,hobbies
张三,30,北京,"读书,旅行"
李四,25,上海,"游戏,电影"`,

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
</ul>
<a href="https://example.com">链接</a>`,

  latex: `\\section{标题}
\\subsection{二级标题}

这是一段\\textbf{粗体}文本和\\textit{斜体}文本。

\\begin{itemize}
  \\item 列表项 1
  \\item 列表项 2
\\end{itemize}

\\href{https://example.com}{链接}`,

  rst: `标题
====

二级标题
--------

这是一段 **粗体** 文本和 *斜体* 文本。

- 列表项 1
- 列表项 2

\`链接 <https://example.com>\`_`
};

// 数据格式列表
const dataFormats = ['json', 'yaml', 'xml', 'csv'];
const markupFormats = ['markdown', 'html', 'latex', 'rst'];
const allFormats = [...dataFormats, ...markupFormats, 'base64'];

// 测试结果
let results = {
  success: 0,
  failed: 0,
  errors: []
};

function testConversion(source, target, data) {
  try {
    console.log(`测试 ${source} -> ${target}`);
    const result = convertData(data, source, target);
    
    if (result.success) {
      console.log(`✅ ${source} -> ${target} 成功`);
      results.success++;
      return result.data;
    } else {
      console.log(`❌ ${source} -> ${target} 失败: ${result.error}`);
      results.failed++;
      results.errors.push(`${source} -> ${target}: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.log(`💥 ${source} -> ${target} 异常: ${error.message}`);
    results.failed++;
    results.errors.push(`${source} -> ${target}: ${error.message}`);
    return null;
  }
}

console.log('开始测试代码转换器...\n');

// 1. 测试数据格式互转
console.log('=== 测试数据格式互转 ===');
for (const source of dataFormats) {
  for (const target of dataFormats) {
    if (source !== target && testData[source]) {
      testConversion(source, target, testData[source]);
    }
  }
}

// 2. 测试标记语言互转
console.log('\n=== 测试标记语言互转 ===');
for (const source of markupFormats) {
  for (const target of markupFormats) {
    if (source !== target && testData[source]) {
      testConversion(source, target, testData[source]);
    }
  }
}

// 3. 测试数据格式到标记语言
console.log('\n=== 测试数据格式到标记语言 ===');
for (const source of dataFormats) {
  for (const target of markupFormats) {
    if (testData[source]) {
      testConversion(source, target, testData[source]);
    }
  }
}

// 4. 测试Base64编解码
console.log('\n=== 测试Base64编解码 ===');
for (const format of ['json', 'markdown']) {
  if (testData[format]) {
    // 编码
    const encoded = testConversion(format, 'base64', testData[format]);
    if (encoded) {
      // 解码
      testConversion('base64', format, encoded);
    }
  }
}

// 5. 输出测试结果
console.log('\n=== 测试结果汇总 ===');
console.log(`总计测试: ${results.success + results.failed} 个转换`);
console.log(`成功: ${results.success}`);
console.log(`失败: ${results.failed}`);

if (results.errors.length > 0) {
  console.log('\n=== 失败详情 ===');
  results.errors.forEach(error => console.log(`- ${error}`));
}

if (results.failed === 0) {
  console.log('\n🎉 所有转换测试通过！');
} else {
  console.log('\n⚠️  发现问题，需要修复');
}