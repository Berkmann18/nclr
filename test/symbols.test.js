const nclr = require('../symbols');
const { info, dbg, out, inp, warn, quest, error, succ, log, extend, use } = nclr;
const stdout = require('test-console').stdout,
  fig = require('figures');

const theme = nclr.getTheme();


const text = 'Hello',
  END = '\u001b[39m',
  OUT_END = '\u001b[22m\u001b[39m',
  START = {
    info: '\u001b[94m',
    dbg: '\u001b[90m',
    out: '\u001b[36m\u001b[1m',
    inp: '\u001b[37m',
    warn: '\u001b[38;2;255;165;0m',
    quest: '\u001b[34m',
    error: '\u001b[31m',
    succ: '\u001b[32m'
  };


test('info', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.info(text)));
  expect(output).toStrictEqual([`${START.info}${text}${END}`]);
  const res = stdout.inspectSync(() => info(text));
  expect(res).toStrictEqual([`${START.info}${fig.info} ${text}${END}\n`]);
  expect(info(text)).toBeTruthy();
});

test('dbg', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.dbg(text)));
  expect(output).toStrictEqual([`${START.dbg}${text}${END}`]);
  const res = stdout.inspectSync(() => dbg(text));
  expect(res).toStrictEqual([`${START.dbg}${text}${END}\n`]);
  expect(dbg(text)).toBeTruthy();
});

test('out', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.out(text)));
  expect(output).toStrictEqual([`${START.out}${text}${OUT_END}`]);
  const res = stdout.inspectSync(() => out(text));
  expect(res).toStrictEqual([`${START.out}${text}${OUT_END}\n`]);
  expect(out(text)).toBeTruthy();
});

test('inp', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.inp(text)));
  expect(output).toStrictEqual([`${START.inp}${text}${END}`]);
  const res = stdout.inspectSync(() => inp(text));
  expect(res).toStrictEqual([`${START.inp}${text}${END}\n`]);
  expect(inp(text)).toBeTruthy();
});

test('warn', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.warn(text)));
  expect(output).toStrictEqual([`${START.warn}${text}${END}`]);
  const res = stdout.inspectSync(() => warn(text));
  expect(res).toStrictEqual([`${START.warn}${fig.warning} ${text}${END}\n`]);
  expect(warn(text)).toBeTruthy();
});

test('quest', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.quest(text)));
  expect(output).toStrictEqual([`${START.quest}${text}${END}`]);
  const res = stdout.inspectSync(() => quest(text));
  expect(res).toStrictEqual([`${START.quest}${fig.questionMarkPrefix} ${text}${END}\n`]);
  expect(quest(text)).toBeTruthy();
});

test('error', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.error(text)));
  expect(output).toStrictEqual([`${START.error}${text}${END}`]);
  const res = stdout.inspectSync(() => error(text));
  expect(res).toStrictEqual([`${START.error}${fig.cross} ${text}${END}\n`]);
  expect(error(text)).toBeTruthy();
});

test('succ', () => {
  const output = stdout.inspectSync(() => process.stdout.write(theme.succ(text)));
  expect(output).toStrictEqual([`${START.succ}${text}${END}`]);
  const res = stdout.inspectSync(() => succ(text));
  expect(res).toStrictEqual([`${START.succ}${fig.tick} ${text}${END}\n`]);
  expect(succ(text)).toBeTruthy();
});

test('log', () => {
  const output = stdout.inspectSync(() => log(text));
  expect(output).toStrictEqual([text]);
});

test('extend', () => {
  expect(() => extend({
    suc: 'magenta'
  })).toThrowError('No \'styles\' or \'symbol\' property found for "suc"');

  extend({
    suc: {
      styles: 'magenta',
      symbol: 'tick'
    }
  })
  nclr.suc(text);
  expect('suc' in nclr).toBeTruthy();
  expect(typeof nclr.suc).toStrictEqual('function');

  const res = stdout.inspectSync(() => nclr.suc(text));
  expect(res).toStrictEqual([`\u001b[35m${fig.tick} ${text}${END}\n`]);
});

test('Illigal extend', () => {
  const myFx = () => console.log('Muhaha!');
  const ext = () => extend({
    [myFx]: {
      styles: 'red',
      symbol: 'cross'
    }
  });
  expect(ext).toThrowError(`Invalid extension key "${myFx}"`);
});

test('Dangerous extend', () => {
  const harmless = (...evt) => console.log('harmless: This=', this, 'evt=', evt);
  const myFx = (evt) => console.log('myFx: This=', this, 'evt=', evt);
  const ext = () => extend({
    [harmless(this, test)]: {
      styles: 'green',
      symbol: 'dot'
    },
    [myFx]: {
      styles: 'red',
      symbol: 'cross'
    }
  });
  expect(ext).toThrowError('Invalid extension key "undefined"');
});

