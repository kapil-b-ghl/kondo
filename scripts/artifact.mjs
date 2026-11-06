// Turns dist-artifact/index.html into an artifact page body (the host adds doctype/head/body).
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('dist-artifact/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/g, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const extra = '<style>:root{color-scheme:light}body{background:#f9fafb;color:#101828}</style>';
writeFileSync('dist-artifact/highrise-lab.html', `${head.trim()}\n${extra}\n${body.trim()}\n`);
console.log('dist-artifact/highrise-lab.html', Math.round(readFileSync('dist-artifact/highrise-lab.html').length / 1024) + ' KB');
