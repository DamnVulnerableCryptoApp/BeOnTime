import yargs from "yargs";

const argv = yargs
  .usage('\n\nUsage: $0 [options]')
  .alias('r', 'request')
  .nargs('r', 1)
  .describe('r', 'Path to the request file to be used')

  .alias('w', 'wordlist')
  .nargs('w', 1)
  .describe('w', 'Path to the wordlist file (with one option per line)')

  .alias('d', 'deviation')
  .nargs('d', 1)
  .describe('d', 'Specify an accepted deviation. THis is calculated by default, based on 10 requests')

  .demandOption(['r', 'w'])

  .help('h')
  .alias('h', 'help')

  .example('$0 -r req.txt -w wordlist.txt', '')
  .epilog("In the request file use the tag {{PLACEHOLDER}} to be replaced by the lines in the wordlist")

  .wrap(process.stdout.columns)
  .argv;

export default argv;