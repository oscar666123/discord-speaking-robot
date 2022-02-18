//有问题加推特咨询：https://twitter.com/flypotato132 或进社群 https://discord.gg/kqeX7Zbmq4
//有问题加推特咨询：https://twitter.com/flypotato132 或进社群 https://discord.gg/kqeX7Zbmq4
//有问题加推特咨询：https://twitter.com/flypotato132 或进社群 https://discord.gg/kqeX7Zbmq4
//有问题加推特咨询：https://twitter.com/flypotato132 或进社群 https://discord.gg/kqeX7Zbmq4
//有问题加推特咨询：https://twitter.com/flypotato132 或进社群 https://discord.gg/kqeX7Zbmq4
//有问题加推特咨询：https://twitter.com/flypotato132 或进社群 https://discord.gg/kqeX7Zbmq4
const fs = require("fs");
const axios = require('axios-https-proxy-fix');
const qs = require("qs")
const jsonFile = fs.readFileSync("./discord_message.json")
const fileJson = JSON.parse(jsonFile.toString())
const length = fileJson.bot.length
const autoBot = fileJson.autoBot

async function main() {
    let amountBot = fileJson.config.length
    for (let index = 0; index < amountBot ;index ++) {
        let discordLink = fileJson.config[index].discord_link
        let discordChannelID = fileJson.config[index].channel_id
        let timeInterval = fileJson.config[index].time_interval
        let token = fileJson.config[index].token
        chat(discordLink, discordChannelID, timeInterval, token)
    }
}

async function chat(discordLink, discordChannelID, timeInterval, token) {
    let index = 0
    while (true) {
        try {
            let messageString = ""
            if (autoBot) {
                messageString = await getRemoteMessage(discordChannelID, token)
            }
            if (messageString === "") {
                messageString = fileJson.bot[index].message.toString()
            }
            message_data = {
                "content": messageString,
                "tts": "false",
            }
            index = (index + 1) % length
            await sendMessage(discordChannelID, message_data, token, discordLink)
            await sleep(timeInterval * 1000)
        } catch (e) {
            console.log("出错了：" + e)
            await sleep(timeInterval * 1000)
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function sendMessage(channel_id, message_data, token, discordLink) {
    try {
        let url = "https://discordapp.com/api/v6/channels/" + channel_id + "/messages"
        await axios.post(url, message_data, {
            headers: {
                "content-type": "application/json",
                "authorization": token.toString()
            }
            //这个是代理
            // ,proxy: {
            //     host: '127.0.0.1',
            //     port: 1087
            // }
            //代理结束
        }).then(value => {
            console.log("发送成功：" + message_data.content + "  DC链接：" +discordLink )
        }).catch(err => {
            console.log(err.message)
        })
    } catch (e) {
        console.log(e)
    }
}

async function getRemoteMessage(channelID, token) {

    try {
        let result_list = []

        let url = "https://discordapp.com/api/v6/channels/" + channelID + "/messages?limit=100"
        return await axios.get(url, {
            headers: {
                "content-type": "application/json",
                "authorization": token.toString(),
            }
            //这个是代理
            // ,proxy: {
            //     host: '127.0.0.1',
            //     port: 1087
            // }
            //代理结束
        }).then(value => {
            let data = value.data
            if (data === "") {
                return ""
            } else {
                let length  = value.data.length
                for (let index = 0; index < length; index ++) {
                    let content = value.data[index].content
                    if (content != ""
                        && content.indexOf("<")  === -1
                        && content.indexOf("@")  === -1
                        && content.indexOf("http")  === -1
                        && content.indexOf("?")  === -1) {
                        result_list.push(content)
                    }
                }
                let randormNumber = Math.ceil(Math.random()* result_list.length)
                if (randormNumber >= result_list.length) {
                    randormNumber = 0;
                }
                return result_list[randormNumber]
            }
        }).catch(err => {
            console.log(err.message)
            return ""
        })
    } catch (e) {
        console.log(e)
        return ""
    }
}

main()
