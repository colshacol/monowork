#!/usr/bin/env node

const shell = require("shelljs")
const meow = require("meow")
const log = require("./log")

const create = require("./create")
const refresh = require("./refresh")

const { ShellString } = shell

const cli = meow(`
  Usage
    $ monowork <...commands> [...options]

  Examples
    $ monowork create shared-services
    $ monowork refresh
`)

const [command, ...subCommands] = cli.input
const options = cli.flags
const cwd = process.cwd()

const halt = message => {
  log.red(`\n[monowork halting] ${message}\n`)
  process.exit(0)
}

const commands = {
  create,
  refresh
}

commands[command](cli, subCommands, options)
