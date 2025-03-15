"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG = void 0;
exports.MSG = {
    status: {
        OK: 'OK!',
        NG: 'Not Good!',
    },
    frontEnd: {
        info: {
            saveAccountSuccess: ':white_check_mark: Thông tin của chủ nhân đã được cập nhật ~',
            noAccountFound: ':x: Không tìm thấy thông tin của chủ nhân :pleading_face: ~',
            noHistoryFound: ':x: Không tìm thấy thông tin của chủ nhân :pleading_face: ~'
        },
        music: {
            pleaseJoinVoiceChannel: ':x: Chủ nhân chưa tham gia VoiceChannel đó :pleading_face: ~',
            failToJoinVoiceChannel: ':x: Bé không thể vào VoiceChannel được :pleading_face: ~',
            leaveVoiceChannel: ':wave: Bé đã rời khỏi VoiceChannel ~',
            playingYourSong: ':notes: Bài hát của chủ nhân đang được phát :heart: ~',
            loopingYourSong: ':arrows_counterclockwise: Bài hát của chủ nhân đang được lặp lại ~',
            loopYourSong: ':white_check_mark: Đang lặp lại bài hát ~',
            unloopYourSong: ':x: Hủy lặp lại bài hát ~',
            pauseYourSong: ':pause_button: Đã tạm dừng phát nhạc ~',
            unpauseYourSong: ':arrow_forward: Tiếp tục phát nhạc ~',
        },
        error: {
            default: ':x: Xảy ra lỗi rồi chủ nhân ơi :pleading_face: ~',
            invalidToken: ':x: Token của chủ nhân đã hết hạn hoặc không hợp lệ :pleading_face: ~\n:books: Chat "`token`" để xem hướng dẫn chi tiết!',
            invalidURL: ':x: URL của chủ nhân đã hết hạn hoặc không hợp lệ :pleading_face: ~\n:books: Chat "`history`" để xem hướng dẫn chi tiết!'
        }
    },
    backEnd: {
        info: {
            stateChange: '[%s] state change from [%s] to [%s]',
            create: '[%s] đã được khởi tạo!',
        },
        music: {
            failToJoinVoiceChannel: 'Bot không thể vào VoiceChannel được ~',
        },
        error: {
            default: 'Xảy ra lỗi: %s',
            timeout: 'Lỗi Time-out!: %s',
            missingPermissions: 'Bot không có quyền: %s',
        }
    }
};
