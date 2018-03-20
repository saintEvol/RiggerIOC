var ts = require("gulp-typescript"); // 需要安装包
var gulp = require("gulp");
var sorter = require("gulp-typescript-sort");
var concat = require('gulp-concat'); // 需要安装包
var rename = require("gulp-rename");
var fs = require('fs');

var Rigger = require('./riggerIOC.js');

var RiggerIOCUtils = {
    removeCommentsInJson: function (str) {
        var ret = str.toString().replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
        return ret;
    },

    readJson: function (path) {
        return JSON.parse(RiggerIOCUtils.removeCommentsInJson(fs.readFileSync(path)))
    },

    /**
     * 创建一个TS工程
     */
    createTSProject: function () {
        return ts.createProject({
            module: "commonjs",
            // outFile:"rigger.min.js",
            target: "es5",
            sourceMap: true,
            experimentalDecorators: true,
            lib: ["dom", "es2015"],
            emitDecoratorMetadata: true,
            declaration: true
        });
    },

    startWith: function (originStr, str) {
        if (originStr.indexOf(str) == 0) {
            return true;
        }

        return false;
    }
}

/**
 * 暴露的方法或属性
 */
module.exports = {
    /**
     * 移除JSON注释
     */
    removeCommentsInJson: RiggerIOCUtils.removeCommentsInJson,

    createTSProject: RiggerIOCUtils.createTSProject,
    readJson: RiggerIOCUtils.readJson,
    startWith: RiggerIOCUtils.startWith
}