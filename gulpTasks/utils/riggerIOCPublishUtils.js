var ts = require("gulp-typescript"); // 需要安装包
var gulp = require("gulp");
var sorter = require("gulp-typescript-sort");
var concat = require('gulp-concat'); // 需要安装包
var rename = require("gulp-rename");
var merge = require("merge-stream");
var fs = require('fs');
var filter = require("gulp-filter");

var Riggerioc = require('./riggerIOC.js');
var RiggerIOCUtils = require('./riggerIOCUtils.js')
var RiggerIOCPublishUtils = {
    /**
     * 发布,发布时根据配置的工程类型进行不同的发布
     */
    publish: function () {
        var tsPro = RiggerIOCUtils.createTSProject();
        // console.log(` start publish, Rigger:${Rigger.toString()}, init:${Rigger.init}, config:${Rigger.applicationConfig}`); 
        
        var tsResult = gulp.src("src/core/**/*.ts").pipe(sorter()).pipe(tsPro());
        tsResult.dts.pipe(gulp.dest("./dist/riggerIOC/dts"));
        tsResult.js.pipe(concat("riggerIOC.min.js")).pipe(gulp.dest("./dist/riggerIOC/bin"));        
    },
}

/**
 * 暴露的方法或属性
 */
module.exports = {
    // 发布
    publish: RiggerIOCPublishUtils.publish
}