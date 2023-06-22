class BaseCommand {
  subCommand
  constructor(program) {
    if (!program) {
      throw new Error('program must not be null!')
    }
    this.subCommand = program
      .command(this.command)
      .description(this.description)
      .hook('preAction', () => {
        this.preAction()
      })
      .hook('postAction', () => {
        this.postAction()
      })
      .action((...params) => {
        this.action(params)
      })

    if (this.options?.length > 0) {
      this.options.forEach((option) => {
        this.subCommand.option(...option)
      })
    }
  }

  get command(): string {
    throw new Error('command must be implements')
  }

  get description(): string {
    throw new Error('description must be implements')
  }

  get options(): (string | boolean | number)[][] {
    return []
  }

  action(param: any[]) {
    throw new Error('action must be implements')
  }

  preAction() {
    // empty
  }

  postAction() {
    // empty
  }
}

export default BaseCommand
