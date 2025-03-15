"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyRunner = void 0;
const api_1 = require("../daily/api");
const file_editor_service_1 = require("../services/file-editor.service");
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
exports.dailyRunner = {
    commandName: 'batch',
    execute: async (message, spamChannel) => {
        // check admin
        if (CONFIG.ADMIN_ID.includes(message.author.id) == false) {
            message.reply('Bạn không phải Admin!');
            return;
        }
        await api_1.DailyAPI.batchDaily(spamChannel, true);
    }
};
