'use strict';

const fs = require('fs');
const tools = require('./tools.js').tools;
const wonderfulOutputClass = require('./wonderfulOutput.js').json;
const wonderfulOutput = new wonderfulOutputClass();
const exampleConfig = {
    'id': '',
    'name': '',
    'build': '',
    'comment': '',
    'directorys': {
        'service': '',
        'daemons': '',
        'cli': '',
        'backoffice': ''
    },
    'db': {
        'mysql': [
        ]
    },
    'functions': {
        'init': {
            'start': [{
                'procedure': 'function()',
                'level': 9
            }],
            'stop': []
        },
        'registration': [],
        'login': []
    },
    'status': [],
    'statistics': [],
    'workers': [],
    'setup': [],
    'api': [
        {
            'module': '',
            'procedure': ''
        }],
    'command': [
        {
            'command': '',
            'procedure': 'function'
        }],
    'dependency': []
};

exports.pluginsClass = class { //plugin funkciok
    commands(argf, options){
        if (options[0] === 'list') {
            this.commandList();
        } else if (options[0] === 'get') {
            this.commandGet();
        } else if (options[0] === 'new') {
            this.newPlugin(options[1]);
        } else if (options[0] === 'mysql') {
            console.log(this.mysqlBackup());
        } else {
            tools.die('ismeretlen plugin parancs');
        }
    }
    commandList() {
        let out = '\n';
        for (let i in this.db.list)
            out += this.db.list[i] + '\n';
        tools.die(out);
    }
    commandGet() {
        let out = '\n';
        out += JSON.stringify(this.db.list) + '\n';
        tools.die(out);
    }

    showCommands() {
        let out = 'Plugin parancsok\n';
        out += 'List : pluginok listazasa \n';
        tools.die(out);
    }
    newPlugin(pluginName) {
        let defaultConfig = JSON.parse(JSON.stringify(exampleConfig));
        let defaultList = {
            'pluginList': JSON.parse(JSON.stringify(this.db.list))
        };
        let filePath =y;
        defaultConfig['id'] = pluginName;
        defaultConfig['name'] = pluginName;
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        } else {
            tools.die('plugin directory already exist!');
        }
        if (!fs.existsSync(filePath + '/service')) {
            fs.mkdirSync(filePath + '/service');
        } else {
            tools.die('plugin service directory already exist!');
        }
        if (!fs.existsSync(filePath + '/backOffice')) {
            fs.mkdirSync(filePath + '/backOffice');
        } else {
            tools.die('plugin backOffice directory already exist!');
        }
        if (!fs.existsSync(filePath + '/plugin.json')) {
            fs.writeFileSync(filePath + '/plugin.json', wonderfulOutput.json(defaultConfig));
        } else {
            tools.die('plugin config already exist!');
        }
        if (!defaultList.pluginList.includes(pluginName)) {
            defaultList.pluginList.push(pluginName);
        } else {
            tools.die('plugin already exist!');
        }
        fs.writeFileSync('modules/plugins/plugins.json', wonderfulOutput.json(defaultList));
        this.readPluginsList();
    }
    pluginPartRead(plugin, searchTag) {
        let out = '\n// plugin ' + searchTag + ' of ' + plugin + ' service \n';
        let directory = this.pluginDir + plugin;
        let files = fs.readdirSync(directory + '/service/');
        for (let p in files) {
            let key = files[p];
            if (key.indexOf(searchTag) === key.length - (searchTag).length) {
                out += '\n// ' + plugin + ' service of ' + key + '\n';
                out += tools.fileRead(directory + '/service/' + key);

            }
        }
        out += '\n// plugin ' + searchTag + ' of ' + plugin + ' backOffice \n';
        files = fs.readdirSync(directory + '/backOffice/');
        for (let p in files) {
            let key = files[p];
            if (key.indexOf(searchTag) === key.length - (searchTag).length) {
                out += '\n// ' + plugin + ' backOffice of ' + key + '\n';
                out += tools.fileRead(directory + '/backOffice/' + key, 1);
            }
        }
        return out;
    }
    pluginBuilder(pluginList) {
        let out = '';
        let searchTags = ['var.js', 'fun.js', 'main.js'];
        for (let p in  searchTags) {
            for (let i = 0; i < pluginList.length; i++)
                out += this.pluginPartRead(pluginList[i], searchTags[p]);
        }
        return out;
    }
    mysqlPartRead(plugin, appId) {
        let out = '\n\n\n';
        let searchTag = '.mysql';
        let directory = this.pluginDir + plugin;
        let files = fs.readdirSync(directory + '/service/');
        for (let p in files) {
            let key = files[p];
            if (key.indexOf(searchTag) === key.length - (searchTag).length) {
                out += tools.fileRead(directory + '/service/' + key, 0);
            }
        }
        return tools.dbFix(out, appId);
    }
    mysqlBuilder(appId) {
        let out = '';
        let pluginList = this.apps.db.details[appId].plugins;
        for (let i = 0; i < pluginList.length; i++)
            out += this.mysqlPartRead(pluginList[i], appId);
        return out;
    }
    mysqlBackup(oluaw){
        //console.log(this.db.plugins);
        //mysqldump $mysqlOptions dragonServerTest_wall > modules/api/wall.mysql
        let execute = '#!/bin/bash \n';
        execute += 'read -p "Mysql Password : " -s mysqlPassword \n';
        execute += 'echo "" \n';
        execute += 'export MYSQL_PWD=$mysqlPassword \n';
        execute += 'mysqlOptions="-u root -R --triggers --no-data --compact --insert-ignore -p$MYSQL_PWD -B" \n';
        execute += 'mysqldump $mysqlOptions dragonServerTest > modules/include/base/base.mysql \n';
        for (let i = 0; i < this.db.list.length ; i ++) for(let m = 0 ; m < this.db.plugins[this.db.list[i]].db.mysql.length ; m++)
            execute += 'mysqldump $mysqlOptions dragonServerTest_'+this.db.plugins[this.db.list[i]].db.mysql[m]+' >  '+this.pluginDir+this.db.list[i]+'/service/'+this.db.plugins[this.db.list[i]].db.mysql[m]+'.mysql \n';
        return execute; 
    }
    readPluginVar() {

    }
    readPluginFun() {

    }
    readPluginMain() {

    }

    list() {
        console.log(this.db.list);
    }
    check() {


    }

    read(file) {
        console.log(file);
    }
    /** 
     *Itt olvassuk fel a plugin lista filet
     * 
     *   
     * @returns {Array|Object|pluginsClass.readPluginList.readedFile}
     * 
     */
    readPluginConfig(pluginName){
        this.db.plugins[pluginName] = JSON.parse(fs.readFileSync(tools.pluginDir + pluginName + '/plugin.json'));
    }
    readPluginsList() {
        let readedFile = JSON.parse(fs.readFileSync('modules/plugins/plugins.json', 'utf8', (e, d) => {
            if (e)
                tools.die('File read error' + JSON.stringify(e));
        }));
        if (typeof readedFile === 'undefined')
            tools.die('File process error');
        if (typeof readedFile.pluginList === 'undefined')
            tools.die('Plugin list not exist');
        this.db.list = readedFile.pluginList;
        return readedFile;
    }
    constructor() {
        this.modules = '';
        this.apps = '';
        this.componentList = {
            fun: [],
            fun: [],
        };
        this.db = {
            list: [],
            plugins: {}
        };
        this.pluginDir = 'modules/plugins/';
        this.readPluginsList();
        for(let i = 0 ; i < this.db.list.length ; i++ ) this.readPluginConfig(this.db.list[i]);
        //        console.log(this.list());
        //        for (let i in this.db.list) console.log(this.moduleCatMaker(this.db.list[i]));

    }
};


