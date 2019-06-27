const chalk = require('chalk');
const {log, use, isValidName, getTheme, theme, updateTheme, arrToFxChain} = require('./src/lib');

console.log('level=', chalk.level, 'enabled=', chalk.enabled, 'TERM=', process.env.TERM);
// chalk.enabled = true;
// chalk.level = 3;

/**
 * @fileoverview Set of functions for coloured logs.
 * @module
 */

/**
 * @description Print an error.
 * @param {...*} data Data to print
 * @example error('Something wrong happened with', new Error(this));
 * @see log
 * @returns {boolean} Did it happened?
 */
const error = (...data) => log(theme.error(data.join(' ')) + '\n');

/**
 * @description Print an information.
 * @param {...*} data Data to print
 * @example info('Welcome John');
 * @see log
 * @returns {boolean} Did it happened?
 */
const info = (...data) => log(theme.info(data.join(' ')) + '\n');

/**
 * @description Print a debug message.
 * @param {...*} data Data to print
 * @example dbg('i=', i);
 * @see log
 * @returns {boolean} Did it happened?
 */
const dbg = (...data) => log(theme.dbg(data.join(' ')) + '\n');

/**
 * @description Print an output.
 * @param {...*} data Data to print
 * @example out(`1 + 1 = ${rpc('1 1 +')}`);
 * @see log
 * @returns {boolean} Did it happened?
 */
const out = (...data) => log(theme.out(data.join(' ')) + '\n');

/**
 * @description Print an input.
 * @param {...*} data Data to print
 * @example inp(name);
 * @see log
 * @returns {boolean} Did it happened?
 */
const inp = (...data) => log(theme.inp(data.join(' ')) + '\n');

/**
 * @description Print a warning.
 * @param {...*} data Data to print
 * @example warn('The following function is deprecated');
 * @see log
 * @returns {boolean} Did it happened?
 */
const warn = (...data) => log(theme.warn(data.join(' ')) + '\n');

/**
 * @description Print a question.
 * @param {...*} data Data to print
 * @example quest('What is your username?');
 * @see log
 * @returns {boolean} Did it happened?
 */
const quest = (...data) => log(theme.quest(data.join(' ')) + '\n');

/**
 * @description Print a success.
 * @param {...*} data Data to print
 * @example succ('Achievement unlocked');
 * @see log
 * @returns {boolean} Did it happened?
 */
const succ = (...data) => log(theme.succ(data.join(' ')) + '\n');

/**
 * @description Extend the current theme.
 * @param {{string: (string|string[])}} extension Theme to add
 * @example <caption>Using extensions as methods:</caption>
 * const nclr = require('nclr');
 * nclr.extend({
 *   suc: ['green', 'underline'],
 *   data: 'magenta'
 * });
 * nclr.suc('Yay!');
 * nclr.data(42);
 * @example <caption>Using extensions as functions:</caption>
 * const nclr = require('nclr');
 * nclr.extend({
 *   suc: ['green', 'underline'],
 *   data: 'magenta'
 * });
 * const { suc, data } = nclr;
 * suc('Yay!');
 * data(42);
 * @throws {Error} Invalid extension key
 */
const extend = extension => {
  for (let key in extension) {
    if (!isValidName(key)) throw new Error(`Invalid extension key "${key}"`);
    let clr = extension[key];
    if (Array.isArray(clr)) theme[key] = arrToFxChain(clr);
    else {
      theme[key] = clr in chalk ? chalk[clr] : chalk.keyword(clr);
    }
    module.exports[key] = (...data) => log(theme[key](data.join(' ')) + '\n');
  }
  updateTheme();
};

module.exports = {error, info, dbg, out, inp, warn, quest, succ, log, extend, use, getTheme};
