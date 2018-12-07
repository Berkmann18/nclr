const clr = require('colors/safe'),
  lsym = require('log-symbols');
let theme = require('./src/theme');

/**
 * @fileoverview Set of functions for coloured logs.
 * @module
 */

clr.setTheme(theme);

/**
 * @description STDOUT log.
 * @param {*} data Data to print
 * @example log('Lorem ipsum dolore sit amet');
 * @returns {boolean} Did it happened?
 */
const log = (...data) => process.stdout.write(...data);

let THEME = Object.keys(theme);

/**
 * @description Update the theme in `colors`
 * @private
 */
const updateTheme = () => {
  clr.setTheme(theme);
  THEME = Object.keys(theme);
}

/**
 * @description Check if the argument is a valid name/key.
 * @param {*} data Data to check
 * @returns {boolean} Validity
 * @private
 */
const isValidName = (data) => /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(data);

/**
 * @description Colourise something.
 * @param {string} name Name of the log in the theme
 * @param {...*} data Data
 * @return {string} Coloured output
 * @throws {Error} Invalid name
 * @example let information = use('info', 'Some info styled text');
 * @example <caption>Nesting</caption>
 * log('Something', use('warn', 'really ', use('info', 'cool!')));
 */
const use = (name, ...data) => {
  if (!isValidName(name)) throw new Error(`Invalid name "${name}"`);
  if (THEME.includes(name)) return clr[name](data.join(' '));
  else throw new Error(`The name ${name} isn't specified in the theme used`);
};

/**
 * @description Print an error.
 * @param {...*} data Data to print
 * @example error('Something wrong happened with', new Error(this));
 * @see log
 * @returns {boolean} Did it happened?
 */
const error = (...data) => log(`${lsym.error} ${clr.error(data.join(' '))}\n`);

/**
 * @description Print an information.
 * @param {...*} data Data to print
 * @example info('Welcome John');
 * @see log
 * @returns {boolean} Did it happened?
 */
const info = (...data) => log(`${lsym.info} ${clr.info(data.join(' '))}\n`);

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
const warn = (...data) => log(`${lsym.warning} ${clr.warn(data.join(' '))}\n`);

/**
 * @description Print a question.
 * @param {...*} data Data to print
 * @example quest('What is your username?');
 * @see log
 * @returns {boolean} Did it happened?
 */
const quest = (...data) => log(clr.quest(data.join(' ')) + '\n');

/**
 * @description Print a success log.
 * @param {...*} data Data to print
 * @example succ('Achievement unlocked');
 * @see log
 * @returns {boolean} Did it happened?
 */
const succ = (...data) => log(clr.succ(data.join(' ')) + '\n');

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
const extend = (extension) => {
  for (let key in extension) {
    if (!isValidName(key)) throw new Error(`Invalid extension key "${key}"`);
    theme[key] = extension[key];

    module.exports[key] = (...data) => log(clr[key](data.join(' ')) + '\n');
  }
  updateTheme();
};

module.exports = { error, info, dbg, out, inp, warn, quest, succ, log, extend, use }