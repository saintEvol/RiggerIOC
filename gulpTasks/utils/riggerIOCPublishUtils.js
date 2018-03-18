var ts = require("gulp-typescript"); // 需要安装包
var gulp = require("gulp");
var sorter = require("gulp-typescript-sort");
var concat = require('gulp-concat'); // 需要安装包
var rename = require("gulp-rename");
var merge = require("merge-stream");
var fs = require('fs');
var filter = require("gulp-filter");

var Rigger = require('./rigger.js');
var RiggerUtils = require('./riggerUtils.js')
var RiggerIOCPublishUtils = {
    /**
     * 发布,发布时根据配置的工程类型进行不同的发布
     */
    publish: function () {
        // console.log(` start publish, Rigger:${Rigger.toString()}, init:${Rigger.init}, config:${Rigger.applicationConfig}`); 
        var appConfig = Rigger.applicationConfig;
        if (!appConfig) Rigger.init();
        var proType = appConfig.projectType;

        switch (proType) {
            case "rigger":
                RiggerIOCPublishUtils.publishRigger(appConfig.srcRoot, appConfig.outRoot);
                break;
            case "service":
                RiggerIOCPublishUtils.publishServices();
                break;
            case "plugin":
                RiggerIOCPublishUtils.publishPlugins();
                break;
            default:
                break;
        }
    },

    /**
     * 发布Rigger
     */
    publishRigger: function (srcDir, outDir) {
        console.log(`publish rigger, scrDir:${srcDir}, outDir:${outDir}`);
        this.publishRiggerKernel(srcDir, outDir);
        this.publishGulpTasksForRigger(srcDir, outDir);
        this.publishRiggerConfig(srcDir, outDir);
    },

    publishServices: function () {
        var appConfig = Rigger.applicationConfig;
        if (!appConfig) Rigger.init();
        var srcRoot = appConfig.srcRoot;
        var dirs = fs.readdirSync(srcRoot);
        let riggerStream = gulp.src("./rigger/kernel/**/*.ts");
        var servicePath;
        for (var index = 0; index < dirs.length; index++) {
            var dir = dirs[index];
            // console.log(`dir:${dir}`);
            RiggerIOCPublishUtils.publishSingleService(riggerStream, srcRoot, dir)
        }
    },

    publishPlugins: function () {
        var appConfig = Rigger.applicationConfig;
        if (!appConfig) Rigger.init();
        var srcRoot = appConfig.srcRoot;
        var dirs = fs.readdirSync(srcRoot);
        var riggerStream = gulp.src("./rigger/kernel/**/*.ts");
        var depServiceStream = gulp.src("./rigger/thirdServices/**/*.ts");
        var libStream = gulp.src(Rigger.applicationConfig.libPathes);
        var commonStream = merge(riggerStream, depServiceStream, libStream);
        var pluginPath;
        for (var index = 0; index < dirs.length; index++) {
            var dir = dirs[index];
            RiggerIOCPublishUtils.publishSinglePlugin(commonStream, srcRoot, dir);
        }

    },

    publishSinglePlugin: function (commonStream, root, pluginName) {
        var tsProject = RiggerUtils.createTSProject();
        var pluginRoot = `${root}/${pluginName}`;
        console.log(`plugin src:${pluginRoot}/**/*.ts`);

        var tsResult = merge(commonStream,
            gulp.src([`${pluginRoot}/**/*.ts`])
                .pipe(sorter(false))).pipe(tsProject());
        var outRoot = Rigger.applicationConfig.outRoot;
        tsResult.dts.pipe(gulp.dest(`${outRoot}/thirdPlugins/${pluginName}/dts`));
        tsResult.js.pipe(concat(`${pluginName}.min.js`)).pipe(gulp.dest(`${outRoot}/thirdPlugins/${pluginName}/bin`));

    },

    publishSingleService: function (commonStream, root, serviceName) {
        var tsProject = RiggerUtils.createTSProject();
        var serviceRoot = `${root}/${serviceName}`;
        console.log("read json:" + `${serviceRoot}/config/${serviceName}.json`);
        var config = RiggerUtils.readJson(`${serviceRoot}/config/${serviceName}.json`);
        var depStream = commonStream;
        if (config && config.services && config.services.length > 0) {
            depStream = RiggerIOCPublishUtils.collectDepServicesStream(commonStream, root, config.services);
        }

        var serviceStream = gulp.src([`${serviceRoot}/**/*.ts`, `!${serviceRoot}/**/plugins`, `!${serviceRoot}/**/plugins/**`]).pipe(sorter(false));

        var tsResult = merge(depStream, serviceStream)
            .pipe(tsProject());

        var outRoot = Rigger.applicationConfig.outRoot;
        // console.log(`out root:${outRoot}, path:${serviceRoot}/**/*.ts`);
        tsResult.dts.pipe(gulp.dest(`${outRoot}/thirdServices/${serviceName}/dts`));
        tsResult.js.pipe(concat(`${serviceName}.min.js`)).pipe(gulp.dest(`${outRoot}/thirdServices/${serviceName}/bin`));
        // 发布配置
        gulp.src(`${serviceRoot}/config/*.json`).pipe(gulp.dest(`${outRoot}/thirdServices/${serviceName}`));
        // tsResult.dts.pipe(gulp.dest(`${outRoot}/services`));
    },

    collectSingleServiceStream:function(commonStream, root, serviceName){
        var serviceRoot = `${root}/${serviceName}`;        
        var serviceStream = gulp.src([`${serviceRoot}/**/*.ts`, `!${serviceRoot}/**/plugins`, `!${serviceRoot}/**/plugins/**`]).pipe(sorter(false));
        return merge(commonStream, serviceStream);        
    },

    /**
     * 收集依赖的服务的代码流
     */
    collectDepServicesStream(commonStream, root, services) {
        for (var i = 0; i < services.length; ++i) {
            for (var j = 0; j < services.length; ++j) {
                var serviceName = services[i][j].fullName;
                console.log("dep service name:" + serviceName);
                var tsProject = RiggerUtils.createTSProject();
                var stream = RiggerIOCPublishUtils.collectSingleServiceStream(commonStream, root, serviceName);
                var tempResult = stream.pipe(tsProject());
                commonStream = merge(commonStream, tempResult.dts);
            }
        }

        return commonStream;
    },



    /**
     * 发布Rigger核心库
     */
    publishRiggerKernel: function (srcDir, outDir) {
        outDir = `${outDir}/rigger/kernel`;
        var tsProject = RiggerUtils.createTSProject();
        var tsResult = gulp.src([`${srcDir}/**/*.ts`]).pipe(sorter(false))
            .pipe(tsProject());
        tsResult.dts.pipe(gulp.dest(`${outDir}/dts`));
        tsResult.js.pipe(concat("rigger.js")).pipe(gulp.dest(`${outDir}/bin`))
    },

    /**
     * 发布Rigger的gulp任务文件
     */
    publishGulpTasksForRigger: function (srcDir, outDir) {
        // outDir = `${outDir}/rigger/`
        gulp.src(`./rigger/gulpTasks/**/*`).pipe(gulp.dest(`${outDir}/rigger/gulpTasks`));
    },

    publishRiggerConfig: function (srcDir, outDir) {
        gulp.src(Rigger.configPath).pipe(rename("RiggerConfig.config")).pipe(gulp.dest(`${outDir}/rigger`));
        // 发布核心服务的配置
    },
}

/**
 * 暴露的方法或属性
 */
module.exports = {
    // 发布
    publish: RiggerIOCPublishUtils.publish
}