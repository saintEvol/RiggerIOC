var gulp = require("gulp");
var ts = require("gulp-typescript"); // 需要安装包
var glob = require("glob");
var path = require("path");
var del = require("del");
var sd = require("silly-datetime");
var colors = require("colors");
var nodemon = require("gulp-nodemon");
var runSeq = require("gulp-sequence");

var RiggerPublishUtils = require("./utils/riggerPublishUtils.js");
var Rigger = require("./utils/rigger.js");

gulp.task("publish", ["initApplicationConfig"], function(){
    RiggerPublishUtils.publish();     
})

gulp.task("initApplicationConfig", function(){
    return Rigger.init();
})