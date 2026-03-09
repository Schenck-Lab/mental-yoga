
export const APP_STAGE = Object.freeze({
    LOGIN: "LOGIN",
    INTRO: "INTRO",
    GAME: "GAME",
    UPLOAD: "UPLOAD",
});

export const LEVEL_TIME_LIMIT_SEC = [ 300, 300, 300, 300, 300, 300 ];


export const CSV_HEADER = Object.freeze(
    Object.fromEntries([
        'EPOCH_TIME', 'CENTRAL_TIME', 'LEVEL', 'QUESTION', 'Q_STAGE', 'CLICK_OBJECT', 'ANSWER' 
    ].map(colName => [colName, colName]))
);


