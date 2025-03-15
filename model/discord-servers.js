"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordServers = exports.DiscordServer = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const google_tts_api_1 = require("google-tts-api");
const message_1 = require("../assets/constants/message");
const youtube_service_1 = require("../core/services/youtube.service");
class DiscordServer {
    guildId;
    serverName;
    audioPlayer;
    voiceConnection;
    isPlayingLoop = true;
    isPlayingMusic = false;
    userInput = '';
    messageVoice;
    voiceChannel;
    constructor(guildId, serverName, voiceConnection) {
        this.guildId = guildId;
        this.serverName = serverName;
        this.voiceConnection = voiceConnection;
        console.log(message_1.MSG.backEnd.info.create, 'Server: ' + serverName);
        // tạo audio player + add subscriber để phát nhạc
        this.audioPlayer = (0, voice_1.createAudioPlayer)({ behaviors: { noSubscriber: voice_1.NoSubscriberBehavior.Pause } });
        this.voiceConnection.subscribe(this.audioPlayer);
        // check state of voiceConnection
        this.voiceConnection.on('stateChange', (oldState, newState) => {
            if (oldState.status === newState.status)
                return;
            console.log(message_1.MSG.backEnd.info.stateChange, 'Connection', oldState.status, newState.status);
        });
        // check state of audioPlayer
        this.audioPlayer.on('stateChange', (oldState, newState) => {
            if (oldState.status === newState.status)
                return;
            console.log(message_1.MSG.backEnd.info.stateChange, 'AudioPlayer', oldState.status, newState.status);
            if (oldState.status == voice_1.AudioPlayerStatus.Playing && newState.status == voice_1.AudioPlayerStatus.Idle && this.isPlayingLoop && this.isPlayingMusic) {
                this.replayMusic();
            }
        });
    }
    replayMusic() {
        this.isPlayingMusic = true;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        if (voiceConnection)
            voiceConnection.destroy();
        // create new voiceConnection
        this.voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: this.voiceChannel.id,
            guildId: this.voiceChannel.guild.id,
            adapterCreator: this.voiceChannel.guild.voiceAdapterCreator,
        });
        this.voiceConnection.on(voice_1.VoiceConnectionStatus.Ready, async () => {
            try {
                const youTubeStream = await youtube_service_1.YoutubeService.createStream(this.userInput);
                if (youTubeStream == null) {
                    this.messageVoice.channel.send(message_1.MSG.frontEnd.error.default);
                    return;
                }
                const audioResource = (0, voice_1.createAudioResource)(youTubeStream.stream, {
                    inputType: youTubeStream.type,
                    inlineVolume: true
                });
                // apply voiceConnection
                this.voiceConnection.subscribe(this.audioPlayer);
                this.audioPlayer.play(audioResource);
                this.audioPlayer.once(voice_1.AudioPlayerStatus.Playing, async (oldState, newState) => {
                    this.messageVoice.channel.send(message_1.MSG.frontEnd.music.loopingYourSong);
                });
            }
            catch (error) {
                this.messageVoice.channel.send(message_1.MSG.frontEnd.error.default);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    }
    playMusicByMessage(message, prefix) {
        this.isPlayingMusic = true;
        if (!(message.member instanceof discord_js_1.GuildMember && message.member.voice.channel)) {
            message.channel.send(message_1.MSG.frontEnd.error.default);
            return;
        }
        ;
        const userInput = message.content.slice(prefix.length).trim();
        const voiceChannel = message.member.voice.channel;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        // create backup
        this.userInput = userInput;
        this.messageVoice = message;
        this.voiceChannel = voiceChannel;
        if (voiceConnection)
            voiceConnection.destroy();
        // create new voiceConnection
        this.voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.voiceConnection.on(voice_1.VoiceConnectionStatus.Ready, async () => {
            try {
                const youTubeStream = await youtube_service_1.YoutubeService.createStream(userInput);
                if (youTubeStream == null) {
                    message.channel.send(message_1.MSG.frontEnd.error.default);
                    return;
                }
                const audioResource = (0, voice_1.createAudioResource)(youTubeStream.stream, {
                    inputType: youTubeStream.type,
                    inlineVolume: true
                });
                // apply voiceConnection
                this.voiceConnection.subscribe(this.audioPlayer);
                this.audioPlayer.play(audioResource);
                this.audioPlayer.once(voice_1.AudioPlayerStatus.Playing, async (oldState, newState) => {
                    message.channel.send(message_1.MSG.frontEnd.music.playingYourSong);
                });
            }
            catch (error) {
                message.reply(message_1.MSG.frontEnd.error.default);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    }
    async playMusicByInteraction(interaction) {
        this.isPlayingMusic = true;
        // chờ cho người dùng nhập dữ liệu vào
        await interaction.deferReply();
        if (!(interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel)) {
            await interaction.followUp(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        ;
        // tìm kiếm dựa theo "name" đã định nghĩa trong danh sách ApplicationCommandData
        const userInput = interaction.options.get('input')?.value;
        const voiceChannel = interaction.member.voice.channel;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        // create backup
        this.userInput = userInput;
        this.voiceChannel = voiceChannel;
        if (voiceConnection)
            voiceConnection.destroy();
        // create new voiceConnection
        this.voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.voiceConnection.on(voice_1.VoiceConnectionStatus.Ready, async () => {
            try {
                const youTubeStream = await youtube_service_1.YoutubeService.createStream(userInput);
                if (!youTubeStream) {
                    interaction.followUp(message_1.MSG.frontEnd.error.default);
                    return;
                }
                const audioResource = (0, voice_1.createAudioResource)(youTubeStream.stream, {
                    inputType: youTubeStream.type,
                    inlineVolume: true
                });
                // apply voiceConnection
                this.voiceConnection.subscribe(this.audioPlayer);
                this.audioPlayer.play(audioResource);
                this.audioPlayer.once(voice_1.AudioPlayerStatus.Playing, async (oldState, newState) => {
                    interaction.followUp(message_1.MSG.frontEnd.music.playingYourSong);
                });
            }
            catch (error) {
                interaction.followUp(message_1.MSG.frontEnd.error.default);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    }
    setLoopByMessage(message) {
        this.isPlayingLoop = !this.isPlayingLoop;
        message.channel.send(this.isPlayingLoop ? message_1.MSG.frontEnd.music.loopYourSong : message_1.MSG.frontEnd.music.unloopYourSong);
    }
    textToSpeechByMessage(message, userInput, canManageMessage) {
        this.isPlayingMusic = false;
        if (!(message.member instanceof discord_js_1.GuildMember && message.member.voice.channel)) {
            message.reply(message_1.MSG.frontEnd.error.default);
            return;
        }
        ;
        const voiceChannel = message.member.voice.channel;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        // create backup
        this.userInput = userInput;
        this.messageVoice = message;
        this.voiceChannel = voiceChannel;
        if (voiceConnection)
            voiceConnection.destroy();
        // create new voiceConnection
        this.voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.voiceConnection.on(voice_1.VoiceConnectionStatus.Ready, async () => {
            try {
                // dùng để speak bằng chị google
                // create audioResource
                const audioUrl = (0, google_tts_api_1.getAudioUrl)(this.replaceAllTextToSpeach(userInput), {
                    lang: 'vi',
                    slow: false,
                    host: 'https://translate.google.com.vn'
                });
                const audioResource = (0, voice_1.createAudioResource)(audioUrl, { inlineVolume: true });
                // apply voiceConnection
                this.voiceConnection.subscribe(this.audioPlayer);
                this.audioPlayer.play(audioResource);
                // xóa đi message
                this.audioPlayer.once(voice_1.AudioPlayerStatus.Playing, async (oldState, newState) => {
                    try {
                        if (canManageMessage)
                            await message.delete();
                    }
                    catch (error) {
                        console.error('Error deleting user message:', error);
                    }
                });
            }
            catch (error) {
                message.reply(message_1.MSG.frontEnd.error.default);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    }
    async textToSpeechByInteraction(interaction) {
        this.isPlayingMusic = false;
        // chờ cho người dùng nhập dữ liệu vào
        await interaction.deferReply();
        if (!(interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel)) {
            await interaction.followUp(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        ;
        // tìm kiếm dựa theo "name" đã định nghĩa trong danh sách ApplicationCommandData
        let userInput = interaction.options.get('input')?.value;
        const voiceChannel = interaction.member.voice.channel;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        // create backup
        this.userInput = userInput;
        this.voiceChannel = voiceChannel;
        if (voiceConnection)
            voiceConnection.destroy();
        // create new voiceConnection
        this.voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.voiceConnection.on(voice_1.VoiceConnectionStatus.Ready, async () => {
            try {
                // dùng để speak bằng chị google
                // create audioResource
                const audioUrl = (0, google_tts_api_1.getAudioUrl)(this.replaceAllTextToSpeach(userInput), {
                    lang: 'vi',
                    slow: false,
                    host: 'https://translate.google.com.vn'
                });
                const audioResource = (0, voice_1.createAudioResource)(audioUrl, { inlineVolume: true });
                // apply voiceConnection
                this.voiceConnection.subscribe(this.audioPlayer);
                this.audioPlayer.play(audioResource);
                // xóa đi message
                this.audioPlayer.once(voice_1.AudioPlayerStatus.Playing, async (oldState, newState) => {
                    try {
                        await interaction.deleteReply();
                    }
                    catch (error) {
                        console.error(message_1.MSG.backEnd.error.default, error);
                    }
                });
            }
            catch (error) {
                interaction.followUp(message_1.MSG.frontEnd.error.default);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    }
    pauseMusicByMessage(message) {
        switch (this.audioPlayer.state.status) {
            case voice_1.AudioPlayerStatus.Playing:
                this.audioPlayer.pause();
                message.channel.send(message_1.MSG.frontEnd.music.pauseYourSong);
                break;
            case voice_1.AudioPlayerStatus.Paused:
                this.audioPlayer.unpause();
                message.channel.send(message_1.MSG.frontEnd.music.unpauseYourSong);
                break;
        }
    }
    leaveVoiceChannelByMessage(message) {
        if (!(message.member instanceof discord_js_1.GuildMember && message.member.voice.channel)) {
            message.reply(message_1.MSG.frontEnd.error.default);
            return;
        }
        ;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        if (voiceConnection) {
            voiceConnection.destroy();
            message.channel.send(message_1.MSG.frontEnd.music.leaveVoiceChannel);
        }
    }
    async leaveVoiceChannelByInteraction(interaction) {
        // chờ cho người dùng nhập dữ liệu vào
        await interaction.deferReply();
        if (!(interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel)) {
            interaction.followUp(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        ;
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guildId);
        if (voiceConnection) {
            voiceConnection.destroy();
            interaction.followUp(message_1.MSG.frontEnd.music.leaveVoiceChannel);
        }
    }
    replaceAllTextToSpeach(userInput) {
        userInput = ' ' + userInput.trim() + ' ';
        // check some special case
        userInput = userInput.replaceAll(' k ', ' không ');
        userInput = userInput.replaceAll(' k? ', ' không? ');
        userInput = userInput.replaceAll(' ko ', ' không ');
        userInput = userInput.replaceAll(' ko? ', ' không? ');
        userInput = userInput.replaceAll(' dc ', ' được ');
        userInput = userInput.replaceAll(' dc? ', ' được? ');
        userInput = userInput.replaceAll(' đc ', ' được ');
        userInput = userInput.replaceAll(' đc? ', ' được? ');
        userInput = userInput.replaceAll(' ng ', ' người ');
        userInput = userInput.replaceAll(' ng? ', ' người? ');
        userInput = userInput.replaceAll(' nhìu ', ' nhiều ');
        userInput = userInput.replaceAll(' nhìu? ', ' nhiều? ');
        userInput = userInput.replaceAll(' z ', ' vậy ');
        userInput = userInput.replaceAll(' z? ', ' vậy? ');
        console.log('[SPEAK]:', userInput.trim());
        return userInput.trim();
    }
}
exports.DiscordServer = DiscordServer;
class DiscordServers {
    static _discordServers = new Map();
    static getServerByInteraction(interaction) {
        const guildId = interaction.guildId;
        if (!guildId)
            return;
        let myServer = DiscordServers._discordServers.get(guildId);
        if (myServer == null) {
            if (!(interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel) || !interaction.guild)
                return;
            // tạo mới server và add vào danh sách
            const voiceChannel = interaction.member.voice.channel;
            const voiceConnection = (0, voice_1.joinVoiceChannel)({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });
            myServer = new DiscordServer(guildId, interaction.guild.name, voiceConnection);
            this.addServer(guildId, myServer);
        }
        return myServer;
    }
    static getServerByMessage(message) {
        const guildId = message.guildId;
        if (!guildId)
            return;
        let myServer = DiscordServers._discordServers.get(guildId);
        if (myServer == null) {
            if (!(message.member instanceof discord_js_1.GuildMember && message.member.voice.channel) || !message.guild)
                return;
            // tạo mới server và add vào danh sách
            const voiceChannel = message.member.voice.channel;
            const voiceConnection = (0, voice_1.joinVoiceChannel)({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });
            myServer = new DiscordServer(guildId, message.guild.name, voiceConnection);
            this.addServer(guildId, myServer);
        }
        return myServer;
    }
    static getAllServer() {
        return Array.from(DiscordServers._discordServers.values());
    }
    static addServer(guildId, newServer) {
        DiscordServers._discordServers.set(guildId, newServer);
    }
}
exports.DiscordServers = DiscordServers;
