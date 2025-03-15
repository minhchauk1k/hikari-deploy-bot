"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsDeployer = void 0;
const discord_js_1 = require("discord.js");
const defined_1 = require("../commands/defined");
const file_editor_service_1 = require("../services/file-editor.service");
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
const autoDeployCommands = async (bot) => {
    try {
        console.log('Bắt đầu deploy application (/) commands.');
        const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: defined_1.commands });
        console.log('Kết thúc deploy application (/) commands.');
    }
    catch (error) {
        console.error('Xảy ra lỗi deploy application (/) commands:', error);
    }
};
const interactionDeployCommands = async (interaction) => {
    try {
        await interaction.deferReply();
        console.log('Bắt đầu deploy application (/) commands.');
        const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: defined_1.commands });
        await interaction.followUp('Kết thúc deploy application (/) commands.');
        console.log('Kết thúc deploy application (/) commands.');
    }
    catch (error) {
        await interaction.followUp('Xảy ra lỗi deploy application (/) commands:');
        console.error('Xảy ra lỗi deploy application (/) commands:', error);
    }
};
const messageDeployCommands = async (message) => {
    try {
        console.log('Bắt đầu deploy application (/) commands.');
        const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: defined_1.commands });
        console.log('Kết thúc deploy application (/) commands.');
    }
    catch (error) {
        console.error('Xảy ra lỗi deploy application (/) commands:', error);
    }
};
exports.commandsDeployer = {
    commandName: 'deploy',
    executeAuto: autoDeployCommands,
    executeInteraction: interactionDeployCommands,
    executeMessage: messageDeployCommands
};
