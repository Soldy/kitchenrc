'use strict';

const fs = require('fs');
/**
 *
 * @param {type} message
 * @returns {undefined}
 */
const extendDie = (message) => {
    console.error(message);
    process.exit();
};


exports.tools = {
    /**
     *
     * @param {type} directory
     * @param {type} tag
     * @returns {Array|exports.tools.fileList.out|nm$_tools.exports.tools.fileList.out}
     */
    fileList: (directory, tag) => {
        let out = [];
        let fs = require('fs');
        let files = fs.readdirSync(directory);
        for (let i = 0; i < files.length; i++) {
            let key = files[i];
            if (key.indexOf(tag) === key.length - tag.length)
                out.push(key);
        }
        return out;
    },
    /**
     *
     * @param {type} file
     * @returns {String|exports.tools.fileRead.out}
     */
    fileRead: (file, comment) => {
        if (typeof file === 'undefined')
            return '\n';
        if (typeof comment === 'undefined')
            comment = 0;
        let out = '';
        let fileArray = fs.readFileSync(file, 'utf8', (e, d) => {
            if (e)
                extendDie('File read error' + JSON.stringify(e));
        }).match(/[^\r\n]+/g);
        if (fileArray === null)
            return ' ';
        if (comment === 1) {
            for (let i = 0; i < fileArray.length; i++)
                out += fileArray[i] + ' // ' + i.toString() + ' ' + file + ' \n';
        } else {
            for (let i = 0; i < fileArray.length; i++)
                out += fileArray[i] + ' \n';
        }
        return out;
    },
    /**
     *
     * @param {type} dbData
     * @param {type} appId
     * @returns {String}
     */
    dbFix: (dbData, appId) => {
        return dbData.replace(/dragonServerTest/g, appId) + '\n';
    },
    /**
     *
     * @param {type} module
     * @returns {unresolved}
     */
    moduleNameReplace: (module) => {
        return module.replace(/\//g, '_');
    },
    /**
     *
     * @param {type} fname
     * @returns {undefined}
     */
    deleteFile: (fname) => {
        try {
            fs.unlinkSync(fname);
        } catch (e) {

        }
    },
    pluginDir: 'modules/plugins/',
    appDir: 'modules/apps/',
    /**
     *
     * @param {type} message
     * @returns {undefined}
     */
    die: (message) => {
        extendDie(message);
    }
};



