"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsWatcher = void 0;
const discord_js_1 = require("discord.js");
// import { musicPlayer } from "../actions/music-player";
const commands_deployer_1 = require("../actions/commands-deployer");
// import { voiceSpeaker } from "../actions/voice-speaker";
const message_1 = require("../../assets/constants/message");
const actions_1 = require("./actions");
const commandsWatcher = async (bot) => {
    // auto deploy application (/) commands
    commands_deployer_1.commandsDeployer.executeAuto(bot);
    bot.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        // nếu command không hợp lệ hoặc ko có guildId thì hủy
        if (!interaction.isCommand() || !interaction.guildId)
            return;
        try {
            switch (interaction.commandName) {
                case commands_deployer_1.commandsDeployer.commandName:
                    commands_deployer_1.commandsDeployer.executeInteraction(interaction);
                    break;
                case 'say':
                case 'speak':
                    actions_1.commandActions.speak(interaction);
                    break;
                case 'info':
                    switch (interaction.options.data[0].name) {
                        case 'hoyolab':
                            actions_1.commandActions.info.hoyolab(interaction);
                            break;
                    }
                    break;
                case 'play':
                    actions_1.commandActions.playMusic(interaction);
                    break;
                case 'set':
                    switch (interaction.options.data[0].name) {
                        case 'token':
                        case 'token_v2':
                            actions_1.commandActions.set.token(interaction);
                            break;
                    }
                    break;
                case 'leave':
                    actions_1.commandActions.leave(interaction);
                    break;
                case 'history':
                    switch (interaction.options.data[0].name) {
                        case 'character-event':
                            actions_1.commandActions.history.character_event(interaction);
                            break;
                        case 'character-standard':
                            actions_1.commandActions.history.character_standard(interaction);
                            break;
                        case 'character-beginer':
                            actions_1.commandActions.history.character_beginer(interaction);
                            break;
                        case 'light-cone':
                            actions_1.commandActions.history.light_cone(interaction);
                            break;
                    }
                    break;
                case 'export':
                    switch (interaction.options.data[0].name) {
                        case 'token':
                            actions_1.commandActions.export.getTokenFile(interaction);
                            break;
                        case 'history':
                            actions_1.commandActions.export.getHistoryFile(interaction);
                            break;
                    }
                    break;
            }
        }
        catch (error) {
            interaction.reply(message_1.MSG.frontEnd.error.default);
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    });
};
exports.commandsWatcher = commandsWatcher;
