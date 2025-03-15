"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageWatcher = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const message_1 = require("../../assets/constants/message");
const file_editor_service_1 = require("../services/file-editor.service");
const ACTIONS = tslib_1.__importStar(require("./actions"));
const defined_1 = require("./defined");
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
const messageWatcher = async (bot, spamChannel) => {
    bot.on(discord_js_1.Events.MessageCreate, async (message) => {
        if (message.author.equals(bot.user))
            return;
        const _message = message.content.toLowerCase().trim();
        const _startWith = _message.split(' ')[0];
        const _userInput = _message.slice(_startWith.length).trim();
        const _currentGuild = bot.guilds.cache.find(guild => guild.id == message.guild?.id);
        // for text channel
        const _textChannel = message.channel;
        const _permissionsInTextChannel = _currentGuild?.members.cache.find(member => member.id == bot.user?.id)?.permissionsIn(_textChannel);
        const _canManageMessage = _permissionsInTextChannel.has(discord_js_1.PermissionsBitField.Flags.ManageMessages) ?? false;
        try {
            switch (_startWith) {
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_1:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_2:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_3:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_SHORT:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_SHORT_1:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_SHORT_2:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SPEAK_SHORT_3:
                    ACTIONS.SPEAK.execute(message, _userInput, _canManageMessage);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.BATCH:
                    ACTIONS.BATCH.execute(message, _textChannel);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.HELP:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.HELP_1:
                    ACTIONS.HELP.execute(_textChannel);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.PLAY:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.PLAY_SHORT:
                    ACTIONS.PLAY.execute(message, _startWith);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.LOOP:
                    ACTIONS.LOOP.execute(message);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.SKIP:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.PAUSE:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.STOP:
                    ACTIONS.PASUE.execute(message);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.LEAVE:
                    ACTIONS.LEAVE.execute(message);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.HISTORY:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.HISTORY_1:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.HISTORY_2:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.HISTORY_3:
                    ACTIONS.HISTORY.execute(_textChannel);
                    break;
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.URL:
                case CONFIG.PREFIX + defined_1.MESSAGE_DEFINED.URL_1:
                    ACTIONS.URL.execute(_textChannel);
                    break;
            }
        }
        catch (error) {
            message.reply(message_1.MSG.frontEnd.error.default);
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    });
};
exports.messageWatcher = messageWatcher;
