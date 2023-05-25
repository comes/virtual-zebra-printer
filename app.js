import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ type: "*/*" }));

const fakePrinter = {
    deviceType: "printer",
    uid: "127.0.0.1:9102",
    provider: "com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider",
    name: "fake printer",
    connection: "network",
    version: 4,
    manufacturer: "Zebra Technologies",
};

let lastCommand = "";

function virtualPrint(zpl) {
    const port = process.env.CHROME_EXTENSION_PORT ?? "9102";
    fetch(`http://localhost:${port}`, {
      method: "POST",
      body: '{"mode":"print","epl":"' + Buffer.from(zpl) + '"}',
    }).catch((e) => {
        console.error("Error while sending print request to extension", e);
    });
}

app.get("/default", (_, res) => {
  console.log("GET /default");
  res.json(fakePrinter);
});

app.get("/available", (_, res) => {
  console.log("GET /available");
  res.json({
    printer: [fakePrinter]
  });
});

app.get("/config", (_, res) => {
  console.log("GET /config");
  res.json({
    application: {
      supportedConversions: {
        jpg: ["cpcl", "zpl", "kpl"],
        tif: ["cpcl", "zpl", "kpl"],
        pdf: ["cpcl", "zpl", "kpl"],
        bmp: ["cpcl", "zpl", "kpl"],
        pcx: ["cpcl", "zpl", "kpl"],
        gif: ["cpcl", "zpl", "kpl"],
        png: ["cpcl", "zpl", "kpl"],
        jpeg: ["cpcl", "zpl", "kpl"],
      },
      version: "1.3.1.421",
      apiLevel: 4,
      buildNumber: 421,
      platform: "macos",
    },
  });
});

app.post("/read", (_, res) => {
  console.log("POST /read");
  console.log(
    "Last command:",
    lastCommand
      .replace(/\/g, "\\");
  );
  let responseStr = "";
  if (lastCommand === "^XA^HH^XZ") {
    responseStr = `\x02
  15.0                DARKNESS
  5 IPS               PRINT SPEED
  +000                TEAR OFF
  TEAR OFF            PRINT MODE
  GAP/NOTCH           MEDIA TYPE
  WEB                 SENSOR TYPE
  MANUAL              SENSOR SELECT
  609                 PRINT WIDTH
  1558                LABEL LENGTH
  39.0IN   989MM      MAXIMUM LENGTH
  CONNECTED           USB COMM.
  NONE                PROTOCOL
  <~>  7EH            CONTROL CHAR
  <^>  5EH            COMMAND CHAR
  <,>  2CH            DELIM. CHAR
  ZPL II              ZPL MODE
  NO MOTION           MEDIA POWER UP
  FEED                HEAD CLOSE
  DEFAULT             BACKFEED
  +000                LABEL TOP
  +0000               LEFT POSITION
  NO                  HEXDUMP
  045                 WEB S.
  096                 MEDIA S.
  007                 WEB GAIN
  050                 MARK S.
  020                 MARK GAIN
  095                 MARK MED S.
  024                 MARK MEDIA GAIN
  095                 CONT MEDIA S.
  007                 CONT MEDIA GAIN
  066                 TAKE LABEL
  CWF                 MODES ENABLED
  ...                 MODES DISABLED
  832 8/MM FULL       RESOLUTION
  V61.17.17Z <-       FIRMWARE
  1.3                 XML SCHEMA
  V30.00.00           HARDWARE ID
  CUSTOMIZED          CONFIGURATION
  2104k............R: RAM
  1536k............E: ONBOARD FLASH
  NONE                FORMAT CONVERT
  DISABLED            ZBI
  2.1                 ZBI VERSION
  3,454 IN            LAST CLEANED
  3,454 IN            HEAD USAGE
  3,454 IN            TOTAL USAGE
  3,454 IN            RESET CNTR1
  3,454 IN            RESET CNTR2
  28J171602337        SERIAL NUMBER
  MAINT. OFF          EARLY WARNING
\x03`;
  }

  if (lastCommand === `~hs\r\n`) {
    responseStr = `\x02030,0,0,1558,000,0,0,0,000,0,0,0\x03
\x02000,0,0,0,0,2,4,0,00000000,1,000\x03
\x021234,0\x03
`;
  }

  lastCommand = "";
  res.status(200).send(responseStr);
});

app.post("/write", (req, res) => {
  console.log("POST request for /write recieved");
  lastCommand = req?.body?.data || null;
  if (lastCommand) {
    console.log(
      "Last command:",
      lastCommand
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
    );
  } else {
    console.log("No data found in request body");
  }
  if (lastCommand.startsWith('^xa') && process.env.CHROME_EXTENSION_ENABLED === String(true)) {
    virtualPrint(lastCommand);
  }
  res.send({});
});

const SERVER_PORT = 9100;
const EXTENSION_PORT = process.env.CHROME_EXTENSION_PORT ?? "9102";

if (process.env.CHROME_EXTENSION_ENABLED === String(true)) {
    console.info(
      "Preview ZPL with https://chrome.google.com/webstore/detail/zpl-printer/phoidlklenidapnijkabnfdgmadlcmjo\n" +
      "Configure the extension to use port " + EXTENSION_PORT
    );
  } else {
    console.info("Chrome extension support not enabled.");
}

app.listen(SERVER_PORT, "127.0.0.1", () => {
  console.log(
    `Browser Print Fake Server running on http://localhost:${SERVER_PORT}`
  );
});
