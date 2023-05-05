import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import {config} from "dotenv"
import helpHandler from "./handlers/help.handler";
import searchHandler from "./handlers/search.handler"
import agent from "./lib/proxy-agent"
import { log } from 'console';
config()
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string , {
 telegram :{
     agent
 }
});
bot.start((ctx) => {
  ctx.reply(`Welcome ${ctx.from.first_name} !\n use /help for more info.`);
});
bot.help((ctx) => helpHandler(ctx) );
bot.command("search" , (ctx) => searchHandler(ctx))
bot.launch().then(() => {
  log("Connected")
}).catch(err => {
    log(err)
  })
