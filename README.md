# BeOnTime

This is a simple tool to exploit timing based attacks over http requests.

beOnTime initially does 10 requests to the remote endpoint and calculates the average time of the requests as well as the accepted deviation.
This parameters will be overridable in the future.

## Usage

```bash
beOnTime -r req.txt -w dict.txt
```

req.txt is a raw http request. You can capture a request with a proxy, like burp

This is an example of that file:

```plaintext
POST /timing-attack/login HTTP/1.1
Host: localhost:1234
Content-Length: 35
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36
content-type: application/json
Accept: */*
Origin: http://localhost:3000
Sec-Fetch-Site: same-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: http://localhost:3000/
Accept-Encoding: gzip, deflate
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
Connection: close
{"username":"{{PLACEHOLDER}}","password":"asd"}
```

dict.txt is a regular wordlist, one word per line.

## License

The project is licensed under the MIT license
