'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var logger = require('../util/log'),
    wp = require('wp-util'),
    wordpress = require('../util/wordpress');

module.exports = yeoman.Base.extend({


    prompting: function () {
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname // Default to current folder name
        },
            {
                type: 'input',
                name: 'wp',
                message: 'Do you want to install WP?',
                default: false
            },
            {
                type: 'input',
                name: 'theme',
                message: 'Is it a theme?',
                default: true
            }
        ]).then(function (answers) {
            this.log('app name', answers.name);
            this.name = answers.name;
            this.wp = answers.wp;
            this.theme = answers.theme;
        }.bind(this));
    },

    writing: function () {
        this.fs.copy(
            this.templatePath('package.json'),
            this.destinationPath('package.json')
        );

        this.fs.copy(
            this.templatePath('sass'),
            this.destinationPath('sass')
        );
    },

    downloadWp: function () {
        if (true === this.wp) {
            var done = this.async();
            this.spawnCommand('wp', [
                'core',
                'download',
                '--path=wp',
            ]).on('close', done);
        }
    },

    install: function () {
        this.installDependencies();
    },

    git: function () {
        this.spawnCommandSync('git', ['init']);
    },

    installPlugins: function () {
        this.directory("~/dev/plugins/", this.folderName);
    },

    wpConfig: function () {
        if (true === this.wp) {
            var done = this.async();
            this.spawnCommand('wp', [
                    'core',
                    'config',
                    '--dbname=' + this.name,
                    '--dbuser=root',
                    '--dbpass=stargazer',
                    '--dbhost=localhost',
                ],
                {cwd: 'wp'}
            ).on('close', done);
        }

    },

    activatePlugins: function () {

        /*
         Others
         quick-edit-template-link
         regenerate-thumbnails
         */

        // plugins=("debug-bar" "debug-bar-console"); for p in "${plugins[@]}" ; do wp plugin install "$p" --activate; done

        if (true === this.wp) {
            this.spawnCommand('wp', [
                    'plugin',
                    'install',
                    '~/dev/plugins/updraftplus.zip',
                    '--activate'
                ],
                [
                    'plugin',
                    'install',
                    '~/dev/plugins/wp-migrate-db-pro-*.zip',
                    '--activate'
                ],
                [
                    'plugin',
                    'install',
                    'wordpress-importer',
                    '--activate'
                ],
                {cwd: 'wp'}
            );
        }
    }

})
;
