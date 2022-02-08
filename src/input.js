const buttonMenu = require("./buttonMenu");
const Discord = require("discord.js");
const translate = require("./translate");

/**
 * @param {boolean} useButtons If true, use buttons. If false, use text input
 * @param {any} input The Message Sent by the User.
 * @param {Discord.Message} botMessage The Message for the Bot to Send, also the message which will contain the buttons (Max. 8). MUST BE AN EMBED!
 * 
 */

module.exports = async function awaitInput(useButtons, input, botMessage, isGuessFilter, translations, language) {
    //check if useButtons is true. If so, use buttons.  If not, use text input
    if (useButtons) {

        let yes = { type: 2, label: translations.yes, style: 2, emoji: { name: "✅" }, custom_id: "✅" }
        let no = { type: 2, label: translations.no, style: 2, emoji: { name: "❌" }, custom_id: "❌" }
        let idk = { type: 2, label: translations.dontKnow, style: 2, emoji: { name: "❓" }, custom_id: "❓" }
        let probably = { type: 2, label: translations.probably, style: 2, emoji: { name: "👍" }, custom_id: "👍" }
        let probablyNot = { type: 2, label: translations.probablyNot, style: 2, emoji: { name: "👎" }, custom_id: "👎" }
        let back = { type: 2, label: translations.back, style: 2, emoji: { name: "⏪" }, custom_id: "⏪" }
        let stop = { type: 2, label: translations.stop, style: 4, emoji: { name: "🛑" }, custom_id: "🛑" }

        let answerTypes = [];

        if (isGuessFilter) {
            answerTypes = [yes, no]
        }
        else {
            answerTypes = [yes, no, idk, probably, probablyNot, back, stop]
        }

        let choice = await buttonMenu(input.client, input, botMessage, answerTypes, 60000);
        if (!choice) return null;
        else return choice;
    }
    else {
        let filter;
        if (isGuessFilter) {
            filter = x => {
                return (x.author.id === input.author.id && ([
                    "y",
                    translations.yes.toLowerCase(),
                    "n",
                    translations.no.toLowerCase(),
                ].includes(x.content.toLowerCase())));
            }
        } else {
            filter = x => {
                return (x.author.id === input.author.id && ([
                    "y",
                    translations.yes.toLowerCase(),
                    "n",
                    translations.no.toLowerCase(),
                    "i",
                    "idk",
                    translations.dontKnowNoComma.toLowerCase(),
                    translations.dontKnow.toLowerCase(),
                    "p",
                    translations.probably.toLowerCase(),
                    "pn",
                    translations.probablyNot.toLowerCase(),
                    "b",
                    translations.back.toLowerCase(),
                    "s",
                    translations.stop.toLowerCase(),
                ].includes(x.content.toLowerCase())));
            }
        }
        let response = await input.channel.awaitMessages({
            filter: filter,
            max: 1,
            time: 60000
        })

        if (!response.size) {
            return null
        }
        else {
            await response.first().delete();
            return await translate(String(response.first()).toLowerCase(), language)
        }

    }
}
