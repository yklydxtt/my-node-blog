const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 文件名
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log');
// 创建 read stream
const readStream = fs.createReadStream(fileName);

// 创建readline对象
const rl = readline.createInterface({
    input: readStream
});

let chrome = 0;
let sum = 0;

// 逐行读取
rl.on('line', (lineData) => {
    if (!lineData) {
        return;
    }
    // 记录总行数
    sum++;
    const arr = lineData.split('--');
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        // 累计Chrome的数量
        chrome++;
    }
})

// 监听读取完成
rl.on('close', () => {
    console.log('Chrome占比' + chrome / sum);
})