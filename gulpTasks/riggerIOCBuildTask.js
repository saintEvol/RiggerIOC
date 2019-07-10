var gulp = require("gulp");

gulp.task("rigger-build", ["init-rigger-config"], function(){
    RiggerIOCBuildUtils.build();
})


gulp.task("rigger-config", ["init-rigger-config"], function(){
    return RiggerIOCBuildUtils.reConfig();
})

gulp.task("rigger-update",function(){
    return RiggerIOCUpdateUtils.updateServices();
})


gulp.task("init-rigger-config", function(){
    return RiggerIOCBuildUtils.initRiggerConfigFile()
})