var ts = require("gulp-typescript"); // 需要安装包
var gulp = require("gulp");
var sorter = require("gulp-typescript-sort");
var concat = require('gulp-concat'); // 需要安装包
var rename = require("gulp-rename");
var fs = require('fs');
var merge = require("merge-stream");

var Rigger = require('./rigger.js');
var RiggerUtils = require('./riggerUtils.js')

var RiggerBuildUitls = {
    reConfig: function () {
        Rigger.init();
        if (!RiggerBuildUitls.checkBuild()) return;
        RiggerBuildUitls.buildConfigs();
    },

    build: function () {
        Rigger.init();
        if (!RiggerBuildUitls.checkBuild()) return;
        RiggerBuildUitls.buildConfigs();
        RiggerBuildUitls.buildBin();
    },

    buildConfigs: function () {
        // 初始化Rigger配置
        RiggerBuildUitls.buildRiggerConfigFile();
        RiggerBuildUitls.buildServiceConfigFiles();
    },

    buildRiggerConfigFile: function () {
        if (!fs.existsSync(Rigger.configPath)) throw new Error(`build rigger config failed:can not find ${Rigger.configPath}`);
        var binRoot = Rigger.applicationConfig.binRoot;
        if (!binRoot || binRoot.length <= 0) return;

        return gulp.src(Rigger.configPath).pipe(gulp.dest(`${binRoot}/rigger/riggerConfigs`));
    },

    /**
     * 初始化Rigger的配置
     */
    initRiggerConfigFile: function () {
        if (!fs.existsSync(Rigger.configPath)) {
            return gulp.src("./rigger/RiggerConfig.config").pipe(rename("RiggerConfig.json")).pipe(gulp.dest(`./`));
        }
    },

    buildServiceConfigFiles: function () {
        RiggerBuildUitls.buildKernelServiceConfigFiles();        
        RiggerBuildUitls.buildThirdServiceConfigFiles();
        RiggerBuildUitls.buildCustomServiceConfigFiles();
        RiggerBuildUitls.buildPackageConfigFiles();
    },

    buildPackageConfigFiles:function(){
        var pkgRoot = `./rigger/thirdPackages`;
        if(fs.existsSync(pkgRoot)){
            var dirs = fs.readdirSync(pkgRoot);
            for (var i = 0; i < dirs.length; ++i) {
                var dir = dirs[i];
                // console.log("config dir:" + Rigger.makeThirdServiceConfigPath(dir));
                let connectbinRoot = `./bin/rigger/riggerConfigs/serviceConfigs/rigger.service.ConnectService.json`; 
                let mainLogicbinRoot = `./bin/rigger/riggerConfigs/serviceConfigs/rigger.service.MainLogicService.json`;
                if(fs.existsSync(connectbinRoot) && fs.existsSync(mainLogicbinRoot)) { 
                    return; //bin文件夹下已经存在json文件时,则build命令不会写入新的json文件
                }
                else if(fs.existsSync(connectbinRoot) && !fs.existsSync(mainLogicbinRoot)) {
                    gulp.src(`${pkgRoot}/${dir}/customServiceConfigs/rigger.service.MainLogicService.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
                }
                else if(!fs.existsSync(connectbinRoot) && fs.existsSync(mainLogicbinRoot)) {
                    gulp.src(`${pkgRoot}/${dir}/customServiceConfigs/rigger.service.ConnectService.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
                }
                else {
                    gulp.src(`${pkgRoot}/${dir}/customServiceConfigs/*.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
                }
            }
        }
    },

    buildKernelServiceConfigFiles: function () {
        var ksRoot = Rigger.kernelServiceRoot;
        if(fs.existsSync(ksRoot)){
            // var dirs = fs.readdirSync(ksRoot);
            // for (var i = 0; i < dirs.length; ++i) {
            //     var dir = dirs[i];
            //     // console.log("config dir:" + Rigger.makeThirdServiceConfigPath(dir));
            //     gulp.src(Rigger.makeKennelServiceConfigPath(dir)).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
            // }
            gulp.src(`${Rigger.makeKernelConfigPath("rigger.service.EventService")}/*.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
            gulp.src(`${Rigger.makeKernelConfigPath("rigger.service.KernelService")}/*.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
            gulp.src(`${Rigger.makeKernelConfigPath("rigger.service.PoolService")}/*.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));

            // gulp.src(`${ksRoot}/dts/kernelServices/*/*.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
        }
    },

    buildThirdServiceConfigFiles: function () {
        var thirdRoot = Rigger.thirdServicesRoot;
        if (fs.existsSync(thirdRoot)) {
            var dirs = fs.readdirSync(thirdRoot);
            for (var i = 0; i < dirs.length; ++i) {
                var dir = dirs[i];
                // console.log("config dir:" + Rigger.makeThirdServiceConfigPath(dir));
                let dirbinRoot = `${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs/${dir}.json`; 
                if(fs.existsSync(dirbinRoot)) return; //bin文件夹下已经存在json文件时,则build命令不会写入新的json文件
                gulp.src(Rigger.makeThirdServiceConfigPath(dir)).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
            }
        }

    },

    /**
     * 构建自定义服务的配置文件
     */
    buildCustomServiceConfigFiles: function () {
        var root = Rigger.applicationConfig.customServicesRoot;
        if (!root || root.length <= 0) return;
        for (var i = 0; i < root.length; i++) {
            var element = root[i];
            RiggerBuildUitls.doBuildServiceConfigFiles(element, Rigger.applicationConfig.binRoot);
        }
    },

    buildBin: function () {
        var binRoot = Rigger.applicationConfig.binRoot;
        if (!binRoot || binRoot.length <= 0) return;
        var src = [];
        src.push(`./rigger/kernel/bin/rigger.js`);
        // var riggerBin = gulp.src(`./rigger/kernel/bin/rigger.js`);
        RiggerBuildUitls.collectServicesSrc(src);
        src.push(`./rigger/thirdPlugins/**/bin/*.js`);
        RiggerBuildUitls.collectPackagesSrc(src);
        // var pluginsBin = gulp.src(`./rigger/thirdPlugins/**/*.js`);
        return gulp.src(src).pipe(concat("rigger.min.js")).pipe(gulp.dest(`${binRoot}/rigger`));
        // .pipe(gulp.dest(`${binRoot}/rigger`));
    },

    // 
    collectServicesSrc: function (initSrc) {
        var config = Rigger.applicationConfig;
        var depServices = config.services;
        if(!depServices) return initSrc;

        var len = depServices.length;
        var handledServicesMap = {};
        // var bin;
        for (var i = 0; i < len; i++) {
            var sers = depServices[i];
            for (var j = 0; j < sers.length; j++) {
                var ser = sers[j];
                RiggerBuildUitls.collectSingleServiceSrc(ser.fullName, handledServicesMap, initSrc);
            }
        }

        return initSrc;
    },

    collectPackagesSrc:function(initSrc){
        var config = Rigger.applicationConfig;
        var depPackages = config.packages;
        if(!depPackages) return initSrc;

        var len = depPackages.length;
        for(var i = 0; i < len; ++i){
            // console.log(`./rigger/thirdPackages/${depPackages[i].fullName}/bin/*.js`);
            initSrc.push(`./rigger/thirdPackages/${depPackages[i].fullName}/bin/*.js`);
        }

        return initSrc;
    },

    collectSingleServiceSrc: function (serviceName, builtMap, src) {
        // 已经构建过了不再重复
        if (builtMap[serviceName]) return src;

        var thirdServicePath = "./rigger/thirdServices";
        var configPath = `${thirdServicePath}/${serviceName}/${serviceName}.json`;
        // 检查服务是否存在     
        if (fs.existsSync(configPath)) {
            // console.log("srvice config:" + configPath);
            // 读取服务的配置文件
            var config = RiggerUtils.readJson(configPath);
            var depServices = config.services;
            if (depServices) {
                for (var i = 0; i < depServices.length; i++) {
                    var sers = depServices[i];
                    for (var j = 0; j < sers.length; j++) {
                        var ser = sers[j];
                        RiggerBuildUitls.collectSingleServiceSrc(ser.fullName, builtMap, src);

                    }
                }
            }
        }
        // 检查BIN文件
        var binPath = `${thirdServicePath}/${serviceName}/bin/${serviceName}.min.js`;
        if (fs.existsSync(binPath)) {
            src.push(binPath);
        }
        builtMap[serviceName] = true;
        // 不存在的情况暂时不处理
        return src;
    },

    doBuildServiceConfigFiles(fromRoot, destRoot) {
        if (!fs.existsSync(fromRoot)) return;
        var dirs = fs.readdirSync(fromRoot);
        var binRoot = Rigger.applicationConfig.binRoot;
        if (!binRoot || binRoot.length <= 0) return;

        var configFilePath;
        for (var index = 0; index < dirs.length; index++) {
            var dir = dirs[index];
            // console.log(`dir:${dir}`);
            configFilePath = `${fromRoot}/${dir}/*.json`;
            gulp.src(configFilePath).pipe(gulp.dest(`${binRoot}/rigger/riggerConfigs/serviceConfigs`));
        }
    },

    checkBuild: function () {
        if (!Rigger.applicationConfig) Rigger.init();
        if (Rigger.applicationConfig.projectType === "rigger") {
            throw new Error("Rigger Project can not be built!");
        }
        return true;
    }




};

module.exports = {
    build: RiggerBuildUitls.build,
    buildConfigs: RiggerBuildUitls.buildConfigs,
    initRiggerConfigFile: RiggerBuildUitls.initRiggerConfigFile,
    reConfig: RiggerBuildUitls.reConfig,
}