'use strict';

let eS = '\u001b[39m';
let eB = '\u001b[22m';
let fS = `\u001b[`

let color = {
    green( text ) {
        return `${fS}32m${text}${eS}`;
    },
    greenBright( text ) {
        return `${fS}92m${text}${eS}`;
    },
    red( text ) {
        return `${fS}31m${text}${eS}`;
    },
    redBright( text ) {
        return `${fS}91m${text}${eS}`;
    },
    blue( text ) {
        return `${fS}34m${text}${eS}`;
    },
    blueBright( text ) {
        return `${fS}94m${text}${eS}`;
    },
    cyan( text ) {
        return `${fS}36m${text}${eS}`;
    },
    cyanBright( text ) {
        return `${fS}96m${text}${eS}`;
    },
    magenta( text ) {
        return `${fS}35m${text}${eS}`;
    },
    magentaBright( text ) {
        return `${fS}95m${text}${eS}`;
    },
    yellow( text ) {
        return `${fS}33m${text}${eS}`;
    },
    yellowBright( text ) {
        return `${fS}93m${text}${eS}`;
    },
    bold( text ) {
        return `${fS}1m${text}${eB}`;
    }
}

module.exports = color;