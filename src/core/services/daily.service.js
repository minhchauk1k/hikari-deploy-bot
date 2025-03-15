"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyService = void 0;
const node_cron_1 = require("node-cron");
const message_1 = require("../../assets/constants/message");
const api_1 = require("../daily/api");
class DailyService {
    static dailySchedule;
    static _channel;
    static options = {
        timezone: 'Asia/Ho_Chi_Minh',
        name: 'hoyolab-daily'
    };
    // private static schedulePattern = '*/50 * * * * *'; // Run every 10 seconds
    // private static schedulePattern = '0 11,23 * * *'; // Run at 11am / 11pm every day
    // private static schedulePattern = '1 11,23 * * *'; // Run at 11:01am / 11:01pm every day
    static schedulePattern = '1 0 * * *'; // Run at 00:01am every day
    // private static schedulePattern = '*/2 * * * *'; // for test run every 2 minutes
    static createSchedule(channel) {
        if (this.dailySchedule == null) {
            // create schedule
            this.dailySchedule = (0, node_cron_1.schedule)(this.schedulePattern, async () => {
                if (this._channel == null && channel != null) {
                    this._channel = channel;
                }
                await api_1.DailyAPI.batchDaily(this._channel);
                this.displayCountdown(this.patternToDate(this.schedulePattern));
            }, this.options);
            console.log(message_1.MSG.backEnd.info.create, 'Daily Schedule');
            // run on init
            if (this._channel == null && channel != null) {
                this._channel = channel;
                api_1.DailyAPI.batchDaily(this._channel);
            }
        }
        // init count down
        this.displayCountdown(this.patternToDate(this.schedulePattern));
    }
    static displayCountdown(nextTime) {
        if (this.dailySchedule != null) {
            const timeZone = { timeZone: 'Asia/Ho_Chi_Minh' };
            let date = nextTime.toLocaleDateString('vi-VN', timeZone) + ' ';
            let time = nextTime.toLocaleTimeString('vi-VN', timeZone);
            console.log('Next execution in [' + date + time + ']');
        }
    }
    static patternToDate(pattern) {
        const arr = pattern.split(' ');
        const result = new Date();
        const now = new Date();
        if (arr.length == 6) {
            // second
            const second = arr[0].split('/');
            if (second.length == 2) {
                if (second[0] == '*') {
                    result.setSeconds(result.getSeconds() + Number(second[1]));
                }
            }
            else {
                if (second[0] != '*') {
                    result.setSeconds(Number(second[0]));
                }
            }
            if (now.getTime() > result.getTime()) {
                result.setMinutes(result.getMinutes() + 1);
            }
            // minute
            const minute = arr[1].split('/');
            if (minute.length == 2) {
                if (minute[0] == '*') {
                    result.setMinutes(result.getMinutes() + Number(minute[1]));
                }
            }
            else {
                if (minute[0] != '*') {
                    result.setMinutes(Number(minute[0]));
                }
            }
            if (now.getTime() > result.getTime()) {
                result.setHours(result.getHours() + 1);
            }
            // hour
            const hour = arr[2].split('/');
            if (hour.length == 2) {
                if (hour[0] == '*') {
                    result.setHours(result.getHours() + Number(hour[1]));
                }
            }
            else {
                if (hour[0] != '*') {
                    result.setHours(Number(hour[0]));
                }
            }
            if (now.getTime() > result.getTime()) {
                result.setDate(result.getDate() + 1);
            }
        }
        else {
            // second
            result.setSeconds(0);
            // minute
            const minute = arr[0].split('/');
            if (minute.length == 2) {
                if (minute[0] == '*') {
                    result.setMinutes(result.getMinutes() + Number(minute[1]));
                }
            }
            else {
                if (minute[0] != '*') {
                    result.setMinutes(Number(minute[0]));
                }
            }
            if (now.getTime() > result.getTime()) {
                result.setHours(result.getHours() + 1);
            }
            // hour
            const hour = arr[1].split('/');
            if (hour.length == 2) {
                if (hour[0] == '*') {
                    result.setHours(result.getHours() + Number(hour[1]));
                }
            }
            else {
                if (hour[0] != '*') {
                    result.setHours(Number(hour[0]));
                }
            }
            if (now.getTime() > result.getTime()) {
                result.setDate(result.getDate() + 1);
            }
        }
        return result;
    }
}
exports.DailyService = DailyService;
