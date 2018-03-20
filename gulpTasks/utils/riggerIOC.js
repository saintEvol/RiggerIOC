var fs = require('fs');

var RiggerIOC = {
    applicationConfig: undefined,
    configPath:"./RiggerConfig.json",
    thirdServicesRoot:"./rigger/thirdServices",
    thirdPluginsRoot:"./rigger/thirdPlugins",

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
        return `${RiggerIOC.thirdServicesRoot}/${fullName}`;
    },

    makeThirdPluginRoot:function(fullName){
        return `${RiggerIOC.thirdPluginsRoot}/${fullName}`;
    },

    makeThirdServiceConfigPath:function(fullName){
        return `${RiggerIOC.makeThirdServiceRoot(fullName)}/${fullName}.json`
    }
}

module.exports = {
    // 属性
    configPath:RiggerIOC.configPath,
    thirdServicesRoot:RiggerIOC.thirdServicesRoot,
    thirdPluginsRoot:RiggerIOC.thirdPluginsRoot,

    // 方法
    applicationConfig: RiggerIOC.applicationConfig,
    init: RiggerIOC.init,
    makeThirdServiceRoot:RiggerIOC.makeThirdServiceRoot,
    makeThirdPluginRoot:RiggerIOC.makeThirdPluginRoot,
    makeThirdServiceConfigPath:RiggerIOC.makeThirdServiceConfigPath,
}

var RiggerUtils = require('./riggerIOCUtils.js');
