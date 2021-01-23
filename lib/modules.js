'use strict';
const fs = require('fs');
const tools = require('./tools.js').tools;
const wonderfulOutputClass = require('wonderfulOutput').json;
const wonderfulOutput = new wonderfulOutputClass();

exports.modulesClass = class { //plugin funkciok
//    get moduleDir() { 
//        return "modules/include/";
//    }
    modulePartRead(module, searchTag) {
        let out = '\n// module ' + searchTag + ' of ' + module + '\n';
        let directory = this.moduleDir + module;
        let files = fs.readdirSync(directory).sort();
        for (let p in files) {
            let key = files[p];
            if (key.indexOf(searchTag) === key.length - (searchTag).length) {
                out += '\n// ' + module + ' of ' + key + '\n';
                out += tools.fileRead(directory+ '/' + key, 1);
            }
        }
        return out;
    }
    mysqlRead(appId) {
        let out = '';
        out += tools.fileRead(this.moduleDir + 'base/base.mysql', 0);
        return  tools.dbFix(out, appId);
    }
    includesRead() {
        let out = '';
        let directory = 'modules/include';
        let files = fs.readdirSync(directory).sort();
        for (let p in files) {

            let key = files[p];
            if (files[p].indexOf('.js') === files[p].length - ('.js').length) {
                out += '\n// include of ' + files[p] + '\n';
                out += tools.fileRead(directory+'/'+files[p], 1);
            }
        }        
        //        out += this.modulePartRead("", ".js");
        return out;
    }
    moduleRead(module) {

    }
    moduleConfigRead() {

    }
    moduleStart(){
        return '\n'+this.includesRead()+'\n'+tools.fileRead(this.moduleDir+'0.js')+'\n';
    }
    moduleBuilder(moduleList) {
        let out = this.moduleStart();
        let searchTags = ['var.js', 'fun.js', 'main.js'];
        for (let p =0 ; p <  searchTags.length ; p++) {
            out += this.modulePartRead('base', searchTags[p]);
            for (let i = 0; i < moduleList.length; i++)
                out += this.modulePartRead(moduleList[i], searchTags[p]);
        }
        return out;
    }
    moduleOnload() {
        let out = '// module onload';
        let searchTags = ['var.js', 'fun.js', 'main.js'];
        for (let p in  searchTags)
            out += this.modulePartRead('onload', searchTags[p]);
        return out;
    }
    installBuilder(moduleList) {
        let out = this.moduleStart();
        let searchTags = ['var.js', 'fun.js', 'install.js'];
        for (let p in  searchTags) {
            out += this.modulePartRead('base', searchTags[p]);
            for (let i = 0; i < moduleList.length; i++)
                out += this.modulePartRead(moduleList[i], searchTags[p]);
        }
        return out;
    }
    installOnload() {
        let out = '// module onload';
        let searchTags = ['var.js', 'fun.js', 'install.js'];
        for (let p in  searchTags)
            out += this.modulePartRead('onload', searchtTags[p]);
        return out;
    }
    testim() {
        console.log(this.moduleDir);
    }
    constructor() {
        this.apps = '';
        this.plugins = '';
        this.moduleDir = 'modules/include/';
        this.db = {
            list: [],
            details: {}
        };
        //        this.includesRead();
        //        this.testim();
        //        this.baseModuleRead();
    }
};
