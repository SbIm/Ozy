//https://discord.com/api/oauth2/authorize?client_id=xxx&permissions=8&scope=bot
const Discord = require("discord.js")
const fs = require("fs")
const { login } = require("./src/api/netease/api")
const { EVENTS_DIR, COMMANDS_DIR } = require("./src/const")
const CONFIG = require("./config.json")

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.config = CONFIG
client.queue = new Map()
client.cookie = undefined

if (!!CONFIG.COUNTRYCODE && !!CONFIG.PASSWORD && !!CONFIG.PHONENUM) {
  login(CONFIG).then((result) => {
    client.cookie = result.cookie
  })
}

fs.readdir(`./src/${EVENTS_DIR}/`, (err, files) => {
  if (err) return console.error(err)

  files.forEach((file) => {
    if (!file.endsWith(".js")) return

    const event = require(`./src/${EVENTS_DIR}/${file}`)
    let eventName = file.split(".")[0]
    client.on(eventName, event.bind(null, client))
  })
})

fs.readdir(`./src/${COMMANDS_DIR}/`, (err, files) => {
  if (err) return console.error(err)

  files.forEach((file) => {
    if (!file.endsWith(".js")) return

    let props = require(`./src/${COMMANDS_DIR}/${file}`)
    let command_name = file.split(".")[0]
    client.commands.set(command_name, props)
  })
})

const token = process.env['dtoken']
client.login(token)
