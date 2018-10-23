const { info, dbg, out, inp, warn, quest, error, log } = require('../index');
const stdout = require('test-console').stdout;

const clr = require('colors/safe');
clr.setTheme(require('../src/scheme'));

const END = '\u001b[39m', OUT_END = '\u001b[39m\u001b[22m';

test('info', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.inf(text)));
  expect(output).toStrictEqual([`\u001b[32m${text}${END}`]);
  const res = stdout.inspectSync(() => info(text));
  expect(res).toStrictEqual([`\u001b[32m${text}${END}\n`]);
  expect(info(text)).not.toBeUndefined();
});

test('dbg', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.debug(text)));
  expect(output).toStrictEqual([`\u001b[90m${text}${END}`]);
  const res = stdout.inspectSync(() => dbg(text));
  expect(res).toStrictEqual([`\u001b[90m${text}${END}\n`]);
  expect(dbg(text)).not.toBeUndefined();
});

test('out', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.out(text)));
  expect(output).toStrictEqual([`\u001b[1m\u001b[36m${text}${OUT_END}`]);
  const res = stdout.inspectSync(() => out(text));
  expect(res).toStrictEqual([`\u001b[1m\u001b[36m${text}${OUT_END}\n`]);
  expect(out(text)).not.toBeUndefined();
});

test('inp', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.in(text)));
  expect(output).toStrictEqual([`\u001b[37m${text}${END}`]);
  const res = stdout.inspectSync(() => inp(text));
  expect(res).toStrictEqual([`\u001b[37m${text}${END}\n`]);
  expect(inp(text)).not.toBeUndefined();
});

test('warn', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.warn(text)));
  expect(output).toStrictEqual([`\u001b[33m${text}${END}`]);
  const res = stdout.inspectSync(() => warn(text));
  expect(res).toStrictEqual([`\u001b[33m${text}${END}\n`]);
  expect(warn(text)).not.toBeUndefined();
});

test('quest', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.quest(text)));
  expect(output).toStrictEqual([`\u001b[34m${text}${END}`]);
  const res = stdout.inspectSync(() => quest(text));
  expect(res).toStrictEqual([`\u001b[34m${text}${END}\n`]);
  expect(quest(text)).not.toBeUndefined();
});

test('error', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => process.stdout.write(clr.err(text)));
  expect(output).toStrictEqual([`\u001b[31m${text}${END}`]);
  const res = stdout.inspectSync(() => error(text));
  expect(res).toStrictEqual([`\u001b[31m${text}${END}\n`]);
  expect(error(text)).not.toBeUndefined();
});

test('log', () => {
  const text = 'Hello';
  const output = stdout.inspectSync(() => log(text));
  expect(output).toStrictEqual([text]);
});