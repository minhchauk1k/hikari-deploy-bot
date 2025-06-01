"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandActions = void 0;
const message_1 = require("../../../assets/constants/message");
const discord_servers_1 = require("../../../model/discord-servers");
const api_1 = require("../../daily/api");
const hoyolab_service_1 = require("../../services/hoyolab.service");
const file_editor_service_1 = require("../../services/file-editor.service");
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
exports.commandActions = {
    set: {
        token: async (interaction) => {
            try {
                await interaction.deferReply();
                const result = await hoyolab_service_1.HoyolabService.setTokenByInteraction(interaction);
                const channel = interaction.channel;
                if (result == message_1.MSG.status.OK) {
                    await interaction.deleteReply();
                    channel.send(message_1.MSG.frontEnd.info.saveAccountSuccess);
                    channel.send(await hoyolab_service_1.HoyolabService.infoByInteraction(interaction));
                    // auto run daily
                    await api_1.DailyAPI.batchDaily(channel, true);
                }
                else {
                    await interaction.deleteReply();
                    channel.send(`Chủ nhân @${interaction.user.globalName} -> ` + result);
                }
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        }
    },
    info: {
        hoyolab: async (interaction) => {
            try {
                await interaction.deferReply();
                await interaction.followUp(await hoyolab_service_1.HoyolabService.infoByInteraction(interaction));
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        },
        song: async (interaction) => {
        },
    },
    daily: {
        batch: async (interaction) => {
            try {
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        },
    },
    speak: async (interaction) => {
        try {
            const myServer = discord_servers_1.DiscordServers.getServerByInteraction(interaction);
            if (myServer == null) {
                await interaction.followUp(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
                return;
            }
            myServer.textToSpeechByInteraction(interaction);
        }
        catch (error) {
            await interaction.followUp(message_1.MSG.frontEnd.error.default);
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    },
    leave: async (interaction) => {
        try {
            const myServer = discord_servers_1.DiscordServers.getServerByInteraction(interaction);
            if (myServer == null) {
                await interaction.followUp(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
                return;
            }
            myServer.leaveVoiceChannelByInteraction(interaction);
        }
        catch (error) {
            await interaction.followUp(message_1.MSG.frontEnd.error.default);
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    },
    playMusic: async (interaction) => {
        try {
            const myServer = discord_servers_1.DiscordServers.getServerByInteraction(interaction);
            if (myServer == null) {
                await interaction.followUp(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
                return;
            }
            myServer.playMusicByInteraction(interaction);
        }
        catch (error) {
            await interaction.followUp(message_1.MSG.frontEnd.error.default);
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    },
    history: {
        character_event: async (interaction) => {
            try {
                await interaction.deferReply();
                const result = await hoyolab_service_1.HoyolabService.getHistory(interaction, 11);
                if (result.length <= 2000) {
                    await interaction.followUp(result);
                }
                else {
                    await interaction.followUp('Xem kết quả bên dưới:');
                    exports.commandActions.handleResultLength(result)?.forEach(async (data) => await interaction.channel?.send(data));
                }
                try {
                    // run in background for sync data
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 1);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 2);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 12);
                }
                catch (error) {
                    // do nothing
                }
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        },
        character_standard: async (interaction) => {
            try {
                await interaction.deferReply();
                const result = await hoyolab_service_1.HoyolabService.getHistory(interaction, 1);
                if (result.length <= 2000) {
                    await interaction.followUp(result);
                }
                else {
                    await interaction.followUp('Xem kết quả bên dưới:');
                    exports.commandActions.handleResultLength(result)?.forEach(async (data) => await interaction.channel?.send(data));
                }
                try {
                    // run in background for sync data
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 2);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 11);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 12);
                }
                catch (error) {
                    // do nothing
                }
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        },
        character_beginer: async (interaction) => {
            try {
                await interaction.deferReply();
                const result = await hoyolab_service_1.HoyolabService.getHistory(interaction, 2);
                if (result.length <= 2000) {
                    await interaction.followUp(result);
                }
                else {
                    await interaction.followUp('Xem kết quả bên dưới:');
                    exports.commandActions.handleResultLength(result)?.forEach(async (data) => await interaction.channel?.send(data));
                }
                try {
                    // run in background for sync data
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 1);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 11);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 12);
                }
                catch (error) {
                    // do nothing
                }
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        },
        light_cone: async (interaction) => {
            try {
                await interaction.deferReply();
                const result = await hoyolab_service_1.HoyolabService.getHistory(interaction, 12);
                if (result.length <= 2000) {
                    await interaction.followUp(result);
                }
                else {
                    await interaction.followUp('Xem kết quả bên dưới:');
                    exports.commandActions.handleResultLength(result)?.forEach(async (data) => await interaction.channel?.send(data));
                }
                try {
                    // run in background for sync data
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 1);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 2);
                    await hoyolab_service_1.HoyolabService.getHistory(interaction, 11);
                }
                catch (error) {
                    // do nothing
                }
            }
            catch (error) {
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        },
    },
    handleResultLength: (result) => {
        let tempStr = '';
        const finalResult = [];
        const lineArray = result.match(/.{1,2000}/g);
        lineArray?.forEach(line => {
            line = line.replace('```', '');
            // pre format
            if (line.includes('Số bước nhảy hiện tại (5 sao):')) {
                line = '\n' + line;
            }
            if (line.includes('Số bước nhảy hiện tại (4 sao):')) {
                line += '\n';
            }
            if (line.includes('Lưu ý: dòng cuối có thể sai do thiếu dữ liệu ~')) {
                line = '\n' + line + '\n';
            }
            if (tempStr.length + line.length <= 2000 - 6) {
                tempStr += line + '\n';
            }
            else {
                finalResult.push('```' + tempStr + '```');
                tempStr = '';
            }
        });
        // for last line
        if (tempStr.length) {
            finalResult.push('```' + tempStr + '```');
        }
        return finalResult;
    },
    export: {
        getTokenFile: async (interaction) => {
            try {
                await interaction.deferReply();
                // check admin
                if (CONFIG.ADMIN_ID.includes(interaction.user.id) == false) {
                    interaction.followUp('Bạn không phải Admin!');
                    return;
                }
                await interaction.followUp({ files: [file_editor_service_1.FileEditorService.getTokenFileForExport()] });
            }
            catch (error) {
                console.error(error);
            }
        },
        getHistoryFile: async (interaction) => {
            try {
                await interaction.deferReply();
                // check admin
                if (CONFIG.ADMIN_ID.includes(interaction.user.id) == false) {
                    interaction.followUp('Bạn không phải Admin!');
                    return;
                }
                await interaction.followUp({ files: [file_editor_service_1.FileEditorService.getHistoryFileForExport()] });
            }
            catch (error) {
                console.error(error);
            }
        },
    }
};
