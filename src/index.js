const {Command, flags} = require('@oclif/command')
const {gitCount} = require('./lib')

class HowManyDaysOnGitProjectCommand extends Command {
  async run() {
    const {flags} = this.parse(HowManyDaysOnGitProjectCommand)
    const {author, branch, after, before} = flags
    const workingDir = flags['working-dir']
    const ignoreMerge = flags['no-merge']
    gitCount({author, branch, after, before, workingDir, ignoreMerge})
    .then(count => this.log(`Days Spend (tops!) on the Git project: ${count}`))
    .catch(err => this.log(`!!! ERR: ${err.message}`))
  }
}

HowManyDaysOnGitProjectCommand.description = `Describe the command here
...
Extra documentation goes here
`

HowManyDaysOnGitProjectCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  author: flags.string({char: 'a', description: 'Git Author. Defaults to the one set in git config'}),
  branch: flags.string({char: 'b', description: 'Git Branch. Defaults to "master"'}),
  before: flags.string({description: 'Only include commits before this date. Specified in YYYY-MM-DD format'}),
  after: flags.string({description: 'Only include commits after this date. Specified in YYYY-MM-DD format'}),
  'working-dir': flags.string({char: 'd', description: 'Git Working Dir. Defaults to current dir'}),
  'no-merge': flags.boolean({description: 'Ignore all merge commits. Defaults to true'}),
}

module.exports = HowManyDaysOnGitProjectCommand
