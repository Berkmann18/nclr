require('../test/test-chalk').inject();
const chalk = require('chalk');

/**
 * @fileoverview Set of library functions for nclr.
 * @module
 */

/**
 * @description Style theme for the functions.
 * @type {{inp: function, out: function, info: function, error: function, warn: function, dbg: function, quest: function}}
 * @private
 */
const theme = {
  inp: chalk.white,
  out: chalk.cyan.bold,
  info: chalk.blueBright,
  error: chalk.red,
  warn: chalk.keyword('orange'),
  dbg: chalk.gray,
  quest: chalk.blue,
  succ: chalk.green
};

let THEME = Object.keys(theme);

/**
 * @description Get the theme.
 * @returns {{inp: function, out: function, info: function, error: function, warn: function, dbg: function, quest: function, succ: function}} Theme
 */
const getTheme = () => theme;

/**
 * @description STDOUT log.
 * @param {*} data Data to print
 * @example log('Lorem ipsum dolore sit amet');
 * @returns {boolean} Did it happened?
 */
const log = (...data) => process.stdout.write(...data);

/**
 * @description Update the theme in `colors`
 * @private
 */
const updateTheme = () => {
  THEME = Object.keys(theme);
};

/**
 * @description Check if the argument is a valid name/key and if it isn't an undefined value.
 * @param {*} data Data to check
 * @returns {boolean} Validity
 * @private
 */
const isValidName = data =>
  /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(data) && data !== undefined && data !== 'undefined';

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
 * @description Chain strings of an array as a function chain.
 * @param {string[]} arr Array of function names
 * @returns {function} Functional chain
 * @private
 */
const arrToFxChain = arr => {
  let chain = chalk;
  for (let i = 0; i < arr.length; ++i) {
    chain = arr[i] in chalk ? chain[arr[i]] : chain.keyword(arr[i]);
  }
  return chain;
};

module.exports = {log, getTheme, updateTheme, theme, isValidName, use, arrToFxChain};
