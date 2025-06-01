"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
// Danh sách các slash command của bot
const discord_js_1 = require("discord.js");
exports.commands = [
    {
        name: 'export',
        description: 'Xuất dữ liệu đang có của bot.',
        options: [
            {
                name: 'token',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Xuất ra tất cả [Hoyolab Token] đang có của bot.',
            },
            {
                name: 'history',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Xuất ra tất cả [Lịch Sử Bước Nhảy] đang có của bot.',
            },
        ]
    },
    {
        name: 'play',
        description: 'Phát một bài hát trên Youtube.',
        options: [
            {
                name: 'input',
                type: discord_js_1.ApplicationCommandOptionType.String,
                description: 'Link hoặc từ khóa tìm kiếm trên Youtube.',
                required: true,
            },
        ],
    },
    {
        name: 'deploy',
        description: 'Deploy application (/) commands thủ công.',
    },
    {
        name: 'leave',
        description: 'Bot rời khỏi VoiceChannel'
    },
    {
        name: 'speak',
        description: 'Chuyển văn bản thành giọng nói',
        options: [
            {
                name: 'input',
                type: discord_js_1.ApplicationCommandOptionType.String,
                description: 'Phần văn bản này sẽ được chuyển thành giọng nói',
                required: true,
            },
        ],
    },
    {
        name: 'say',
        description: 'Chuyển văn bản thành giọng nói',
        options: [
            {
                name: 'input',
                type: discord_js_1.ApplicationCommandOptionType.String,
                description: 'Phần văn bản này sẽ được chuyển thành giọng nói',
                required: true,
            },
        ],
    },
    {
        name: 'set',
        description: 'Set Token tài khoản Hoyolab cho bot.',
        options: [
            {
                name: 'token',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Set Token [thường] tài khoản Hoyolab cho bot.',
                options: [
                    {
                        name: 'account_id',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Xin hãy nhập giá trị cho [account_id]',
                        required: true,
                    },
                    {
                        name: 'cookie_token',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Xin hãy nhập giá trị cho [cookie_token]',
                        required: true,
                    },
                ]
            },
            {
                name: 'token_v2',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Set Token [v2] tài khoản Hoyolab cho bot.',
                options: [
                    {
                        name: 'account_id_v2',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Xin hãy nhập giá trị cho [account_id_v2]',
                        required: true,
                    },
                    {
                        name: 'account_mid_v2',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Xin hãy nhập giá trị cho [account_mid_v2]',
                        required: true,
                    },
                    {
                        name: 'cookie_token_v2',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Xin hãy nhập giá trị cho [cookie_token_v2]',
                        required: true,
                    },
                ]
            },
        ],
    },
    {
        name: 'info',
        description: 'Kiểm tra thông tin.',
        options: [
            {
                name: 'hoyolab',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Kiểm tra thông tin tài khoản Hoyolab của chủ nhân.',
            }
        ]
    },
    {
        name: 'history',
        description: 'Kiểm tra lịch sử bước nhảy.',
        options: [
            {
                name: 'character-event',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Bước Nhảy Sự Kiện Nhân Vật.',
                options: [
                    {
                        name: 'url',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Đường dẫn để gọi tới máy chủ',
                        required: true,
                    },
                    {
                        name: 'get_4_star',
                        type: discord_js_1.ApplicationCommandOptionType.Boolean,
                        description: 'Có hiển thị 4 sao hay không',
                        required: false,
                    }
                ]
            },
            {
                name: 'light-cone',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Bước Nhảy Sự Kiện Nón Ánh Sáng.',
                options: [
                    {
                        name: 'url',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Đường dẫn để gọi tới máy chủ',
                        required: true,
                    },
                    {
                        name: 'get_4_star',
                        type: discord_js_1.ApplicationCommandOptionType.Boolean,
                        description: 'Có hiển thị 4 sao hay không',
                        required: false,
                    }
                ]
            },
            {
                name: 'character-standard',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Bước Nhảy Chòm Sao (Banner thường).',
                options: [
                    {
                        name: 'url',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Đường dẫn để gọi tới máy chủ',
                        required: true,
                    },
                    {
                        name: 'get_4_star',
                        type: discord_js_1.ApplicationCommandOptionType.Boolean,
                        description: 'Có hiển thị 4 sao hay không',
                        required: false,
                    }
                ]
            },
            {
                name: 'character-beginer',
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                description: 'Bước Nhảy Đầu Tiên (Banner tân thủ).',
                options: [
                    {
                        name: 'url',
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        description: 'Đường dẫn để gọi tới máy chủ',
                        required: true,
                    },
                    {
                        name: 'get_4_star',
                        type: discord_js_1.ApplicationCommandOptionType.Boolean,
                        description: 'Có hiển thị 4 sao hay không',
                        required: false,
                    }
                ]
            }
        ]
    },
    {
        name: 'gift-code',
        description: 'Nhập gift-code cho tài khoản.',
        options: [
            {
                name: 'honkai-star-rail',
                type: discord_js_1.ApplicationCommandOptionType.String,
                description: 'Code của Honkai Star Rail.',
            },
            {
                name: 'genshin-impact',
                type: discord_js_1.ApplicationCommandOptionType.String,
                description: 'Code của Genshin Impact.',
            },
        ],
    },
];
