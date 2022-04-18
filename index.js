#! /usr/bin/env node
// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

// 用于检查入口文件是否正常执行

const inquirer = require('inquirer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const figlet = require('figlet');
const TEMPLATE_URL_typescript = path.join(__dirname, 'templates_ts'); // ts模板文件目录
const TEMPLATE_URL_javascript = path.join(__dirname, 'templates_js'); // js模板文件目录

figlet('Guns-V7 Cli', function (err, data) {
    if (err) {
        console.log('Something went wrong...', err);
        return;
    }
    console.log(data);
    setInquirer();
});
function setInquirer() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'please enter the project name',
                default: 'guns-v7-frontend',
            },
            {
                type: 'input',
                name: 'version',
                message: 'please enter the version',
                default: 'v1.0.0',
            },
            {
                type: 'list',
                name: 'ts',
                message: 'please select the language',
                choices: ['typescript', 'javascript'],
                default: 'typescript',
            },
        ])
        .then((answer) => {
            const cwdUrl = process.cwd(); // 对应的控制台所在目录
            copyFile(
                answer && answer.ts === 'javascript'
                    ? TEMPLATE_URL_javascript
                    : TEMPLATE_URL_typescript,
                cwdUrl,
                [],
                answer
            );
        });
}

const copyFile = function (srcPath, tarPath, filter = [], answer = {}) {
    fs.readdir(srcPath, function (err, files) {
        if (err === null) {
            files.forEach(function (filename) {
                let filedir = path.join(srcPath, filename);
                let filterFlag = filter.some((item) => item === filename);
                if (!filterFlag) {
                    fs.stat(filedir, function (errs, stats) {
                        let isFile = stats.isFile();
                        if (isFile) {
                            // 复制文件
                            const destPath = path.join(tarPath, filename);
                            ejs.renderFile(filedir, answer).then((data) => {
                                // 生成 ejs 处理后的模版文件
                                fs.writeFileSync(destPath, data);
                            });
                        } else {
                            // 创建文件夹
                            let tarFiledir = path.join(tarPath, filename);
                            fs.mkdir(tarFiledir, (err) => {});
                            copyFile(filedir, tarFiledir, filter); // 递归
                        }
                    });
                }
            });
        } else {
            if (err) console.error(err);
        }
    });
};
