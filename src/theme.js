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
module.exports = {
  inp: 'white', //input
  out: ['cyan', 'bold'], //Output
  info: 'green', //Information
  error: 'red', //Error
  warn: 'yellow', //Warning
  dbg: 'grey', //Debug statement
  quest: 'blue' //Question
};