import inquirer from 'inquirer'
import BaseCommand from './baseCommand.js'

class CreateCommand extends BaseCommand {
  constructor(program) {
    super(program)
    this.subCommand.argument('[name]', 'project name')
  }
  get command() {
    return 'create'
  }

  get description() {
    return 'create project'
  }

  get options() {
    return [
      ['-t, --template <template>', 'template name'],
      ['-f, --force', 'enable force update']
    ]
  }

  async action([name, options, command]) {
    let templateName = options?.template
    if (!name) {
      name = await getProjectName()
    }
    if (!templateName) {
      templateName = await getTemplateName()
    }
    console.log(templateName)
  }
}

export default function (instance) {
  return new CreateCommand(instance)
}

async function getProjectName() {
  const questions = [
    {
      type: 'input',
      name: 'project name',
      message: "What's your project name?",
      default: 'my-project'
    }
  ]
  const answers = await inquirer.prompt(questions)
  return answers.name
}

async function getTemplateName(): Promise<string> {
  const questions = [
    {
      type: 'list',
      name: 'templateName',
      message: 'Select a template',
      choices: [
        {
          name: 'template-react',
          value: 'template-react'
        },
        {
          name: 'template-react-ts',
          value: 'template-react-ts'
        },
        {
          name: 'template-vue',
          value: 'template-vue'
        },
        {
          name: 'template-vue-ts',
          value: 'template-vue-ts'
        }
      ]
    }
  ]
  const answers = await inquirer.prompt(questions)
  return answers.templateName
}
