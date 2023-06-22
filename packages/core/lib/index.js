import { fileURLToPath } from 'url';
import path from 'path';
import path2 from 'node:path';
import fse from 'fs-extra';
import { program } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { httpServer } from '@nova-kit/server';

// ../../node_modules/.pnpm/tsup@7.0.0/node_modules/tsup/assets/esm_shims.js
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/commands/baseCommand.ts
var BaseCommand = class {
  subCommand;
  constructor(program2) {
    var _a;
    if (!program2) {
      throw new Error("program must not be null!");
    }
    this.subCommand = program2.command(this.command).description(this.description).hook("preAction", () => {
      this.preAction();
    }).hook("postAction", () => {
      this.postAction();
    }).action((...params) => {
      this.action(params);
    });
    if (((_a = this.options) == null ? void 0 : _a.length) > 0) {
      this.options.forEach((option) => {
        this.subCommand.option(...option);
      });
    }
  }
  get command() {
    throw new Error("command must be implements");
  }
  get description() {
    throw new Error("description must be implements");
  }
  get options() {
    return [];
  }
  action(param) {
    throw new Error("action must be implements");
  }
  preAction() {
  }
  postAction() {
  }
};
var baseCommand_default = BaseCommand;

// src/commands/createCommand.ts
var CreateCommand = class extends baseCommand_default {
  constructor(program2) {
    super(program2);
    this.subCommand.argument("[name]", "project name");
  }
  get command() {
    return "create";
  }
  get description() {
    return "create project";
  }
  get options() {
    return [
      ["-t, --template <template>", "template name"],
      ["-f, --force", "enable force update"]
    ];
  }
  async action([name, options, command]) {
    let templateName = options == null ? void 0 : options.template;
    if (!name) {
      name = await getProjectName();
    }
    if (!templateName) {
      templateName = await getTemplateName();
    }
    console.log(templateName);
  }
};
function createCommand_default(instance) {
  return new CreateCommand(instance);
}
async function getProjectName() {
  const questions = [
    {
      type: "input",
      name: "project name",
      message: "What's your project name?",
      default: "my-project"
    }
  ];
  const answers = await inquirer.prompt(questions);
  return answers.name;
}
async function getTemplateName() {
  const questions = [
    {
      type: "list",
      name: "templateName",
      message: "Select a template",
      choices: [
        {
          name: "template-react",
          value: "template-react"
        },
        {
          name: "template-react-ts",
          value: "template-react-ts"
        },
        {
          name: "template-vue",
          value: "template-vue"
        },
        {
          name: "template-vue-ts",
          value: "template-vue-ts"
        }
      ]
    }
  ];
  const answers = await inquirer.prompt(questions);
  return answers.templateName;
}
var ServerCommand = class extends baseCommand_default {
  constructor(program2) {
    super(program2);
  }
  get command() {
    return "server";
  }
  get description() {
    return "start server";
  }
  get options() {
    return [
      ["-p, --port <port>", "listen port", "8090"],
      ["-s,--ssl", "enable https"]
    ];
  }
  async action([options, command]) {
    httpServer(options);
  }
};
function serverCommand_default(instance) {
  return new ServerCommand(instance);
}

// src/index.ts
function init() {
  console.log(chalk.green(figlet.textSync("NOVA KIT")));
  const pkgPath = path2.resolve(__dirname, "../package.json");
  const pkg = fse.readJsonSync(pkgPath);
  program.name("nova").usage("<Command>").version(pkg.version, "-v, --version", "output current version").option("-d, --debug", "enable debug mode");
  program.on("option:debug", function() {
    if (program.opts().debug) {
      console.log("debug", "launch debug mode");
    }
  });
  program.on("command:*", function(obj) {
    console.log("unknow command" + obj[0]);
  });
  return program;
}
function src_default() {
  const programer = init();
  createCommand_default(programer);
  serverCommand_default(programer);
  programer.parse(process.argv);
}

export { src_default as default };
