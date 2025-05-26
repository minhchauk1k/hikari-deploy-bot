"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEditorService = void 0;
const fs_1 = require("fs");
const message_1 = require("../../assets/constants/message");
const discord_js_1 = require("discord.js");
class FileEditorService {
    static CONFIG_URL = 'src/assets/constants/config.json';
    static TOKEN_URL = 'src/assets/token/token.json';
    static HISTORY_URL = 'src/assets/history/history.json';
    static getTokenFile() {
        const timeZone = { timeZone: 'Asia/Ho_Chi_Minh' };
        const stringDate = new Date().toLocaleDateString('vi-VN', timeZone);
        const fileName = 'hoyolab_tokens_' + stringDate.replaceAll('/', '_') + '.json';
        return new discord_js_1.AttachmentBuilder(this.TOKEN_URL, { name: fileName });
    }
    static getBotConfig() {
        try {
            const data = (0, fs_1.readFileSync)(this.CONFIG_URL, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
            return {};
        }
    }
    static updateConfig(key, value) {
        try {
            // read file
            const data = FileEditorService.getBotConfig();
            // update value here
            data[key] = value;
            // write file
            const stringData = JSON.stringify(data, null, 2);
            (0, fs_1.writeFileSync)(this.CONFIG_URL, stringData, 'utf8');
            console.log(`Dữ liệu JSON của ${key} đã được update.`);
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    }
    static getMyUsers() {
        try {
            const data = (0, fs_1.readFileSync)(this.TOKEN_URL, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
            return [];
        }
    }
    static getMyUserByUserId(userId) {
        if (!userId)
            return null;
        // get all token
        const allUsers = FileEditorService.getMyUsers();
        // find token by userId
        const found = allUsers.find(user => user.userId == userId);
        // return the result
        return found ? found : null;
    }
    static getMyHistories() {
        try {
            const data = (0, fs_1.readFileSync)(this.HISTORY_URL, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
            return [];
        }
    }
    static getMyHistoriesByUserIdAndGachaType(userId, gachaType) {
        if (!userId)
            return null;
        // get all history
        const allHistories = FileEditorService.getMyHistories();
        // find history by userId
        const found = allHistories.find(history => history.userId == userId && history.gachaType == gachaType);
        // return the result
        return found ? found : null;
    }
    static saveMyUser(myUser) {
        try {
            // get all token
            const allUsers = FileEditorService.getMyUsers();
            const oldUser = FileEditorService.getMyUserByUserId(myUser.userId);
            if (oldUser == null) {
                allUsers.push(myUser);
            }
            else {
                allUsers.forEach(user => {
                    if (user.userId == myUser.userId) {
                        user.username = myUser.username;
                        user.accounts = myUser.accounts;
                    }
                });
            }
            // write file
            const stringData = JSON.stringify(allUsers, null, 2);
            (0, fs_1.writeFileSync)(this.TOKEN_URL, stringData, 'utf8');
            return message_1.MSG.status.OK;
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
            return message_1.MSG.status.NG;
        }
    }
    static saveMyHistory(myHistory) {
        try {
            // get all history
            const allHistories = FileEditorService.getMyHistories();
            const oldHistory = FileEditorService.getMyHistoriesByUserIdAndGachaType(myHistory.userId, myHistory.gachaType);
            if (oldHistory == null) {
                allHistories.push(myHistory);
            }
            else {
                allHistories.forEach(history => {
                    if (history.userId == myHistory.userId) {
                        if (myHistory.history.length) {
                            // tìm xem có cái nào trùng ID trong DB hay không
                            const isExistData = history.history.filter(inDB => myHistory.history.some(current => inDB.id === current.id));
                            // nếu đã có data thì
                            if (isExistData.length) {
                                const idListInDB = history.history.map(data => data.id);
                                myHistory.history.forEach(data => {
                                    // khi nào id chưa có trong DB + id hiện tại > max(id trong DB)
                                    if (idListInDB.includes(data.id) == false && data.id > idListInDB[0]) {
                                        history.history.push(data);
                                    }
                                });
                                // sort by id (DESC)
                                myHistory.history.sort((a, b) => b.id - a.id);
                            }
                        }
                    }
                });
            }
            // write file
            const stringData = JSON.stringify(allHistories, null, 2);
            (0, fs_1.writeFileSync)(this.HISTORY_URL, stringData, 'utf8');
            return message_1.MSG.status.OK;
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
            return message_1.MSG.status.NG;
        }
    }
}
exports.FileEditorService = FileEditorService;
