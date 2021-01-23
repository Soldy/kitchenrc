'use strict';

const startTime = (+new Date());
const fs = require('fs');
const pluginsBase = require('./plugins.js').pluginsClass;
const appsBase = require('./apps.js').appsClass;
const modulesBase = require('./modules.js').modulesClass;
const tools = require('./tools.js').tools;

exports.main = () => {
    /*
     * @param {string} out
     * @private
    */
    let debugOut = (out) => {
        console.log(out);
    };
    /*
     * @private
    */
    let plugins = new pluginsBase();
    /*
     * @private
    */
    let apps = new appsBase();
    /*
     * @private
    */
    let moduls = new modulesBase();
    /*
     * @private
     * @var {array}
    */
    let options = [];
    /*
     * @private
     * @var {string}
    */
    let mod = process.argv[1];
    /*
     * @private
     * @var {integer}
    */
    let argvStart = 2;    
    /*
     * @private
    */
    let clear = () => {
        tools.deleteFile('server.js');
        tools.deleteFile('install.js');
        tools.deleteFile('db.mysql');
    };
    /*
     * @private
    */
    let buildCheck = () => {
        if (typeof options === 'undefined')
            tools.die('nincs app nev megadva');
        if (typeof apps.db.details[options[0]] === 'undefined')
            tools.die('app ' + options[0] + ' nem letezik');
    };
    /*
     * @private
    */
    let buildApp = () => {
        let startTime = (+new Date());
        let builded = moduls.includesRead();
        builded += moduls.moduleBuilder(
            apps.db.details[options[0]].modules
        );
        builded += plugins.pluginBuilder(
            apps.db.details[options[0]].plugins
        );
        builded += moduls.moduleOnload();
        fs.writeFileSync(
            'server.js', 
            builded
        );
        let generationTime = (+new Date) - startTime;
        debugOut(
            [
                'server', 
                builded.match(/[^\r\n]+/g).length, 
                builded.length, 
                generationTime
            ]
        );
    };
    /*
     * @private
    */
    let buildInstall = () => {
        let startTime = (+new Date());
        
        let builded = moduls.includesRead();
        builded += moduls.moduleBuilder(
            apps.db.details[options[0]].modules
        );
        builded += plugins.pluginBuilder(
            apps.db.details[options[0]].plugins
        );
        builded += moduls.moduleOnload();
        fs.writeFileSync('install.js', builded);
        let generationTime = (+new Date) - startTime;
        debugOut(
            [
                'install', 
                builded.match(/[^\r\n]+/g).length,
                builded.length, 
                generationTime
            ]
        );
    };
    /*
     * @private
    */
    let buildSQL = () => {
        let startTime = (+new Date());
        
        let builded = moduls.mysqlRead(options[0]);
        builded += plugins.mysqlBuilder(options[0]);
        fs.writeFileSync(
            'db.mysql', 
            builded
        );
        let generationTime = (+new Date) - startTime;
        debugOut(
            [
                'db', 
                builded.match(/[^\r\n]+/g).length, 
                builded.length, 
                generationTime
            ]
        );
    };
    /*
     * constructpr
    */
    apps.modules = moduls;
    apps.plugins = plugins;
    moduls.apps = apps;
    moduls.plugins = plugins;
    plugins.apps = apps;
    plugins.modules = moduls;
    if (process.argv[0].split('/')[process.argv[0].split('/').length - 1] === 'node') {
        argvStart = 3;
        mod = process.argv[2];
    }
    for (let i = argvStart; i < process.argv.length; i++)
        options.push(process.argv[i]);

    if ((mod === 'app') || (mod === 'apps') || (mod === 'a')) {
        console.log(apps.commands(options));        
    } else if ((mod === 'plugin') || (mod === 'plugins') || (mod === 'p')) {
        plugins.commands(process.argv[3], options);
    } else if ((mod === 'module') || (mod === 'modules') || (mod === 'm')) {
        moduls.commands(process.argv[3], options);
    } else if ((mod === 'clear') || (mod === 'clean') || (mod === 'c')) {
        clear();
    } else if ((mod === 'argv')) {
        console.log(process.argv);
    } else if ((mod === 'build') || (mod === 'b')) {
        buildCheck();
        clear();
        buildApp();
        buildSQL();
        buildInstall();
    } else {
        //        console.log(plugins.all());
        //        console.log(apps.makeAppsComplie());

    }
};
