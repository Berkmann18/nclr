/**
 * @fileoverview CLI colours.
 * @module clr
 */
/* eslint-env es6, node */

/**
 * @description Colour/style theme for the CLI.
 * @type {{inp: string, out: string[], info: string, error: string, warn: string, dbg: string, quest: string}}
 * @protected
 */
const theme = {
  inp: 'white', //input
  out: ['cyan', 'bold'], //Output
  info: 'cyan', //Information
  error: 'red', //Error
  warn: 'yellow', //Warning
  dbg: 'grey', //Debug statement
  quest: 'blue', //Question
  succ: 'green' //Success
};

export default theme;