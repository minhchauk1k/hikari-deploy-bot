"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import thư viện internal tự build
const commands_1 = require("./core/commands");
const messages_1 = require("./core/messages");
const daily_service_1 = require("./core/services/daily.service");
const file_editor_service_1 = require("./core/services/file-editor.service");
require("dotenv/config");
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
// yêu cầu API và định nghĩa 1 con bot theo API
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const message_1 = require("./assets/constants/message");
const bot = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildIntegrations
    ]
});
bot.on(discord_js_1.Events.VoiceStateUpdate, (oldState, newState) => {
    if (oldState.channelId == null && (newState.channelId != null || newState == null))
        return;
    if (oldState.channel?.members.size == 1 && oldState.channel?.members.first()?.user == bot.user) {
        const voiceConnection = (0, voice_1.getVoiceConnection)(oldState.guild.id);
        if (voiceConnection) {
            voiceConnection.disconnect();
            console.log('Bot ngừng phát nhạc gì không còn ai trong channel!');
        }
    }
});
// Tải bot
bot.once(discord_js_1.Events.ClientReady, async () => {
    // check Voice Dependency
    console.log((0, voice_1.generateDependencyReport)());
    const timeZone = { timeZone: 'Asia/Ho_Chi_Minh' };
    console.log('Ngày: ' + new Date().toLocaleDateString('vi-VN', timeZone), 'Lúc: ' + new Date().toLocaleTimeString('vi-VN', timeZone));
    console.log(`Đã đăng nhập và online dưới tên của ${bot.user.username}!`);
    setInterval(() => {
        // tạo số ngẫu nhiên
        const index = Math.floor(Math.random() * activities_list.length);
        // set status
        bot.user.setActivity(activities_list[index]);
    }, 10000);
    // config spam channel
    configSpamChannel();
    // create Schedule
    daily_service_1.DailyService.createSchedule(_channel);
    // add application (/) commands Watcher cho bot
    (0, commands_1.commandsWatcher)(bot);
    // add Message Watcher cho bot
    (0, messages_1.messageWatcher)(bot, _channel);
});
// list ngẫu nhiên
const activities_list = [
    'Đang hủy diệt thế giới!',
    'Đang ngồi tự kỉ ...',
    'Đang chơi Honkai Impact 3',
    'Đang lục thùng rác ~',
    'Đang chơi Genshin Impact'
];
let _guild;
let _channel;
function configSpamChannel() {
    // Get the channel by its ID
    _guild = bot.guilds.cache.find(guild => guild.id == CONFIG.GUILD_ID);
    if (_guild == null) {
        console.error('=> Không tìm thấy [Server] để cấu hình!!');
        return;
    }
    _channel = _guild.channels.cache.find(channel => channel.id == CONFIG.CHANNEL_ID);
    if (_channel == null) {
        console.error('=> Không tìm thấy [Channel] để cấu hình!!');
        return;
    }
    console.log(message_1.MSG.backEnd.info.create, 'Spam Channel: ' + _channel.name);
}
bot.login(process.env.BOT_TOKEN);
