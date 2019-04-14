const clr = require('colors/safe'),
  fig = require('figures');
let theme = require('./src/theme'),
  { log, use, isValidName, updateTheme, restoreTheme } = require('./src/lib');

/**
 * @fileoverview Set of functions for coloured logs with symbols.
 * @module
 */

/**
 * @description Print an error.
 * @param {...*} data Data to print
 * @example error('Something wrong happened with', new Error(this));
 * @see log
 * @returns {boolean} Did it happened?
 */
const error = (...data) => log(`${clr.error(fig.cross + ' ' + data.join(' '))}\n`);

/**
 * @description Print an information.
 * @param {...*} data Data to print
 * @example info('Welcome John');
 * @see log
 * @returns {boolean} Did it happened?
 */
const info = (...data) => log(`${clr.info(fig.info + ' ' + data.join(' '))}\n`);

/**
 * @description Print a debug message.
 * @param {...*} data Data to print
 * @example dbg('i=', i);
 * @see log
 * @returns {boolean} Did it happened?
 */
const dbg = (...data) => log(clr.dbg(data.join(' ')) + '\n');

/**
 * @description Print an output.
 * @param {...*} data Data to print
 * @example out(`1 + 1 = ${rpc('1 1 +')}`);
 * @see log
 * @returns {boolean} Did it happened?
 */
const out = (...data) => log(clr.out(data.join(' ')) + '\n');

/**
 * @description Print an input.
 * @param {...*} data Data to print
 * @example inp(name);
 * @see log
 * @returns {boolean} Did it happened?
 */
const inp = (...data) => log(clr.inp(data.join(' ')) + '\n');

/**
 * @description Print a warning.
 * @param {...*} data Data to print
 * @example warn('The following function is deprecated');
 * @see log
 * @returns {boolean} Did it happened?
 */
const warn = (...data) => log(`${clr.warn(fig.warning + ' ' + data.join(' '))}\n`);

/**
 * @description Print a question.
 * @param {...*} data Data to print
 * @example quest('What is your username?');
 * @see log
 * @returns {boolean} Did it happened?
 */
const quest = (...data) => log(clr.quest(fig.questionMarkPrefix + ' ' + data.join(' ')) + '\n');

/**
 * @description Print a success.
 * @param {...*} data Data to print
 * @example succ('Achievement unlocked');
 * @see log
 * @returns {boolean} Did it happened?
 */
const succ = (...data) => log(clr.succ(fig.tick + ' ' + data.join(' ')) + '\n');

/**
 * @description Extend the current theme.
 * @param {{string: (string|string[])}} extension Theme to add
 * @example <caption>Using extensions as methods:</caption>
 * const nclr = require('nclr');
 * nclr.extend({
 *   suc: {
 *     styles: ['green', 'underline'],
 *     symbol: 'check'
 *   }
 *   data: {
 *     styles: 'magenta',
 *     symbol: 'pointer',
 *   }
 * });
 * nclr.suc('Yay!');
 * nclr.data(42);
 * @example <caption>Using extensions as functions:</caption>
 * const nclr = require('nclr');
 * nclr.extend({
 *   suc: {
 *    styles: ['green', 'underline'],
 *    symbol: 'check'
 *  }
 *   data: {
 *    styles: 'magenta',
 *    symbol: 'pointer'
 * });
 * const { suc, data } = nclr;
 * suc('Yay!');
 * data(42);
 * @throws {Error} Invalid extension key
 * @throws {Error} No <code>styles</code> or <code>symbol</code> property found
 */
const extend = (extension) => {
  for (let key in extension) {
    if (!isValidName(key)) throw new Error(`Invalid extension key "${key}"`);
    if (extension[key].styles === undefined || extension[key].symbol === undefined) throw new Error(`No 'styles' or 'symbol' property found for "${key}"`);
    theme[key] = extension[key].styles;

    module.exports[key] = (...data) => log(clr[key](fig[extension[key].symbol] + ' ' + data.join(' ')) + '\n');
  }
  updateTheme();
};

module.exports = { error, info, dbg, out, inp, warn, quest, succ, log, extend, use, restore: restoreTheme }