"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoyolabService = void 0;
const message_1 = require("../../assets/constants/message");
const api_1 = require("../daily/api");
const file_editor_service_1 = require("./file-editor.service");
class HoyolabService {
    static delayAPIValue = 0; // 0s
    static CHARACTER_EVENT = 'Bước Nhảy Sự Kiện Nhân Vật.';
    static CHARACTER_STANDARD = 'Bước Nhảy Chòm Sao (Banner thường).';
    static CHARACTER_BEGINER = 'Bước Nhảy Đầu Tiên (Banner tân thủ).';
    static LIGHT_CONE = 'Bước Nhảy Sự Kiện Nón Ánh Sáng.';
    static async infoByInteraction(interaction) {
        const myUser = file_editor_service_1.FileEditorService.getMyUserByUserId(interaction.user.id);
        let finalMsg = '```';
        let index = 0;
        if (myUser) {
            for (const account of myUser.accounts) {
                finalMsg += `\nTài khoản #${++index}:\n`;
                const gameInfos = await api_1.DailyAPI.getInfoByToken(account);
                if (!gameInfos.length) {
                    finalMsg += 'Chủ nhân vui lòng kiểm tra lại TOKEN ~\n';
                }
                for (const gameInfo of gameInfos) {
                    if (gameInfo.game_id == 1) {
                        finalMsg += `Honkai Impact 3:  [id: ${gameInfo.game_role_id}, nickname: ${gameInfo.nickname}, level: ${gameInfo.level}]\n`;
                    }
                    if (gameInfo.game_id == 2) {
                        finalMsg += `Genshin Impact:   [id: ${gameInfo.game_role_id}, nickname: ${gameInfo.nickname},level: ${gameInfo.level}]\n`;
                    }
                    if (gameInfo.game_id == 6) {
                        finalMsg += `Honkai Star Rail: [id: ${gameInfo.game_role_id}, nickname: ${gameInfo.nickname}, level: ${gameInfo.level}]\n`;
                    }
                }
            }
        }
        finalMsg += '```';
        // no account found
        if (finalMsg.length == 6) {
            finalMsg = message_1.MSG.frontEnd.info.noAccountFound;
        }
        return finalMsg;
    }
    static async setTokenByInteraction(interaction) {
        const V2_HY = '_hy';
        const V2_V2 = 'v2_';
        let myUser = file_editor_service_1.FileEditorService.getMyUserByUserId(interaction.user.id);
        if (!myUser) {
            myUser = {
                userId: interaction.user.id,
                username: interaction.user.globalName ?? '',
                accounts: []
            };
        }
        switch (interaction.options.data[0].name) {
            case 'token':
                // tìm kiếm dựa theo "name" đã định nghĩa trong danh sách ApplicationCommandData
                const account_id = interaction.options.get('account_id')?.value;
                const cookie_token = interaction.options.get('cookie_token')?.value;
                if (!account_id || !cookie_token) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                if (account_id.length == 0 || cookie_token.length == 0) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                if (isNaN(Number(account_id))) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                const newItem = {};
                newItem.account_id = account_id;
                newItem.cookie_token = cookie_token;
                // test token by API
                const resultNewItem = await api_1.DailyAPI.getInfoByToken(newItem);
                if (resultNewItem.length == 0) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                // replace old account info
                const finalAccounts = [];
                for (const account of myUser.accounts) {
                    if ((account.account_id ?? account.account_id_v2) == newItem.account_id) {
                        finalAccounts.push(newItem);
                    }
                    else {
                        finalAccounts.push(account);
                    }
                }
                // add new account if not exist
                const isExist = finalAccounts.some((account) => (account.account_id ?? account.account_id_v2) == newItem.account_id);
                if (!isExist) {
                    finalAccounts.push(newItem);
                }
                myUser.accounts = finalAccounts;
                break;
            case 'token_v2':
                // tìm kiếm dựa theo "name" đã định nghĩa trong danh sách ApplicationCommandData
                const account_id_v2 = interaction.options.get('account_id_v2')?.value;
                const account_mid_v2 = interaction.options.get('account_mid_v2')?.value;
                const cookie_token_v2 = interaction.options.get('cookie_token_v2')?.value;
                if (!account_id_v2 || !account_mid_v2 || !cookie_token_v2) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                if (account_id_v2.length == 0 || account_mid_v2.length == 0 || cookie_token_v2.length == 0) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                if (isNaN(Number(account_id_v2))) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                if (account_mid_v2.endsWith(V2_HY) == false) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                if (cookie_token_v2.startsWith(V2_V2) == false) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                const newItemV2 = {};
                newItemV2.account_id_v2 = account_id_v2;
                newItemV2.account_mid_v2 = account_mid_v2;
                newItemV2.cookie_token_v2 = cookie_token_v2;
                // test token by API
                const resultNewItemV2 = await api_1.DailyAPI.getInfoByToken(newItemV2);
                if (resultNewItemV2.length == 0) {
                    return message_1.MSG.frontEnd.error.invalidToken;
                }
                const finalAccountsV2 = [];
                // replace old account info
                for (const account of myUser.accounts) {
                    if ((account.account_id ?? account.account_id_v2) == newItemV2.account_id_v2) {
                        finalAccountsV2.push(newItemV2);
                    }
                    else {
                        finalAccountsV2.push(account);
                    }
                }
                // add new account if not exist
                const isExistV2 = finalAccountsV2.some((account) => (account.account_id ?? account.account_id_v2) == newItem.account_id);
                if (!isExistV2) {
                    finalAccountsV2.push(newItemV2);
                }
                myUser.accounts = finalAccountsV2;
                break;
        }
        return file_editor_service_1.FileEditorService.saveMyUser(myUser);
    }
    static async getHistory(interaction, gachaType) {
        if (interaction.options.data[0].name) {
            // tìm kiếm dựa theo "name" đã định nghĩa trong danh sách ApplicationCommandData
            let url = interaction.options.get('url')?.value;
            let get4Star = interaction.options.get('get_4_star')?.value;
            // 11: character-event
            // 12: light-cone
            url = url + `&size=20&gacha_type=${gachaType}`;
            const allItemList = [];
            if (await api_1.DailyAPI.testGetHistory(url) == 'authkey timeout') {
                return message_1.MSG.frontEnd.error.invalidURL;
            }
            let itemList = await api_1.DailyAPI.getHistory(url);
            let idListInDB = [];
            let historyInDB = null;
            // get data in DB
            if (itemList.length) {
                historyInDB = file_editor_service_1.FileEditorService.getMyHistoriesByUserIdAndGachaType(itemList[0].uid, gachaType);
                if (historyInDB) {
                    historyInDB.history.forEach(item => allItemList.push(item));
                    idListInDB = historyInDB.history.map(data => data.id);
                }
            }
            while (itemList.length) {
                // merge with data in DB
                if (historyInDB != null) {
                    itemList.forEach(data => {
                        // khi nào id chưa có trong DB + id hiện tại > max(id trong DB)
                        if (idListInDB.includes(data.id) == false && data.id > idListInDB[0]) {
                            allItemList.push(data);
                        }
                    });
                }
                else {
                    itemList.forEach(item => allItemList.push(item));
                }
                // sort by id (DESC)
                allItemList.sort((a, b) => b.id - a.id);
                const end_id = itemList[itemList.length - 1].id;
                const newUrl = url + `&end_id=${end_id}`;
                itemList = [];
                itemList = await api_1.DailyAPI.getHistory(newUrl);
                // delay
                await this.delay(this.delayAPIValue);
            }
            // xuất ra tên các item
            let finalMsg = '```';
            if (allItemList.length) {
                finalMsg += `===> [Lịch sử bước nhảy gần đây] <===\n\n`;
                // finalMsg += `Tổng số bước nhảy: ${allItemList.length}\n`;
                const latest5Star = allItemList.find(item => item.rank_type == 5);
                if (latest5Star) {
                    finalMsg += `Số bước nhảy hiện tại (5 sao): ${allItemList.indexOf(latest5Star)}/${gachaType == 12 ? '80' : (gachaType == 2 ? '50' : '90')}\n`;
                }
                const latest4Star = allItemList.find(item => item.rank_type == 4);
                if (latest4Star) {
                    finalMsg += `Số bước nhảy hiện tại (4 sao): ${allItemList.indexOf(latest4Star)}/10\n`;
                }
                finalMsg += '\n';
                for (const item of allItemList) {
                    // hiển thị dữ liệu 5 sao
                    if (item.rank_type == 5) {
                        const subLatest5Star = allItemList.find(sub => sub.rank_type == 5 && sub.id < item.id);
                        if (subLatest5Star) {
                            finalMsg += `[Ngày]: ${item.time} - [Bước nhảy]: ${(allItemList.indexOf(subLatest5Star) - allItemList.indexOf(item)).toString().padStart(2, '0')}/${gachaType == 12 ? '80' : (gachaType == 2 ? '50' : '90')} - [${item.item_type}]: ${item.name}\n`;
                        }
                        else {
                            finalMsg += `[Ngày]: ${item.time} - [Bước nhảy]: ${(allItemList.length - allItemList.indexOf(item)).toString().padStart(2, '0')}/${gachaType == 12 ? '80' : (gachaType == 2 ? '50' : '90')} - [${item.item_type}]: ${item.name}\n`;
                        }
                    }
                    // hiển thị dữ liệu 4 sao
                    if (item.rank_type == 4 && get4Star == true) {
                        const subLatest4Star = allItemList.find(sub => sub.rank_type == 4 && sub.id < item.id);
                        if (subLatest4Star) {
                            finalMsg += `[Ngày]: ${item.time} - [Bước nhảy]: ${(allItemList.indexOf(subLatest4Star) - allItemList.indexOf(item)).toString().padStart(2, '0')}/10 - [${item.item_type}]: ${item.name}\n`;
                        }
                        else {
                            finalMsg += `[Ngày]: ${item.time} - [Bước nhảy]: ${(allItemList.length - allItemList.indexOf(item)).toString().padStart(2, '0')}/10 - [${item.item_type}]: ${item.name}\n`;
                        }
                    }
                }
                finalMsg += `\nLưu ý: dòng cuối có thể sai do thiếu dữ liệu ~\n\n`;
                finalMsg += `===> [Lịch sử bước nhảy gần đây] <===\n`;
            }
            finalMsg += '```';
            if (finalMsg.length == 6) {
                finalMsg = message_1.MSG.frontEnd.info.noHistoryFound;
            }
            // save data to DB
            if (allItemList.length && allItemList.length != historyInDB?.history.length) {
                const myHistory = {};
                myHistory.gachaType = gachaType;
                myHistory.history = allItemList;
                myHistory.userId = allItemList[0].uid;
                myHistory.gachaTypeName = this.getGachaName(gachaType);
                file_editor_service_1.FileEditorService.saveMyHistory(myHistory);
            }
            return finalMsg;
        }
        else {
            return message_1.MSG.frontEnd.info.noHistoryFound;
        }
    }
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static getGachaName(gachaType) {
        if (gachaType == 1) {
            return this.CHARACTER_STANDARD;
        }
        if (gachaType == 2) {
            return this.CHARACTER_BEGINER;
        }
        if (gachaType == 11) {
            return this.CHARACTER_EVENT;
        }
        if (gachaType == 12) {
            return this.LIGHT_CONE;
        }
    }
}
exports.HoyolabService = HoyolabService;
