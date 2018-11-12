const nclr = require('../index');
const { info, dbg, out, inp, warn, quest, error, succ, log, extend, use } = nclr;
const stdout = require('test-console').stdout,
  chalk = require('chalk');

const theme = nclr.getTheme();


const text = 'Hello',
  END = '\u001b[39m',
  OUT_END = '\u001b[22m\u001b[39m';

test('info', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.info(text)));
  expect(output).toStrictEqual([`\u001b[32m${text}${END}`]);
  const res = stdout.inspectSync(() => info(text));
  expect(res).toStrictEqual([`\u001b[32m${text}${END}\n`]);
  expect(info(text)).toBeTruthy();
});

test('dbg', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.dbg(text)));
  expect(output).toStrictEqual([`\u001b[90m${text}${END}`]);
  const res = stdout.inspectSync(() => dbg(text));
  expect(res).toStrictEqual([`\u001b[90m${text}${END}\n`]);
  expect(dbg(text)).toBeTruthy();
});

test('out', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.out(text)));
  expect(output).toStrictEqual([`\u001b[36m\u001b[1m${text}${OUT_END}`]);
  const res = stdout.inspectSync(() => out(text));
  expect(res).toStrictEqual([`\u001b[36m\u001b[1m${text}${OUT_END}\n`]);
  expect(out(text)).toBeTruthy();
});

test('inp', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.inp(text)));
  expect(output).toStrictEqual([`\u001b[37m${text}${END}`]);
  const res = stdout.inspectSync(() => inp(text));
  expect(res).toStrictEqual([`\u001b[37m${text}${END}\n`]);
  expect(inp(text)).toBeTruthy();
});

test('warn', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.warn(text)));
  expect(output).toStrictEqual([`\u001b[38;5;214m${text}${END}`]);
  const res = stdout.inspectSync(() => warn(text));
  expect(res).toStrictEqual([`\u001b[38;5;214m${text}${END}\n`]);
  expect(warn(text)).toBeTruthy();
});

test('quest', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.quest(text)));
  expect(output).toStrictEqual([`\u001b[34m${text}${END}`]);
  const res = stdout.inspectSync(() => quest(text));
  expect(res).toStrictEqual([`\u001b[34m${text}${END}\n`]);
  expect(quest(text)).toBeTruthy();
});

test('error', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.error(text)));
  expect(output).toStrictEqual([`\u001b[31m${text}${END}`]);
  const res = stdout.inspectSync(() => error(text));
  expect(res).toStrictEqual([`\u001b[31m${text}${END}\n`]);
  expect(error(text)).toBeTruthy();
});

test('succ', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.succ(text)));
  expect(output).toStrictEqual([`\u001b[1m\u001b[32m${text}${OUT_END}`]);
  const res = stdout.inspectSync(() => succ(text));
  expect(res).toStrictEqual([`\u001b[1m\u001b[32m${text}${OUT_END}\n`]);
  expect(succ(text)).toBeTruthy();
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

test('Illigal extend', () => {
  const myFx = () => console.log('Muhaha!');
  const ext = () => extend({
    [myFx]: 'red'
  });
  expect(ext).toThrowError(`Invalid extension key "${myFx}"`);
});

test('Dangerous extend', () => {
  const harmless = (evt) => console.log('harmless: This=', this, 'evt=', evt);
  const myFx = (evt) => console.log('myFx: This=', this, 'evt=', evt);
  const ext = () => extend({
    [harmless(this)]: 'green',
    [myFx]: 'red'
  });
  expect(ext).toThrowError(`Invalid extension key "${myFx}"`);
});

