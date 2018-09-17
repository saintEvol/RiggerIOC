var git = require("gulp-git");
var fs = require('fs');

var Rigger = require('./rigger.js');
var RiggerUtils = require('./riggerUtils.js');

var RiggerInitUitls = {
    init: function () {
        if(Rigger.applicationConfig) Rigger.init();
        var config = RiggerUtils.readJson(Rigger.configPath);

        var tempProject = config.templateEngineering[0];
        RiggerInitUitls.initByGit(tempProject);
    },

    initByGit: function(tempProject) {
        if(!tempProject) return;
        if(!tempProject.src || tempProject.src.length <= 0) return;
        if(RiggerUtils.startWith(tempProject.src, "git:")) {
            tempProject.src = tempProject.src.substring(4);
            git.clone(tempProject.src, {args: `${tempProject.dest}`}, function (err) {
                if(err) throw err;
                console.log(`Tips: 创建成功,请将git地址替换为自己的git项目地址！`);
            })
        }
    }
}

module.exports = {
    init: RiggerInitUitls.init
}
