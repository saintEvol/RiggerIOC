var git = require("gulp-git");
var fs = require('fs');

var Rigger = require('./rigger.js');
var RiggerUtils = require('./riggerUtils.js');

var RiggerIOCUpdateUitls = {
    updateServices: function () {
        // const fixPath = require('fix-path')();
        if (!Rigger.applicationConfig) Rigger.init();
        var config = RiggerUtils.readJson(Rigger.configPath);
        var group = config.services;
        for (var i = 0; i < group.length; i++) {
            var services = group[i];
            for (var j = 0; j < services.length; j++) {
                var service = services[j];
                RiggerIOCUpdateUitls.updateSingleService(service);
            }

        }
    },

    updateSingleService: function (service) {
        if (!service) return;
        if (!service.src || service.src.length <= 0) return;
        if (RiggerUtils.startWith(service.src, "git:")) {
            service.src = service.src.substring(4);
            RiggerIOCUpdateUitls.updateSingleServiceByGit(service);
        }
    },

    updateSingleServiceByGit: function (service) {
        // 检查是否要更新
        var configPath = Rigger.makeThirdServiceConfigPath(service.fullName);
        // console.log(`configPath:${configPath}`);
        var needUpdate = true;
        var exist = false;
        if (fs.existsSync(configPath)) {
            exist = true;
            var config = RiggerUtils.readJson(configPath);
            var ver = config.version;
            console.log(`real VER:${config.version}, need ver:${service.version}`);
            if (service.version == ver) {
                needUpdate = false;
            }
        }

        var configFile;
        if (needUpdate) {
            if (exist) {
                git.fetch(`origin`, ``, {cwd:`${Rigger.makeThirdServiceRoot(service.fullName)}`}, function (err) {
                    if(err) throw err;
                    git.checkout(service.version, { args: `-b ${service.version}`, cwd: `${Rigger.makeThirdServiceRoot(service.fullName)}` }, function (err) {
                        if (err) throw err;
                    })
                })
            }
            else {

                git.clone(service.src, { args: `${Rigger.makeThirdServiceRoot(service.fullName)}` }, function (err) {
                    if (err) throw err;
                    git.checkout(service.version, { args: `-b ${service.version}`, cwd: `${Rigger.makeThirdServiceRoot(service.fullName)}` }, function (err) {
                        if (err) throw err;
                    })
                });
            }
        }

    }
}

module.exports = {
    updateServices: RiggerIOCUpdateUitls.updateServices
}
