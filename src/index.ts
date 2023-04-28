import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import {config} from "dotenv"
import { SocksProxyAgent } from 'socks-proxy-agent';
import helpHandler from "./handlers/help.handler";
config()
const info = {
    hostname: '127.0.0.1',
    port:"8080"
};
const agent = new SocksProxyAgent(info);
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string , {
 telegram :{
     agent
 }
});

bot.start((ctx) => {
  ctx.reply(`Welcome ${ctx.from.first_name} !\n use /help for more info.`);
});
bot.help((ctx) => helpHandler(ctx) );
bot.launch().then(() => {
  console.log("Bot launched")
}).catch(err => {
  console.log(err)
})
