var gulp = require("gulp");
var del = require("del");
var sd = require("silly-datetime");
var colors = require("colors");
var nodemon = require("gulp-nodemon");
var runSeq = require("gulp-sequence");


gulp.task("riggerIOCInit", ["init-rigger-config"], function(){
    RiggerBuildUtils.build();
})
