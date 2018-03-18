var gulp = require("gulp");
var del = require("del");
var sd = require("silly-datetime");
var colors = require("colors");
var nodemon = require("gulp-nodemon");
var runSeq = require("gulp-sequence");
var RiggerBuildUtils = require("./utils/riggerBuildUtils.js");
var RiggerUpdateUtils = require("./utils/riggerUpdateUtils.js");


gulp.task("rigger-build", ["init-rigger-config"], function(){
    RiggerBuildUtils.build();
})


gulp.task("rigger-config", ["init-rigger-config"], function(){
    return RiggerBuildUtils.reConfig();
})

gulp.task("rigger-update",function(){
    return RiggerUpdateUtils.updateServices();
})


gulp.task("init-rigger-config", function(){
    return RiggerBuildUtils.initRiggerConfigFile()
})