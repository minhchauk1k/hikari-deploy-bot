"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyAPI = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const message_1 = require("../../../assets/constants/message");
const file_editor_service_1 = require("../../services/file-editor.service");
const CONFIG = file_editor_service_1.FileEditorService.getBotConfig();
const INFO_URL = 'https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard';
const DAILY_HI3_URL = 'https://sg-public-api.hoyolab.com/event/mani/sign?act_id=e202110291205111&lang=vi-vn';
const DAILY_HSR_URL = 'https://sg-public-api.hoyolab.com/event/luna/os/sign?act_id=e202303301540311&lang=vi-vn';
const DAILY_GENSHIN_URL = 'https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481&lang=vi-vn';
const DAILY_ZZZ_URL = 'https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign?act_id=e202406031448091&lang=vi-vn';
const HI3_NAME = 'Honkai Impact 3';
const HSR_NAME = 'Honkai Star Rail';
const GENSHIN_NAME = 'Genshin Impact';
const ZZZ_NAME = 'Zenless Zone Zero';
const EXCEPT_CODE = [0, -5003, -10002];
// 0: OK
// 10001: authkey timeout
// -10002: chưa tạo nhân vật
// -5003: đã điểm danh rồi
exports.DailyAPI = {
    batchDaily: async (channel, isSkipCheck) => {
        const timeZone = { timeZone: 'Asia/Ho_Chi_Minh' };
        const startDate = new Date();
        let date = startDate.toLocaleDateString('vi-VN', timeZone) + ' ';
        let time = startDate.toLocaleTimeString('vi-VN', timeZone);
        const dailyKey = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
        // message START
        let finalMsg = '```';
        console.log('===> Auto Daily [' + date + time + '] Is Start!! <===');
        finalMsg += '===> [Start: ' + date + time + '] <===\n';
        if (exports.DailyAPI.isValidDateToRunBatch(CONFIG.TODAY_DAILY, dailyKey) == false && isSkipCheck != true) {
            // not run this function again
            console.log('Không thể chạy schedule do không thỏa điều kiện!!!');
            date = new Date().toLocaleDateString('vi-VN', timeZone) + ' ';
            time = new Date().toLocaleTimeString('vi-VN', timeZone);
            console.log('===> Auto Daily [' + date + time + '] Is Complete!! <===');
            return;
        }
        try {
            const hi3List = [];
            const hsrList = [];
            const genshinList = [];
            const zzzList = [];
            let errorValue = '';
            const myUsers = file_editor_service_1.FileEditorService.getMyUsers() ?? [];
            for (const user of myUsers) {
                let accountIndex = 1;
                const accounts = user.accounts;
                for (const account of accounts) {
                    const gameInfoList = await exports.DailyAPI.getInfoByToken(account, user);
                    if (!gameInfoList.length) {
                        errorValue += '[User: @' + user.username + `, Tài khoản #${accountIndex}] => Chủ nhân vui lòng kiểm tra lại TOKEN ~` + '\n\t';
                    }
                    for (const gameInfo of gameInfoList) {
                        const result = await exports.DailyAPI.dailyByGame(user, account, gameInfo.game_id);
                        if (result === '') {
                            if (gameInfo.game_id == 1 && gameInfo.level != 1 && gameInfo.nickname.length) {
                                hi3List.push(' ' + gameInfo.nickname);
                            }
                            if (gameInfo.game_id == 2 && gameInfo.level != 1 && gameInfo.nickname.length) {
                                genshinList.push(' ' + gameInfo.nickname);
                            }
                            if (gameInfo.game_id == 6 && gameInfo.level != 1 && gameInfo.nickname.length) {
                                hsrList.push(' ' + gameInfo.nickname);
                            }
                            if (gameInfo.game_id == 8 && gameInfo.level != 1 && gameInfo.nickname.length) {
                                zzzList.push(' ' + gameInfo.nickname);
                            }
                        }
                        else {
                            errorValue += result + '\n';
                        }
                    }
                    accountIndex++;
                }
            }
            finalMsg += '\n[Điểm danh thành công]\n';
            finalMsg += `\t[${HI3_NAME}]:   ${hi3List}\n`;
            finalMsg += `\t[${HSR_NAME}]:  ${hsrList}\n`;
            finalMsg += `\t[${GENSHIN_NAME}]:    ${genshinList}\n`;
            finalMsg += `\t[${ZZZ_NAME}]: ${zzzList}\n`;
            if (errorValue.length > 0) {
                finalMsg += '\n[Điểm danh thất bại]\n';
                finalMsg += '\t' + errorValue;
            }
            file_editor_service_1.FileEditorService.updateConfig('TODAY_DAILY', dailyKey);
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
            finalMsg += 'Xảy ra lỗi rồi chủ nhân ơi ~';
        }
        // message END
        date = new Date().toLocaleDateString('vi-VN', timeZone) + ' ';
        time = new Date().toLocaleTimeString('vi-VN', timeZone);
        console.log('===> Auto Daily [' + date + time + '] Is Complete!! <===');
        finalMsg += '\n===> [Complete: ' + date + time + '] <===```';
        channel.send(finalMsg);
    },
    dailyByGame: async (user, account, gameId) => {
        try {
            const cookie = exports.DailyAPI.createCookie(account);
            const url = exports.DailyAPI.createDailyUrl(gameId);
            const headers = {
                Cookie: cookie,
                'X-Rpc-Language': 'vi-vn',
                'Content-Type': 'application/json'
            };
            if (ZZZ_NAME == exports.DailyAPI.getGameName(gameId)) {
                headers['X-Rpc-Signgame'] = 'zzz';
            }
            const response = await (0, node_fetch_1.default)(url, {
                method: 'POST',
                headers: headers
            });
            const data = await response.json();
            let finalMsg = '';
            if (!EXCEPT_CODE.includes(data.retcode)) {
                finalMsg = 'User: ' + user.username + ` => Điểm danh ${exports.DailyAPI.getGameName(gameId)} thất bại ~\n\t`;
                finalMsg += 'Chi tiết: ' + data.message;
            }
            return finalMsg;
        }
        catch (error) {
            console.error(message_1.MSG.backEnd.error.default, error);
        }
    },
    createCookie: (account) => {
        if (account.account_id) {
            account = account;
            return `account_id=${account.account_id};cookie_token=${account.cookie_token};`;
        }
        if (account.account_id_v2) {
            account = account;
            return `account_id_v2=${account.account_id_v2};account_mid_v2=${account.account_mid_v2};cookie_token_v2=${account.cookie_token_v2};`;
        }
    },
    getGameName: (gameId) => {
        if (gameId == 1) {
            return HI3_NAME;
        }
        if (gameId == 2) {
            return GENSHIN_NAME;
        }
        if (gameId == 6) {
            return HSR_NAME;
        }
        if (gameId == 8) {
            return ZZZ_NAME;
        }
    },
    createDailyUrl: (gameId) => {
        if (gameId == 1) {
            return DAILY_HI3_URL;
        }
        if (gameId == 2) {
            return DAILY_GENSHIN_URL;
        }
        if (gameId == 6) {
            return DAILY_HSR_URL;
        }
        if (gameId == 8) {
            return DAILY_ZZZ_URL;
        }
    },
    getInfoByToken: (account, user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cookie = exports.DailyAPI.createCookie(account);
                const url = INFO_URL + `?uid=${account.account_id ?? account.account_id_v2}`;
                const headers = {
                    Cookie: cookie,
                    'X-Rpc-Language': 'vi-vn',
                    'Content-Type': 'application/json'
                };
                const response = await (0, node_fetch_1.default)(url, {
                    method: 'GET',
                    headers: headers
                });
                const data = await response.json();
                // log error info
                if (data.data == null) {
                    console.log(`API getInfoByToken: [User: @${user.username}] => ${JSON.stringify(data)} ~`);
                }
                resolve((data.data ?? []).list ?? []);
            }
            catch (error) {
                reject([]);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    },
    testGetHistory: (url) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await (0, node_fetch_1.default)(url, { method: 'GET' });
                const data = await response.json();
                console.log('Kết quả test API:', data.message ?? '');
                resolve(data.message);
            }
            catch (error) {
                reject('authkey timeout');
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    },
    getHistory: (url) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await (0, node_fetch_1.default)(url, { method: 'GET' });
                const data = await response.json();
                if (data.message != 'OK' && data.message == 'visit too frequently') {
                    resolve(await exports.DailyAPI.getHistory(url));
                }
                resolve((data.data ?? []).list ?? []);
            }
            catch (error) {
                reject([]);
                console.error(message_1.MSG.backEnd.error.default, error);
            }
        });
    },
    isValidDateToRunBatch: (oldDateString, nowDateString) => {
        console.log(message_1.MSG.backEnd.info.create, 'Old Date String: ' + oldDateString);
        console.log(message_1.MSG.backEnd.info.create, 'Now Date String: ' + nowDateString);
        // dd-mm-yyyy
        const arrOld = oldDateString.split('-');
        const arrNow = nowDateString.split('-');
        if (Number(arrOld[1]) < Number(arrNow[1])) {
            return true;
        }
        if (Number(arrOld[1]) == Number(arrNow[1]) && Number(arrOld[0]) < Number(arrNow[0])) {
            return true;
        }
        return false;
    }
};
