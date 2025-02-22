const Generator = require('yeoman-generator');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const sourceloopCliLog = require('../debug')
const {answers} = require("./index");

// Handle how paths are handled since some are not getting redirected correctly
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts, {});
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'projectDir',
                message: 'Name of the directory in which the project is scaffolded:'
            }
        ]);
    }

    // refactor since this is calling every function and order matters. Order should not matter
    initProject() {
        fs.mkdir(this.answers.projectDir, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
        });

        // refactor into common util
        // determine why lerna is passing back output in STDERR
        // modify so the commands aren't nested
        console.log('Initializing lerna');
        this._lernaInit();
        this._npmInit();
        this._copyTemplates();
    }

    _lernaInit(callback) {
        this._spawnProcess('npx', ['lerna', 'init', '--independent'], {cwd: this.answers.projectDir}, callback);
    }


    _npmInit(callback) {
        this._spawnProcess('npm', ['i'], {cwd: path.join(this.answers.projectDir)}, callback);
    }


    _spawnProcess(cmd, cmdArgs, cwd, successCallback) {
        const spawnedProcess = spawn(cmd, cmdArgs, {...cwd});

        spawnedProcess.stdout.on("data", data => {
            sourceloopCliLog(data);
        });

        spawnedProcess.stderr.on("data", data => {
            sourceloopCliLog(data);
        });

        spawnedProcess.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        spawnedProcess.on("close", code => {
            if (successCallback) {
                successCallback();
            }
        });
    }

    // refactor how templates are handled to use built in APIs

    _copyTemplates() {
        fs.readdirSync(this.templatePath()).forEach(file => {
            const targetFileName = file.replace('.tpl', '');
            const sourcePath = this.templatePath(file);
            const destinationPath = path.join(this.answers.projectDir, targetFileName);
            this.fs.copyTpl(sourcePath, destinationPath, {
                ...this.answers
            });
        });

        fs.mkdirSync(path.join(this.answers.projectDir, 'services'));
        fs.mkdirSync(path.join(this.answers.projectDir, 'facades'));
    }
};
