const clr = require('colors/safe');
const theme = require('./theme');

/**
 * @fileoverview Set of library functions for nclr.
 * @module
 */

clr.setTheme(theme);
let THEME = Object.keys(theme);

/**
 * @description STDOUT log.
 * @param {*} data Data to print
 * @example log('Lorem ipsum dolore sit amet');
 * @returns {boolean} Did it happened?
 */
const log = (...data) => process.stdout.write(...data);

/**
 * @description Update the theme in `colors`.
 * @private
 */
const updateTheme = () => {
  clr.setTheme(theme);
  THEME = Object.keys(theme);
};

/**
 * @description Check if the argument is a valid name/key.
 * @param {*} data Data to check
 * @returns {boolean} Validity
 * @private
 */
const isValidName = (data) => /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(data) && data !== undefined && data !== 'undefined';

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

module.exports = { log, updateTheme, isValidName, use }