


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
const SILENCE = false;
export function _render_shout_(component, message='...', shout=true) {
    if (SILENCE || !shout) return;
    console.log(`-*-[${component}] (${message})`);
}