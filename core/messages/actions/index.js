"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = exports.HISTORY = exports.LEAVE = exports.PASUE = exports.LOOP = exports.PLAY = exports.SPEAK = exports.BATCH = exports.HELP = void 0;
const discord_js_1 = require("discord.js");
const message_1 = require("../../../assets/constants/message");
const discord_servers_1 = require("../../../model/discord-servers");
const api_1 = require("../../daily/api");
const file_editor_service_1 = require("../../services/file-editor.service");
const myScipt = `script:valid = document.cookie.includes('account_id_v2') && document.cookie.includes('account_mid_v2') && document.cookie.includes('cookie_token_v2') || alert('Token không hợp lệ, vui lòng đăng nhập lại!'); cookie = document.cookie; valid && document.write(\`<p>\${cookie}</p><br><button onclick="navigator.clipboard.writeText('\${cookie}')">Nhấn để sao chép!</button><br>\`)`;
const myScipt_v2 = `script:valid = document.cookie.includes('account_id_v2') && document.cookie.includes('account_mid_v2') && document.cookie.includes('cookie_token_v2') || alert('Token không hợp lệ, vui lòng đăng nhập lại!'); cookie = document.cookie; valid && document.write(\`<p>\${cookie}</p><br><button onclick="navigator.clipboard.writeText('\${cookie}')">Nhấn để sao chép!</button><br>\`)`;
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
exports.HELP = {
    execute: (channel) => {
        if (channel) {
            const embed = new discord_js_1.EmbedBuilder();
            embed.setTitle(':heart: Hướng dẫn set Token Hoyolab cho bé bot :heart: ~');
            embed.addFields({ name: 'Bước 1:', value: 'Mở tab [Ẩn danh] và đăng nhập vào Hoyolab\n```https://www.hoyolab.com/home```' }, { name: 'Bước 2:', value: 'Sau khi đăng nhập thành công thì Refresh (F5) lại trang' }, { name: 'Bước 3:', value: 'Nhấn [F12] để mở [DevTools], chọn vào thẻ [Application] hoặc [Storage]' }, { name: 'Bước 4:', value: 'Chọn phần [Cookies], sau đó sử dụng một trong các lệnh sau của bot tại thanh chat\n```/set token```Hoặc```/set token_v2```' }, { name: 'Bước 5:', value: 'Nhập đầy đủ thông tin mà lệnh yêu cầu từ [Cookies]' }, { name: 'Bước 6:', value: 'Tắt trình [Ẩn danh] đi mà không đăng xuất, như này thì Token sẽ có hạn sử dụng 365 ngày (trừ khi đổi mật khẩu)!' }, { name: ':smiling_face_with_3_hearts: Chúc chủ nhân thao tác thành công :smiling_face_with_3_hearts: ~', value: ' ' });
            embed.setImage('https://cdn.discordapp.com/attachments/612366380829769728/1168848705496031354/image.png');
            channel.send({ embeds: [embed] });
        }
    }
};
exports.BATCH = {
    execute: async (message, spamChannel) => {
        // check admin
        if (CONFIG.ADMIN_ID.includes(message.author.id) == false) {
            message.reply('Bạn không phải Admin!');
            return;
        }
        await api_1.DailyAPI.batchDaily(spamChannel, true);
    }
};
exports.SPEAK = {
    execute: (message, userInput, canManageMessage) => {
        const myServer = discord_servers_1.DiscordServers.getServerByMessage(message);
        if (myServer == null) {
            message.reply(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        myServer.textToSpeechByMessage(message, userInput, canManageMessage);
    }
};
exports.PLAY = {
    execute: (message, prefix) => {
        const myServer = discord_servers_1.DiscordServers.getServerByMessage(message);
        if (myServer == null) {
            message.reply(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        myServer.playMusicByMessage(message, prefix);
    }
};
exports.LOOP = {
    execute: (message) => {
        const myServer = discord_servers_1.DiscordServers.getServerByMessage(message);
        if (myServer == null) {
            message.reply(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        myServer.setLoopByMessage(message);
    }
};
exports.PASUE = {
    execute: (message) => {
        const myServer = discord_servers_1.DiscordServers.getServerByMessage(message);
        if (myServer == null) {
            message.reply(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        myServer.pauseMusicByMessage(message);
    }
};
exports.LEAVE = {
    execute: (message) => {
        const myServer = discord_servers_1.DiscordServers.getServerByMessage(message);
        if (myServer == null) {
            message.reply(message_1.MSG.frontEnd.music.pleaseJoinVoiceChannel);
            return;
        }
        myServer.leaveVoiceChannelByMessage(message);
    }
};
exports.HISTORY = {
    execute: (channel) => {
        if (channel) {
            const embed = new discord_js_1.EmbedBuilder();
            const myCode = '[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; Invoke-Expression (New-Object Net.WebClient).DownloadString("https://gist.githubusercontent.com/Star-Rail-Station/2512df54c4f35d399cc9abbde665e8f0/raw/get_warp_link_os.ps1?cachebust=srs")';
            embed.setTitle(':heart: Hướng dẫn xem lịch sử bước nhảy HSR :heart: ~');
            embed.addFields({ name: 'Bước 1:', value: 'Mở game bằng máy tính, vào trang `[Lịch sử bước nhảy]` bất kì của chủ nhân.' }, { name: 'Bước 2:', value: 'Dán đoạn code phía dưới vào `[Windows PowerShell]`\n```' + myCode + '```' }, { name: 'Bước 3:', value: 'Sử dụng một trong các lệnh sau của bot tại thanh chat\n```/history```' }, { name: 'Bước 4:', value: 'Dán giá trị trong `[Windows PowerShell]` vào phần `[url]` của lệnh' }, { name: 'Lưu ý:', value: 'Chỉ cần 1 `[url]` là có thể sử dụng cho tất cả các lệnh `/history`' }, { name: ':smiling_face_with_3_hearts: Chúc chủ nhân thao tác thành công :smiling_face_with_3_hearts: ~', value: ' ' });
            embed.setImage('https://cdn.discordapp.com/attachments/612366380829769728/1190170884648992778/image.png');
            channel.send({ embeds: [embed] });
        }
    }
};
exports.URL = {
    execute: (channel) => {
        if (channel) {
            const myCode = '[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; Invoke-Expression (New-Object Net.WebClient).DownloadString("https://gist.githubusercontent.com/Star-Rail-Station/2512df54c4f35d399cc9abbde665e8f0/raw/get_warp_link_os.ps1?cachebust=srs")';
            channel.send('```' + myCode + '```');
        }
    }
};
