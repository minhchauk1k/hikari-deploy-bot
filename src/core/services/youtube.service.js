"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = exports.YOUTUBE_TYPE = void 0;
const tslib_1 = require("tslib");
const play_dl_1 = tslib_1.__importDefault(require("play-dl"));
var YOUTUBE_TYPE;
(function (YOUTUBE_TYPE) {
    YOUTUBE_TYPE["VIDEO"] = "video";
    YOUTUBE_TYPE["PLAYLIST"] = "playlist";
    YOUTUBE_TYPE["SEARCH"] = "search";
})(YOUTUBE_TYPE || (exports.YOUTUBE_TYPE = YOUTUBE_TYPE = {}));
class YoutubeService {
    static async createStream(input) {
        let finalResult;
        if (input.startsWith('https')) {
            finalResult = await this.searchByURL(input);
            if (!finalResult)
                finalResult = this.searchByInput(input);
        }
        else {
            finalResult = await this.searchByInput(input);
        }
        return finalResult;
    }
    static async searchByURL(url) {
        let result;
        console.log('URL: ', url);
        switch (play_dl_1.default.yt_validate(url)) {
            case YOUTUBE_TYPE.VIDEO:
                result = await play_dl_1.default.stream(url, { quality: 2 });
                console.log('Bài hát: ', (await play_dl_1.default.video_basic_info(url)).video_details.title);
                break;
            case YOUTUBE_TYPE.PLAYLIST:
                result = await play_dl_1.default.stream(url, { quality: 2 });
                console.log('Bài hát: ', (await play_dl_1.default.video_basic_info(url)).video_details.title);
                break;
            default:
                break;
        }
        return result;
    }
    static async searchByInput(input) {
        console.log('Tìm kiếm bài hát: ', input);
        let result;
        switch (play_dl_1.default.yt_validate(input)) {
            case YOUTUBE_TYPE.SEARCH:
                const temp = await play_dl_1.default.search(input, { source: { youtube: "video" } });
                if (temp.length == 0)
                    return;
                result = await play_dl_1.default.stream(temp[0].url, { quality: 2 });
                console.log('Kết quả bài hát: ', temp[0].title);
                break;
            default:
                break;
        }
        return result;
    }
}
exports.YoutubeService = YoutubeService;
