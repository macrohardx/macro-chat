import * as path from 'path';

export function cacheForDuration(time: string): Object {
  let millis = toMilliseconds(time)
  return {
    "Cache-Control": `public, max-age=${millis}`,
    "Expires": new Date(Date.now() + millis).toUTCString()
  }
}

export function toMilliseconds(strA: string): number {
  var str = strA + '';
  var gegex = /^((\d+)h)?((\d+)m)?((\d+)s)?((\d+)ms)?$/gi;
  var matches = gegex.exec(str);
  if (matches && matches.length === 9) {
    var hoursInMillis = (+matches[2] || 0) * 60 * 60 * 1000;
    var minutesInMillis = (+matches[4] || 0) * 60 * 1000;
    var secondsInMillis = (+matches[6] || 0) * 1000;
    var totalMillis = hoursInMillis + minutesInMillis + secondsInMillis + (+matches[8] || 0)
    return totalMillis;
  }
  var gegex2 = /\d+/gi;
  var match = gegex2.exec(str);
  if (match) {
    return Number(match[0]);
  }
  return 0;
}

export const mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
}

export function getMimeTypeFromFilePath(filePath: string): string {
  return mime[path.extname(filePath).slice(1)] || 'text/plain'
}

export function noop() {}