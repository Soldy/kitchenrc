'use strict';
const fs = require('fs');
const tools= require('./tools.js').tools;
const wonderfulOutputClass = require('wonderfulOutput').json;
const wonderfulOutput = new wonderfulOutputClass ();
const exampleConfig = {
    'id': '',
    'name': '',
    'build': '',
    'comment': '',
    'onload':1,
    'plugins': [],
    'modules': [
        'bbs',
        'bot',
        'cacheExternal',
        'cdn',
        'cli', 
        'cluster', 'command',
        'daemon',
        'http',
        'install',
        'statistics',
        'status',
        'test',
        'tools'
    ],
};

'use strict';

exports.appsClass = class { 
    commands(options) {
        if (options[0] === 'list') {
            return this.commandList();
        } else if (options[0] === 'get') {
            return this.commandGet();
        } else if (options[0] === 'new') {
            return this.newApp(options[1]);
        }  else {
            tools.die('ismeretlen plugin parancs');
        }
    }
    commandList(){
        let out = '\n';
        for (let i  in this.db.list) out += '    '+this.db.list[i]+'\n';
        return out;
    }
    newApp(appName) {
        let defaultConfig = JSON.parse(JSON.stringify(exampleConfig));
        let defaultList = {
            'appList': this.db.list,
        };
        defaultConfig['id'] = appName;
        defaultConfig['name'] = appName;        
        let filePath = tools.appDir + appName;
        if (!fs.existsSync(filePath))
            fs.mkdirSync(filePath);
        if (!fs.existsSync(filePath + '/app.json'))
            fs.writeFileSync(filePath + '/app.json', wonderfulOutput.json(defaultConfig));
        if (!defaultList.appList.includes(appName))
            defaultList.appList.push(appName);
        fs.writeFileSync('modules/apps/apps.json', wonderfulOutput.json(defaultList));          
        this.readAppsList();
        return appName+'\n';
    }
    readAppsList() {
        let readedFile = JSON.parse(fs.readFileSync('modules/apps/apps.json', 'utf8', (e, d) => {
            if (e)
                tools.die('File read error' + JSON.stringify(e));
        }));
        if (typeof readedFile === 'undefined')
            tools.die('File process error');
        if (typeof readedFile.appList === 'undefined')
            tools.die('Plugin list not exist');
        this.db.list= readedFile.appList;
        return readedFile;
    }
    readAppDetails(app) {
        let readedFile = JSON.parse(fs.readFileSync('modules/apps/' + app + '/app.json', 'utf8', (e, d) => {
            if (e)
                tools.die('File read error' + JSON.stringify(e));
        }));
        return readedFile;

    }
    readAppsDetails() {
        for (let i in this.db.list)
            this.db.details[this.db.list[i]] = this.readAppDetails(this.db.list[i]);
    }
    makeAppsComplie() {
        let out = '\n\n';
        for (let i in this.db.list)
            out += this.makeAppComplie(this.db.list[i]);
        return out;
    }
    makeAppComplie(app) {
        let out = '\n\n';
        this.modules.moduleBuilder(this.db.details[app].modules);

        out += '\n';
        out += 'app_' + app + '_mysql: base.mysql';
        for (let i in this.db.details[app].plugins)
            out += ' plugin_' + tools.moduleNameReplace(this.db.details[app].plugins[i]) + '_mysql.mysql';
        out += '\n';
        out += 'app_' + app + ': clean base.js pluginAdmin.js plugin.js';
        for (let i in this.db.details[app].plugins)
            out += ' plugin_' + tools.moduleNameReplace(this.db.details[app].plugins[i]) + '.js';
        for (let i in this.db.details[app].plugins)
            out += ' pluginAdmin_' + tools.moduleNameReplace(this.db.details[app].plugins[i]) + '.js';
        out += ' onload.js \n';
        out += '\n';
        out += 'app_' + app + '_install: base_install.js pluginAdmin_install.js plugin_install.js';
        for (let i in this.db.details[app].plugins)
            out += ' plugin_' + tools.moduleNameReplace(this.db.details[app].plugins[i]) + '_install.js';
        for (let i in this.db.details[app].plugins)
            out += ' pluginAdmin_' + tools.moduleNameReplace(this.db.details[app].plugins[i]) + '_install.js';
        out += ' onload_install.js \n';
        out += '\n';
        out += app + ': app_' + app + ' app_' + app + '_install  app_' + app + '_.mysql';       
        return out;
    }
    build(app){
        let out = '\n\n';
        this.modules.moduleBuilder(this.db.details[app].modules);
        this.modules.installBuilder(this.db.details[app].modules);
        
    }
    getAppElements(app){
        let out = [];
        for (let i in this.db.details[app].plugins)
            out = [this.db.details[app].plugins[i]];
        return out;
    }
    constructor() {
        this.modules='';
        this.plugins='';
        this.db = {
            list: [],
            details: {},
        };
        this.readAppsList();
        this.readAppsDetails();
        //        console.log(this.makeAppsComplie());
    }
    
};