const testUse = (text, result) => {
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
}

test('use', () => {
  const result = `${START.info}${text}${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text)));
  expect(output).toStrictEqual([result]);
  testUse(text, result);
});

const failedUse = ({ errMsg, name, text, result = `${START.info}${text}${END}` } = {}) => {
  const output = () => stdout.inspectSync(() => process.stdout.write(use(name, text)));
  expect(output).toThrowError(errMsg);
  testUse(text, result);
};

test('use failed 1/2', () => {
  let name = 'spec';
  failedUse({
    errMsg: `The name ${name} isn't specified in the theme used`,
    name,
    text
  });
});

test('use failed 2/2', () => {
  let name = () => null;
  failedUse({
    errMsg: `Invalid name "${name}"`,
    name,
    text
  });
});

test('nested use()', () => {
  let result = `${START.info}${text} ${START.error}Error${START.info}${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text, use('error', 'Error'))));
  expect(output).toStrictEqual([result]);
});

test('info and use', () => {
  let result = `${START.info}${fig.info} ${text} ${START.error}Error${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('error', 'Error')));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(use)', () => {
  let result = `${START.info}${fig.info} ${text} ${START.warn}My ${START.error}dear${START.warn}${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', 'My', use('error', 'dear'))));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(`${use}`)', () => {
  let result = `${START.info}${fig.info} ${text} ${START.warn}My${START.error}Dear${START.warn}${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', `My${use('error', 'Dear')}`)));
  expect(output).toStrictEqual([`${result}\n`]);
});

const overrideWithExtendInfo = (initial, overriden, overridenSymbolised) => {
  expect(nclr.info).not.toBe(info);
  expect('info' in theme).toBeTruthy();
  const outInfo = stdout.inspectSync(() => process.stdout.write(theme.info(text)));
  expect(outInfo).not.toStrictEqual([initial]);
  expect(outInfo).toStrictEqual([overriden]);

  const resOut = stdout.inspectSync(() => info(text));
  expect(resOut).toStrictEqual([`${overridenSymbolised}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.info(text));
  expect(resIn).toStrictEqual([`${overridenSymbolised}\n`]); //Override on the module's scope
  expect(nclr.info(text)).toBeTruthy();
};

test('Simple overriding with extend()... 1/2', () => {
  expect('info' in theme).toBeTruthy();
  extend({
    info: {
      styles: 'magenta',
      symbol: 'info'
    }
  });

  overrideWithExtendInfo(`${START.info}${fig.info} ${text}${END}`, `\u001b[35m${text}${END}`, `\u001b[35m${fig.info} ${text}${END}`);
});

test('Simple overriding with extend()... 2/2', () => {
  extend({
    info: {
      styles: 'fuchsia',
      symbol: 'info'
    }
  });

  overrideWithExtendInfo(`${START.info}${fig.info} ${text}${END}`, `\u001b[38;5;201m${text}${END}`, `\u001b[38;5;201m${fig.info} ${text}${END}`);
});

test('Overriding with extend()', () => {
  expect('warn' in theme).toBeTruthy();
  extend({
    warn: {
      styles: ['orange', 'underline'],
      symbol: 'warning'
    }
  });
  expect(nclr.warn).not.toBe(warn); //Overriden but becomes an anonymous function
  expect('warn' in theme).toBeTruthy();
  const initialWarn = `\u001b[38;5;214m${text}${END}`,
    overrideWarn = `\u001b[38;5;214m\u001b[4m${text}\u001b[24m${END}`,
    overrideWarnSym = `\u001b[38;5;214m\u001b[4m${fig.warning} ${text}\u001b[24m${END}`;

  const outWarn = stdout.inspectSync(() => process.stdout.write(theme.warn(text)));
  expect(outWarn).not.toStrictEqual([initialWarn]);
  expect(outWarn).toStrictEqual([overrideWarn]);

  const resOut = stdout.inspectSync(() => warn(text));
  expect(resOut).toStrictEqual([`${overrideWarnSym}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.warn(text));
  expect(resIn).toStrictEqual([`${overrideWarnSym}\n`]); //Override on the module's scope
  expect(nclr.warn(text)).toBeTruthy();
});

test('Extend and use', () => {
  extend({
    cust: {
      styles: 'red',
      symbol: 'circle'
    }
  });
  expect('cust' in nclr).toBeTruthy();
  const result = `${START.error}${text}${END}`;
  const res = stdout.inspectSync(() => log(use('cust', text)));
  expect(res).toStrictEqual([result]);
  expect(use('cust', text)).toStrictEqual(`${START.error}${text}${END}`);
});