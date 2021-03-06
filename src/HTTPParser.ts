import fs from 'fs';
import * as Axios from 'axios';
import { Method } from 'axios';

export interface RequestStruct {
  headers: Record<string, string>;
  body: string;
  url: string;
  method: Method;
}

export class HTTPParser {

  public static fromString(fileContent: string): RequestStruct | null {
    try {
      fileContent = fileContent.replace(/(\r\n|\n|\r)/gm, "\n");

      let firstNewLineIndex = fileContent.indexOf("\n");
      if (firstNewLineIndex === -1) firstNewLineIndex = fileContent.length;

      const startLine = fileContent.substring(0, firstNewLineIndex);
      const startLineArray = startLine.split(" ");
      const method: Method = startLineArray[0] as Method;
      const path = startLineArray[1];
      let emptyLine = fileContent.indexOf("\n\n");
      if (emptyLine === -1) emptyLine = fileContent.length;

      const headersArray = fileContent.substring(firstNewLineIndex + 1, emptyLine).split("\n");
      const headers: Record<string, string> = {};
      const body = fileContent.substring(emptyLine + 2);

      headersArray.forEach(h => {
        const delimiterIndex = h.indexOf(":");
        const name = h.substring(0, delimiterIndex);
        const value = h.substring(delimiterIndex + 2);
        headers[name] = value;
      });

      //if full url is not in the request lets assume an http to host header
      let url: string;
      if (path.startsWith("http"))
        url = path;
      else
        url = "http://" + (headers['host'] || headers['Host']) + path;

      //let axios calculate the length, since we may change it
      delete headers["content-length"];
      delete headers["Content-Length"];
      return { body: body, headers: headers, method: method, url: url };
    }
    catch (ex) {
      console.error("[HTTPParser] - Error parsing request file");
      console.error(ex);
      return null;
    }
  }

  public static async fromFile(filepath: string): Promise<RequestStruct | null> {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, (err, data: Buffer) => {
        if (err) { reject(err); return; }

        resolve(HTTPParser.fromString(data.toString()));

      });
    });
  }



  public static axiosResponseToString(r: Axios.AxiosResponse): string {
    let responseString = `HTTP/${r.request.res.httpVersion} ${r.status} ${r.statusText}\n`;

    Object.entries(r.headers).forEach(([key, value]) => {
      responseString += `${key}: ${value}\n`;
    });

    const body = (typeof r.data === "object") ? JSON.stringify(r.data) : r.data;
    responseString += `\n${body}`;

    return responseString;
  }
}