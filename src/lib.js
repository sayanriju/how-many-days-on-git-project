const simpleGit = require('simple-git')
const {format} = require('date-fns')

/**
 * Find the current git user
 *  O/p of `git config user.name`
 *  @returns {Promise}
 */
const gitUser = () => {
  const git = simpleGit()
  return new Promise((resolve, reject) => {
    git.raw(['config', 'user.name'], (err, resp) => {
      if (err) return reject(err)
      return resolve(resp.trim())
    })
  })
}

/**
 * Counts the no. of git logs matching conditions as specified by params
 * @param {Object} _
 * @param {string} [_.workingDir] The Git working dir. Defaults to current dir
 * @param {string} [_.author] Git Author name. Defaults to the one set in git config
 * @param {string} [_.before ] Include commits before this date. Specified in YYYY-MM-DD format
 * @param {string} [_.after] Include commits after this date. Specified in YYYY-MM-DD format
 * @param {string} [_.branch=master] Include commits in this branch. Defaults to "master"
 * @param {boolean} [_.ignoreMerge=true] Exclude merge commits. Defaults to true
 */
const gitCount = ({workingDir = '', author = null, before = null, after = null, branch = 'master', ignoreMerge =  true}) => {
  const git = simpleGit(workingDir)
  const opts = ['-i'] // case insensitive (for --author)
  if (author === null) {
    opts.push(`--author=${gitUser()}`)
  } else {
    opts.push(`--author=${author}`)
  }
  if (branch === null) {
    opts.push('master')
  } else {
    opts.push(branch)
  }
  if (before !== null) opts.push(`--before=${before}`)
  if (after !== null) opts.push(`--after=${after}`)
  if (ignoreMerge === true) opts.push('--no-merges')
  return new Promise((resolve, reject) => {
    git.log(opts, (err, resp) => {
      if (err) return reject(err)
      // Count only one commit for a day
      try {
        const commitDates = resp.all.map(line => format(line.date, 'DD-MM-YYYY'))
        const uniqueCommitDates = [...new Set(commitDates)]
        return resolve(uniqueCommitDates.length)
      } catch (error) {
        return reject(error)
      }
    })
  })
}

module.exports = {gitCount, gitUser}
