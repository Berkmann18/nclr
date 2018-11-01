const nclr = require('../index');
const { info, dbg, out, inp, warn, quest, error, log, extend, use } = nclr;
const stdout = require('test-console').stdout;

const clr = require('colors/safe');
clr.setTheme(require('../src/theme'));

const text = 'Hello',
  END = '\u001b[39m',
  OUT_END = '\u001b[39m\u001b[22m';

test('info', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.info(text)));
  expect(output).toStrictEqual([`\u001b[32m${text}${END}`]);
  const res = stdout.inspectSync(() => info(text));
  expect(res).toStrictEqual([`\u001b[32m${text}${END}\n`]);
  expect(info(text)).toBeTruthy();
});

test('dbg', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.dbg(text)));
  expect(output).toStrictEqual([`\u001b[90m${text}${END}`]);
  const res = stdout.inspectSync(() => dbg(text));
  expect(res).toStrictEqual([`\u001b[90m${text}${END}\n`]);
  expect(dbg(text)).toBeTruthy();
});

test('out', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.out(text)));
  expect(output).toStrictEqual([`\u001b[1m\u001b[36m${text}${OUT_END}`]);
  const res = stdout.inspectSync(() => out(text));
  expect(res).toStrictEqual([`\u001b[1m\u001b[36m${text}${OUT_END}\n`]);
  expect(out(text)).toBeTruthy();
});

test('inp', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.inp(text)));
  expect(output).toStrictEqual([`\u001b[37m${text}${END}`]);
  const res = stdout.inspectSync(() => inp(text));
  expect(res).toStrictEqual([`\u001b[37m${text}${END}\n`]);
  expect(inp(text)).toBeTruthy();
});

test('warn', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.warn(text)));
  expect(output).toStrictEqual([`\u001b[33m${text}${END}`]);
  const res = stdout.inspectSync(() => warn(text));
  expect(res).toStrictEqual([`\u001b[33m${text}${END}\n`]);
  expect(warn(text)).toBeTruthy();
});

test('quest', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.quest(text)));
  expect(output).toStrictEqual([`\u001b[34m${text}${END}`]);
  const res = stdout.inspectSync(() => quest(text));
  expect(res).toStrictEqual([`\u001b[34m${text}${END}\n`]);
  expect(quest(text)).toBeTruthy();
});

test('error', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.error(text)));
  expect(output).toStrictEqual([`\u001b[31m${text}${END}`]);
  const res = stdout.inspectSync(() => error(text));
  expect(res).toStrictEqual([`\u001b[31m${text}${END}\n`]);
  expect(error(text)).toBeTruthy();
});

test('log', () => {
  const output = stdout.inspectSync(() => log(text));
  expect(output).toStrictEqual([text]);
});

test('extend', () => {
  extend({
    suc: 'magenta'
  });

  nclr.suc(text);
  expect('suc' in nclr).toBeTruthy();
  expect(typeof nclr.suc).toStrictEqual('function');

  const res = stdout.inspectSync(() => nclr.suc(text));
  expect(res).toStrictEqual([`\u001b[35m${text}${END}\n`]);
});

test('use', () => {
  let result = `\u001b[32m${text}${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text)));
  expect(output).toStrictEqual([result]);
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
});

test('nested use()', () => {
  let result = `\u001b[32m${text} \u001b[31mError\u001b[32m${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text, use('error', 'Error'))));
  expect(output).toStrictEqual([result]);
});

test('info and use', () => {
  let result = `\u001b[32m${text} \u001b[31mError\u001b[32m${END}`;
  const output = stdout.inspectSync(() => info(text, use('error', 'Error')));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(use)', () => {
  let result = `\u001b[32m${text} \u001b[33mMy \u001b[31mdear\u001b[33m\u001b[32m${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', 'My', use('error', 'dear'))));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(`${use}`)', () => {
  let result = `\u001b[32m${text} \u001b[33mMy\u001b[31mDear\u001b[33m\u001b[32m${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', `My${use('error', 'Dear')}`)));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('Simple overriding with extend()...', () => {
  expect('info' in clr).toBeTruthy();
  extend({
    info: 'magenta'
  });
  expect(nclr.info).not.toBe(info);
  expect('info' in clr).toBeTruthy();
  const initialInfo = `\u001b[32m${text}${END}`,
    overridenInfo = `\u001b[35m${text}${END}`;

  const outInfo = stdout.inspectSync(() => process.stdout.write(clr.info(text)));
  expect(outInfo).not.toStrictEqual([initialInfo]);
  expect(outInfo).toStrictEqual([overridenInfo]);

  const resOut = stdout.inspectSync(() => info(text));
  expect(resOut).toStrictEqual([`${overridenInfo}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.info(text));
  expect(resIn).toStrictEqual([`${overridenInfo}\n`]); //Override on the module's scope
  expect(nclr.info(text)).toBeTruthy();
});

test('Overriding with extend()', () => {
  expect('warn' in clr).toBeTruthy();
  extend({
    warn: ['yellow', 'underline']
  });
  expect(nclr.warn).not.toBe(warn); //Overriden but becomes an anonymous function
  expect('warn' in clr).toBeTruthy();
  const initialWarn = `\u001b[33m${text}${END}`,
    overrideWarn = `\u001b[4m\u001b[33m${text}${END}\u001b[24m`;

  const outWarn = stdout.inspectSync(() => process.stdout.write(clr.warn(text)));
  expect(outWarn).not.toStrictEqual([initialWarn]);
  expect(outWarn).toStrictEqual([overrideWarn]);

  const resOut = stdout.inspectSync(() => warn(text));
  expect(resOut).toStrictEqual([`${overrideWarn}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.warn(text));
  expect(resIn).toStrictEqual([`${overrideWarn}\n`]); //Override on the module's scope
  expect(nclr.warn(text)).toBeTruthy();
});