var gulp = require("gulp");
var exec = require("child_process").exec
var uglify = require('gulp-uglify'); // 需要安装包

var RiggerPublishUtils = require("./utils/riggerIOCPublishUtils.js");
var RiggerIOC = require("./utils/riggerIOC.js");

gulp.task("publish", function(){
    var cmd = 'tsc-plus -p "./" --outDir dist/riggerIOC --reorderFiles true --outFile dist/riggerIOC/bin/riggerIOC.min.js ';
    exec(cmd, function(error, stdout, stdErr){
        console.log("std out:" + stdout);
        console.log("std err:" + stdErr);
        RiggerPublishUtils.publish();     
        gulp.src(["dist/riggerIOC/bin/riggerIOC.min.js"]).pipe(uglify()).pipe(gulp.dest("dist/riggerIOC/bin/"))
    })
})

gulp.task("initApplicationConfig", function(){
    return RiggerIOC.init();
})