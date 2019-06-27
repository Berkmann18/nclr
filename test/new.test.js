
require('./test-chalk').inject();
const {info} = require('../');
const chalk = require('chalk');
const stdout = require('test-console').stdout;

// const theme = nclr.getTheme();
const text = 'Hello';

console.log(chalk.red.bold('rb hello'));
console.log(chalk.inverse('i hello'));
console.log(chalk.bold.bgBlue.rgb(255, 2, 3)('hello'));
console.log('NCLR');
info('Info');

test('info', () => {
  // const output = stdout.inspectSync(() => process.stdout.write(theme.info(text)));
  console.log('info=');
  info('info');
  // console.log('theme=', theme.info('HI'));
  // expect(output).toStrictEqual([`<blueBright>${text}</blueBright>`]);
  const res = stdout.inspectSync(() => info(text));
  expect(res).toStrictEqual([`<blueBright>${text}</blueBright>\n`]);
  // expect(info(text)).toBeTruthy();
});
