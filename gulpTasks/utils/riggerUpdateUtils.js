var git = require("gulp-git");
var fs = require('fs');

var Rigger = require('./rigger.js');
var RiggerUtils = require('./riggerUtils.js');

var RiggerUpdateUitls = {
    updateServices: function () {
        // const fixPath = require('fix-path')();
        if (!Rigger.applicationConfig) Rigger.init();
        var config = RiggerUtils.readJson(Rigger.configPath);
        var group = config.services;
        for (var i = 0; i < group.length; i++) {
            var services = group[i];
            for (var j = 0; j < services.length; j++) {
                var service = services[j];
                RiggerUpdateUitls.updateSingleService(service);
            }
            if(i==group.length-1) {
                console.log(`services: done!!`);
            }
        }
    },

    updateSingleService: function (service) {
        if (!service) return;
        if (!service.src || service.src.length <= 0) return;
        if (RiggerUtils.startWith(service.src, "git:")) {
            service.src = service.src.substring(4);
            RiggerUpdateUitls.updateSingleServiceByGit(service);
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

    },

    updatePlugins: function () {
        if(!Rigger.applicationConfig) Rigger.init();
        var config = RiggerUtils.readJson(Rigger.configPath);
        var group = config.plugins;
        for(var i=0; i<group.length; i++) {
            var plugin = group[i];
            RiggerUpdateUitls.updateSinglePlugin(plugin);
            if(i==group.length-1) {
                console.log(`plugins: done!`);
            }
        }
    },

    updateSinglePlugin: function (plugin) {
        if(!plugin) return;
        if(!plugin.src || plugin.src.length <= 0) return;
        if(RiggerUtils.startWith(plugin.src, "git:")) {
            plugin.src = plugin.src.substring(4);
            RiggerUpdateUitls.updateSinglePluginByGit(plugin);
        }
    },

    updateSinglePluginByGit: function (plugin) {
        // 检查是否需要更新
        var configPath = Rigger.makeThirdPluginConfigPath(plugin.fullName);
        var needUpdate = true;
        var exist = false;
        if(fs.existsSync(configPath)) {
            exist = true;
            var config = RiggerUtils.readJson(configPath);
            var ver = config.version;
            console.log(`real VER:${config.version}, nedd ver:${plugin.version}`);
            if(plugin.version == ver) {
                needUpdate = false;
            }
        }

        var configFile;
        if(needUpdate) {
            if(exist) {
                git.fetch(`origin`, ``, {cwd: `${Rigger.makeThirdPluginRoot(plugin.fullName)}`}, function (err) {
                    if(err) throw err;
                    git.checkout(plugin.version, { args: `-b ${plugin.version}`, cwd: `${Rigger.makeThirdPluginRoot(plugin.fullName)}`}, function (err) {
                        if(err) throw err;
                    })
                })
            }
            else {
                git.clone(plugin.src, {args: `${Rigger.makeThirdPluginRoot(plugin.fullName)}` }, function (err) {
                    if (err) throw err;
                    git.checkout(plugin.version, { args: `-b ${plugin.version}`, cwd: `${Rigger.makeThirdPluginRoot(plugin.fullName)}` }, function (err) {
                        if (err) throw err;
                    })
                });
            }
        }
    },

    updateGroups: function () {
        if(!Rigger.applicationConfig) Rigger.init();
        var config = RiggerUtils.readJson(Rigger.configPath);
        var group = config.packages;
        for(var i=0; i<group.length; i++) {
            var package = group[i];
            RiggerUpdateUitls.updateSingleGroup(package);
            if(i==group.length-1) {
                console.log(`packages: done!!!`);
            }
        }
    },

    updateSingleGroup: function (package) {
        if(!package) return;
        if(!package.src || package.src.length <= 0) return;
        if(RiggerUtils.startWith(package.src, "git:")) {
            package.src = package.src.substring(4);
            RiggerUpdateUitls.updateSingleGroupByGit(package);
        }
    },

    updateSingleGroupByGit: function (package) {
        //检查是否需要更新
        var configPath = Rigger.makeThirdPackageConfigPath(package.fullName);
        var needUpdate = true;
        var exist = false;
        if(fs.existsSync(configPath)) {
            exist = true;
            var config = RiggerUtils.readJson(configPath);
            var ver = config.version;
            console.log(`real VER:${config.version}, nedd ver:${package.version}`);
            if(package.version == ver) {
                needUpdate = false;
            }
        }

            var configFile;
            if(needUpdate) {
                if(exist) {
                    git.fetch(`origin`, ``, {cwd: `${Rigger.makeThirdPackageRoot(package.fullName)}`}, function (err) {
                        if(err) throw err;
                        git.checkout(package.version, { args: `-b ${package.version}`, cwd: `${Rigger.makeThirdPackageRoot(package.fullName)}`}, function (err) {
                            if(err) throw err;
                        })
                    })
                }
                else {
                    git.clone(package.src, { args: `${Rigger.makeThirdPackageRoot(package.fullName)}` }, function (err) {
                        if (err) throw err;
                        git.checkout(package.version, { args: `-b ${package.version}`, cwd: `${Rigger.makeThirdPackageRoot(package.fullName)}` }, function (err) {
                            if (err) throw err;
                        })
                    });
                }
            }
    }

}

module.exports = {
    updateServices: RiggerUpdateUitls.updateServices,
    updatePlugins: RiggerUpdateUitls.updatePlugins,
    updateGroups: RiggerUpdateUitls.updateGroups
}
