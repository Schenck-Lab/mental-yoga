
// timing helpers
// Return epoch time in milliseconds
export function getEpochMS() {
    return Date.now();
}

// Convert epoch to Dallas local time string
export function toTimeCT(ts) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false
    }).format(ts);
}

export function toDateCT(ts) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false
    }).format(ts);
}

export function diffSeconds(tsStart, tsEnd) {
    if (!Number.isFinite(tsStart) || !Number.isFinite(tsEnd)) {
        throw new Error(
            `diffSeconds invalid timestamp: tsStart=${tsStart}, tsEnd=${tsEnd}`
        );
    }

    const diff = tsEnd - tsStart;

    if (diff < 0) {
        throw new Error(
            `diffSeconds negative time difference: tsStart=${tsStart}, tsEnd=${tsEnd}`
        );
    }

    return diff / 1000;
}



export function parseQcode(qcode) {
    return {
        isIntro: (qcode === 0),
        qid: Math.floor((qcode + 1) / 2),
        isSolving: ((qcode & 1) === 1),
    };
}

export function capitalize (str = '') {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
}

/* prevent ArrowKeyDefault on Radio inputs */
const ARROW_KEYS = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
];

export function preventArrowKeyDefault(e) {
    if (ARROW_KEYS.includes(e.key)) {
        e.preventDefault();
    }
}


// debug
const SILENCE = true;
export function _render_shout_(component, message='...', shout=true) {
    if (SILENCE || !shout) return;
    console.log(`-*-[${component}] (${message})`);
}