var ts = require("gulp-typescript"); // 需要安装包
var gulp = require("gulp");
var sorter = require("gulp-typescript-sort");
var concat = require('gulp-concat'); // 需要安装包
var rename = require("gulp-rename");
var fs = require('fs');

var Rigger = require('./rigger.js');

var RiggerUtils = {
    removeCommentsInJson: function (str) {
        var ret = str.toString().replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
        return ret;
    },

    readJson: function (path) {
        return JSON.parse(RiggerUtils.removeCommentsInJson(fs.readFileSync(path)))
    },
    /**
     * 创建一个TS工程
     */
    createTSProject: function () {
        return ts.createProject({
            module: "commonjs",
            // outFile: "game.min.js",
            target: "es5",
            sourceMap: true,
            experimentalDecorators: true,
            lib: ["dom", "es2015"],
            emitDecoratorMetadata: true,
            declaration: true
        });
    },

    /**
     * 创建一个TS工程
     */
    createTSProject1: function () {
        return ts.createProject({
            module: "commonjs",
            outFile: "game.min.js",
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
    },

    findIndex:function(arr, fun){
        for(var i = 0; i < arr.length; ++i){
            if(fun(arr, arr[i])){
                return i;
            }
        }

        return -1;
    }
}

/**
 * 暴露的方法或属性
 */
module.exports = {
    /**
     * 移除JSON注释
     */
    removeCommentsInJson: RiggerUtils.removeCommentsInJson,

    createTSProject: RiggerUtils.createTSProject,
    createTSProject1:RiggerUtils.createTSProject1,
    readJson: RiggerUtils.readJson,
    startWith: RiggerUtils.startWith,
    findIndex:RiggerUtils.findIndex
}