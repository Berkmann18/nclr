/**
 * Test Chalk with human-readable colour information.
 * Source: https://github.com/Berkmann18/nclr/pull/109#issuecomment-505652869
 * @author Qix-
 */
function testChalk() {
  const chalk = require('chalk');

  function makeStyleObject(open = '', close = '') {
    const fn = (...args) => open + args.join(' ') + close;

    Object.getOwnPropertyNames(chalk.constructor.prototype).forEach(col => {
      if (col === 'constructor') return;

      const twoLevel = Boolean(!chalk[col]._styles || !chalk[col]._styles[0]);

      if (twoLevel) {
        fn[col] = (...outer) =>
          makeStyleObject(open + `<${col}(${outer.join(',')})>`, `</${col}>` + close);
      } else {
        Object.defineProperty(fn, col, {
          get: () => makeStyleObject(open + `<${col}>`, `</${col}>` + close)
        });
      }
    });

    return fn;
  }

  return makeStyleObject();
}

const instance = testChalk();
instance.instance = testChalk;
instance.module = module;

instance.inject = () => {
  require.cache[require.resolve('chalk')] = module;
};

module.exports = instance;
