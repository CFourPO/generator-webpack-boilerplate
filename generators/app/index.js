'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the riveting ' + chalk.red('generator-webpack-boilerplate') + ' generator!'
    ));

    const prompts = [{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {  
      type    : 'input',
      name    : 'username',
      message : 'What\'s your GitHub username',
      store   : true
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    let files = ['package.json', 'package-lock.json'];

    files.forEach(file => {
      let tmp = this.fs.readJSON(this.templatePath(file));
      tmp.name = this.props.name || this.appname;
      this.fs.writeJSON(this.destinationPath(file), tmp);
    });

    let configFiles = [
      'src/index.js', 
      'config/webpack.common.js', 
      'config/webpack.dev.js', 
      'config/webpack.prod.js'
    ];
    // let pkg = this.fs.readJSON(this.templatePath('package.json'));
    // pkg.name = this.props.name;
    configFiles.forEach(file => {
      this.fs.copy(
        this.templatePath(file), 
        this.destinationPath(file));
    });

    this.fs.copyTpl(
      this.templatePath('index.html'), 
      this.destinationPath('index.html'), 
      {
        title: (this.props && this.props.name) ? this.props.name : this.appname
      }
    );
    // this.fs.copy(
    //   this.templatePath('src/index.js'),
    //   this.destinationPath('src/index.js')
    // );
  }

  install() {
    this.npmInstall();
  }
};
