import nclr from '../index';
import clr from 'colors/safe';
import theme from '../src/theme';
import requirePkg from '../src/require';

const stdout = requirePkg('test-console').stdout;
const { info, log, extend, use, restore } = nclr;
clr.setTheme(theme);

const text = 'Hello',
  END = '\u001b[39m',
  OUT_END = '\u001b[39m\u001b[22m',
  START = {
    info: '\u001b[36m',
    dbg: '\u001b[90m',
    out: '\u001b[1m\u001b[36m',
    inp: '\u001b[37m',
    warn: '\u001b[33m',
    quest: '\u001b[34m',
    error: '\u001b[31m',
    succ: '\u001b[32m'
  },
  FXS = Object.keys(START);

const testFx = (fx, data = text) => {
  const output = stdout.inspectSync(() => process.stdout.write(clr[fx](data)));
  const end = (fx === 'out') ? OUT_END : END;
  const expected = `${START[fx]}${data}${end}`;
  expect(output).toStrictEqual([expected]);

  const res = stdout.inspectSync(() => eval(`${fx}(data)`));
  expect(res).toStrictEqual([`${expected}\n`]);
  expect(eval(`${fx}(data)`)).toBeTruthy();
};

test('generic', () => FXS.forEach(fx => testFx(fx)));

test('log', () => {
  const output = stdout.inspectSync(() => log(text));
  expect(output).toStrictEqual([text]);
});

test('initial theme', () => {
  expect(theme.inp).toStrictEqual('white');
  expect(theme.out).toEqual(['cyan', 'bold']);
  expect(theme.info).toStrictEqual('cyan');
  expect(theme.error).toStrictEqual('red');
  expect(theme.warn).toStrictEqual('yellow');
  expect(theme.dbg).toStrictEqual('grey');
  expect(theme.quest).toStrictEqual('blue');
  expect(theme.succ).toStrictEqual('green');
})

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
  expect(ext).toThrowError('Invalid extension key "undefined"');
});

const testUse = (text, result) => {
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
};

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
  const name = 'spec';
  failedUse({
    errMsg: `The name ${name} isn't specified in the theme used`,
    name,
    text
  });
});

test('use failed 2/2', () => {
  const name = () => null;
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
  let result = `${START.info}${text} ${START.error}Error${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('error', 'Error')));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(use)', () => {
  let result = `${START.info}${text} ${START.warn}My ${START.error}dear${START.warn}${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', 'My', use('error', 'dear'))));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(`${use}`)', () => {
  let result = `${START.info}${text} ${START.warn}My${START.error}Dear${START.warn}${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', `My${use('error', 'Dear')}`)));
  expect(output).toStrictEqual([`${result}\n`]);
});

const overrideWithExtend = (fx, initial, overriden) => {
  expect(nclr[fx]).not.toBe(fx);
  expect(fx in clr).toBeTruthy();
  const outInfo = stdout.inspectSync(() => process.stdout.write(clr[fx](text)));
  expect(outInfo).not.toStrictEqual([initial]);
  expect(outInfo).toStrictEqual([overriden]);

  const resOut = stdout.inspectSync(() => eval(`${fx}(text)`));
  expect(resOut).toStrictEqual([`${overriden}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr[fx](text));
  expect(resIn).toStrictEqual([`${overriden}\n`]); //Override on the module's scope
  expect(nclr[fx](text)).toBeTruthy();
};

test('Simple overriding with extend()...', () => {
  expect('info' in clr).toBeTruthy();
  extend({
    info: 'magenta'
  });
  overrideWithExtend('info', `${START.succ}${text}${END}`, `\u001b[35m${text}${END}`);
});

test('Overriding with extend()', () => {
  expect('warn' in clr).toBeTruthy();
  extend({
    warn: ['yellow', 'underline']
  });
  overrideWithExtend('warn', `${START.warn}${text}${END}`, `\u001b[4m${START.warn}${text}${END}\u001b[24m`);
});

test('Extend and use', () => {
  extend({
    cust: 'red'
  });

  expect('cust' in nclr).toBeTruthy();
  const result = `${START.error}${text}${END}`;
  const res = stdout.inspectSync(() => log(use('cust', text)));
  expect(res).toStrictEqual([result]);
  expect(use('cust', text)).toStrictEqual(result);
});

test('final theme', () => {
  expect(theme.inp).toStrictEqual('white');
  expect(theme.out).toEqual(['cyan', 'bold']);
  expect(theme.info).toStrictEqual('magenta'); //cyan -> magenta
  expect(theme.error).toStrictEqual('red');
  expect(theme.warn).toEqual(['yellow', 'underline']); //yellow -> _yellow_
  expect(theme.dbg).toStrictEqual('grey');
  expect(theme.quest).toStrictEqual('blue');
  expect(theme.succ).toStrictEqual('green');
});

test('restore check: default colours', () => {
  restore();
  expect(theme.inp).toStrictEqual('white');
  expect(theme.out).toEqual(['cyan', 'bold']);
  expect(theme.info).toStrictEqual('cyan');
  expect(theme.error).toStrictEqual('red');
  expect(theme.warn).toStrictEqual('yellow');
  expect(theme.dbg).toStrictEqual('grey');
  expect(theme.quest).toStrictEqual('blue');
  expect(theme.succ).toStrictEqual('green');
});

test('restore check: functions', () => {
  restore();
  const lorem = 'Lorem';
  FXS.forEach(fx => testFx(fx, lorem));
})

test('restore check: extensions', () => {
  restore();
  const myFx = (evt) => console.log('myFx: This=', this, 'evt=', evt);
  const harmless = (evt) => console.log('harmless: This=', this, 'evt=', evt)
  expect('suc' in theme).toBeTruthy();
  expect('suc' in clr).toBeTruthy();
  ['suc', 'cust'].forEach(ext => {
    expect(ext in theme).toBeTruthy();
    expect(ext in clr).toBeTruthy();
  });

  [myFx, harmless(this)].forEach(fx => {
    expect(fx in theme).toBeFalsy();
    expect(fx in clr).toBeFalsy();
  });
});