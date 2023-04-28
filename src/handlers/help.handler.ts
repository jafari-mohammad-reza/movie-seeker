import {Context} from "telegraf";

export default function helpHandler(ctx: Context) {
    try {
        return ctx.reply(`Welcome to movie seeker bot dear ${ctx.message.from.username}.
        use /start to start the bot.\n
        use /help for receive this message.\n
        use /search [movie or series name] for searching for what you want.\n
        use /dl [movie or series stream link] to generate a download link.\n`, {reply_to_message_id: ctx.message.message_id})
    } catch (err) {
        console.log(err)
        ctx.reply("Something went wrong. \n try again later", {reply_to_message_id: ctx.message.message_id})

    }
}
