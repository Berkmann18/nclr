const chalk = require('chalk');

/**
 * @description Style theme for the functions.
 * @type {{inp: function, out: function, info: function, error: function, warn: function, dbg: function, quest: function}}
 * @private
 */
const theme = {
  inp: chalk.white,
  out: chalk.cyan.bold,
  info: chalk.green,
  error: chalk.red,
  warn: chalk.keyword('orange'),
  dbg: chalk.gray,
  quest: chalk.blue
};
let THEME = Object.keys(theme);

// console.log('level=', chalk.level, 'enabled=', chalk.enabled);
if (!chalk.enabled) chalk.enabled = true;

/**
 * @fileoverview Set of functions for coloured logs.
 * @module
 */

/**
 * @description STDOUT log.
 * @param {*} data Data to print
 * @example log('Lorem ipsum dolore sit amet');
 * @returns {boolean} Did it happened?
 */
const log = (...data) => process.stdout.write(...data);

let THEME = Object.keys(theme);

/**
 * @description Get the theme.
 * @returns {{inp: function, out: function, info: function, error: function, warn: function, dbg: function, quest: function}} Theme
 */
const getTheme = () => theme;

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
  if (THEME.includes(name)) return theme[name](data.join(' '));
  else throw new Error(`The name ${name} isn't specified in the theme used`);
};

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
 * @description Chain strings of an array as a function chain.
 * @param {string[]} arr Array of function names
 * @returns {function} Functional chain
 * @private
 */
const arrToFxChain = (arr) => {
  let chain = chalk;
  for (let i = 0; i < arr.length; ++i) {
    chain = (arr[i] in chalk) ? chain[arr[i]] : chain.keyword(arr[i]);
  }
  return chain;
};

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
    let clr = extension[key];
    if (Array.isArray(clr)) theme[key] = arrToFxChain(clr);
    else {
      theme[key] = (clr in chalk) ? chalk[clr] : chalk.keyword(clr);
    }
    module.exports[key] = (...data) => log(theme[key](data.join(' ')) + '\n');
  }
  THEME = Object.keys(theme);
};

module.exports = { error, info, dbg, out, inp, warn, quest, log, extend, use, getTheme }