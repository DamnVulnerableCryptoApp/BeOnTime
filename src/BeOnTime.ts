import Axios from 'axios';
import { HTTPParser, RequestStruct } from './HTTPParser';
import * as fs from 'fs';
import * as Https from 'https';
import * as readline from 'readline';
import { argv } from 'yargs';

console.log("");
console.log("BeOnTime");
console.log("========");
console.log("By Luis Fontes");
console.log("");

const requestContent = fs.readFileSync(argv.r as string).toString();

const request = async (parsedRequest: RequestStruct | null) => {
  if (parsedRequest === null) return;

  return Axios({
    method: parsedRequest.method,
    url: parsedRequest.url,
    headers: parsedRequest.headers,
    httpsAgent: new Https.Agent({
      rejectUnauthorized: false
    }),
    data: parsedRequest.body
  });
};

//https://www.wikihow.com/Calculate-Standard-Deviation
const averageAndDeviation = async () => {

  const times = [];
  const parsedRequest = HTTPParser.fromString(requestContent);

  console.log("Going to make 10 requests, to test response rate");

  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await request(parsedRequest); //user 'a' should not exit
    const end = Date.now();
    times.push(end - start);
  }

  const count = times.length;
  const average = times.reduce((a, b) => a + b) / count;
  const tmp = times.map(n => (n - average) ^ 2).reduce((a, b) => a + b);
  const variance = tmp / (count - 1);
  const deviation = Math.sqrt(variance);

  return { deviation, average };
};

const calculateMaxTime = async () => {
  const { deviation, average } = await averageAndDeviation();
  const dev = argv.d ? argv.d as number : deviation;

  //const minTime = average - (average * deviation); //should not be needed
  const maxTime = average + (average * dev);

  console.log("Average request time: " + average / 1000);
  console.log("Deviation: " + dev / 1000);
  console.log("Maximum accepted time for request: " + maxTime / 1000);
  console.log("");

  return maxTime;
};

const main = async () => {

  const maxTime = await calculateMaxTime();

  console.log("");
  console.log("ATTENTION: It's important to not stress the network or the server while running this test");
  console.log("");

  const wordlistFile = argv.w as string;
  const rl = readline.createInterface({ input: fs.createReadStream(wordlistFile) });

  for await (const line of rl) {
    const req = requestContent.replace("{{PLACEHOLDER}}", line);
    const requestData = HTTPParser.fromString(req);

    const start = Date.now();
    await request(requestData);
    const end = Date.now();

    const time = end - start;

    console.log(`Took ${time / 1000} seconds for ` + line);

    if (time > maxTime)
      console.log("[!] Something's happening with " + line);
  }

};

main();