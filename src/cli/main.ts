/*
MDAPI has needed a CLI fora long time. It's about time I finally add one and save myself a lot of time in the future.
*/

// tslint:disable-next-line
require('tsconfig-paths/register');

import figlet from 'figlet';
import { Command } from 'commander';

const program = new Command();

console.log(figlet.textSync('MDAPI2 CLI'));
program
  .version('0.1.0')
  .description('A CLI for managing various aspects of MDAPI2')
  .option('-g, --gen <value>', 'Generate interface, schema, and service for a new object')
  .parse(process.argv);

const options = program.opts();

if (options.gen) {
  console.log(options.gen);
}