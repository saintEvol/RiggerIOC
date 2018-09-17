var fs = require('fs');

var Rigger = {
    applicationConfig: undefined,
    configPath:"./RiggerConfig.json",
    thirdServicesRoot:"./rigger/thirdServices",
    thirdPluginsRoot:"./rigger/thirdPlugins",
    thirdPackagesRoot:"./rigger/thirdPackages",
    kernelServiceRoot:"./rigger/kernel",

    init: function () {
        if (fs.existsSync(this.configPath)) {
            console.log(`init rigger, config path:${this.configPath}`);            
            this.applicationConfig = JSON.parse(RiggerUtils.removeCommentsInJson(fs.readFileSync(this.configPath)));
            console.log(`init rigger, done`);                        
        }
        else {
            throw new Error("app config not exist!");
        }
    },

    makeThirdServiceRoot:function(fullName){
        return `${Rigger.thirdServicesRoot}/${fullName}`;
    },

    makeThirdPluginRoot:function(fullName){
        return `${Rigger.thirdPluginsRoot}/${fullName}`;
    },
    
    makeThirdPackageRoot:function(fullName){
        return `${Rigger.thirdPackagesRoot}/${fullName}`;
    },

    makeThirdServiceConfigPath:function(fullName){
        return `${Rigger.makeThirdServiceRoot(fullName)}/${fullName}.json`;
    },

    makeThirdPluginConfigPath:function(fullName){
        return `${Rigger.makeThirdPluginRoot(fullName)}/dts/config/${fullName}.json`;
    },

    makeThirdPackageConfigPath:function(fullName){
        return `${Rigger.makeThirdPackageRoot(fullName)}/${fullName}.json`;
    },

    makeKernelConfigPath:function(fullName){
        return `${Rigger.kernelServiceRoot}/dts/kernelServices/${fullName}`;
    }
    
}

module.exports = {
    // 属性
    configPath:Rigger.configPath,
    thirdServicesRoot:Rigger.thirdServicesRoot,
    thirdPluginsRoot:Rigger.thirdPluginsRoot,
    kernelServiceRoot:Rigger.kernelServiceRoot,

    // 方法
    applicationConfig: Rigger.applicationConfig,
    init: Rigger.init,
    makeThirdServiceRoot:Rigger.makeThirdServiceRoot,
    makeThirdPluginRoot:Rigger.makeThirdPluginRoot,
    makeThirdPackageRoot:Rigger.makeThirdPackageRoot,
    makeThirdServiceConfigPath:Rigger.makeThirdServiceConfigPath,
    makeThirdPluginConfigPath:Rigger.makeThirdPluginConfigPath,
    makeThirdPackageConfigPath:Rigger.makeThirdPackageConfigPath,
    makeKernelConfigPath:Rigger.makeKernelConfigPath,
}

var RiggerUtils = require('./riggerUtils.js');