test('use', () => {
  const result = `\u001b[32m${text}${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text)));
  expect(output).toStrictEqual([result]);
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
});

test('use failed 1/2', () => {
  let result = `\u001b[32m${text}${END}`, name = 'spec';
  const output = () => stdout.inspectSync(() => process.stdout.write(use(name, text)));
  expect(output).toThrowError(`The name ${name} isn't specified in the theme used`);
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
});

test('use failed 2/2', () => {
  let result = `\u001b[32m${text}${END}`, name = () => null;
  const output = () => stdout.inspectSync(() => process.stdout.write(use(name, text)));
  expect(output).toThrowError(`Invalid name "${name}"`);
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
  let result = `\u001b[32m${text} \u001b[38;5;214mMy \u001b[31mdear\u001b[38;5;214m\u001b[32m${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', 'My', use('error', 'dear'))));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(`${use}`)', () => {
  let result = `\u001b[32m${text} \u001b[38;5;214mMy\u001b[31mDear\u001b[38;5;214m\u001b[32m${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', `My${use('error', 'Dear')}`)));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('Simple overriding with extend()... 1/2', () => {
  expect('info' in theme).toBeTruthy();
  extend({
    info: 'magenta'
  });
  expect(nclr.info).not.toBe(info);
  expect('info' in theme).toBeTruthy();
  const initialInfo = `\u001b[32m${text}${END}`,
    overridenInfo = `\u001b[35m${text}${END}`;

  const outInfo = stdout.inspectSync(() => process.stdout.write(theme.info(text)));
  expect(outInfo).not.toStrictEqual([initialInfo]);
  expect(outInfo).toStrictEqual([overridenInfo]);

  const resOut = stdout.inspectSync(() => info(text));
  expect(resOut).toStrictEqual([`${overridenInfo}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.info(text));
  expect(resIn).toStrictEqual([`${overridenInfo}\n`]); //Override on the module's scope
  expect(nclr.info(text)).toBeTruthy();
});

test('Simple overriding with extend()... 2/2', () => {
  expect('info' in theme).toBeTruthy();
  extend({
    info: 'fuchsia'
  });
  expect(nclr.info).not.toBe(info);
  expect('info' in theme).toBeTruthy();
  const initialInfo = `\u001b[32m${text}${END}`,
    overridenInfo = `\u001b[38;5;201m${text}${END}`;

  const outInfo = stdout.inspectSync(() => process.stdout.write(theme.info(text)));
  expect(outInfo).not.toStrictEqual([initialInfo]);
  expect(outInfo).toStrictEqual([overridenInfo]);

  const resOut = stdout.inspectSync(() => info(text));
  expect(resOut).toStrictEqual([`${overridenInfo}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.info(text));
  expect(resIn).toStrictEqual([`${overridenInfo}\n`]); //Override on the module's scope
  expect(nclr.info(text)).toBeTruthy();
});

test('Overriding with extend()', () => {
  expect('warn' in theme).toBeTruthy();
  extend({
    warn: ['orange', 'underline']
  });
  expect(nclr.warn).not.toBe(warn); //Overriden but becomes an anonymous function
  expect('warn' in theme).toBeTruthy();
  const initialWarn = `\u001b[38;5;214m${text}${END}`,
    overrideWarn = `\u001b[38;5;214m\u001b[4m${text}\u001b[24m${END}`;

  const outWarn = stdout.inspectSync(() => process.stdout.write(theme.warn(text)));
  expect(outWarn).not.toStrictEqual([initialWarn]);
  expect(outWarn).toStrictEqual([overrideWarn]);

  const resOut = stdout.inspectSync(() => warn(text));
  expect(resOut).toStrictEqual([`${overrideWarn}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.warn(text));
  expect(resIn).toStrictEqual([`${overrideWarn}\n`]); //Override on the module's scope
  expect(nclr.warn(text)).toBeTruthy();
});

test('Extend and use', () => {
  extend({
    cust: 'red'
  });
  expect('cust' in nclr).toBeTruthy();
  const result = `\u001b[31m${text}${END}`;
  const res = stdout.inspectSync(() => log(use('cust', text)));
  expect(res).toStrictEqual([result]);
  expect(use('cust', text)).toStrictEqual(result);
});
test('Extend and use', () => {
  extend({
    cust: 'red'
  });

  expect('cust' in nclr).toBeTruthy();
  const result = `\u001b[31m${text}${END}`;
  const res = stdout.inspectSync(() => log(use('cust', text)));
  expect(res).toStrictEqual([result]);
  expect(use('cust', text)).toStrictEqual(result);
});