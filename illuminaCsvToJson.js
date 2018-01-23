'use strict';

const JSON = require('JSON');
const fs = require('fs');
const converter = require('./getMetrics');

const runCsv = process.argv[2];

transform();

async function transform() {
  if (typeof runCsv == 'undefined') console.error('must provide file path');
  try {
    // may get the run CSV as a file path or as the entire text of the CSV.
    // gracefully handle both
    let parsed;
    if (fs.existsSync(runCsv)) {
      const file = fs.readFileSync(runCsv, 'utf8');
      parsed = await converter.readCsv(file);
    } else {
      parsed = await converter.readCsv(runCsv);
    }
    const summaryObject = await converter.makeObject(parsed);
    const summaryAsJson = JSON.stringify(summaryObject);
    if (summaryAsJson.indexOf('null') != -1) {
      console.error('Error: json contains null field');
    }
    console.log(summaryAsJson);
    return summaryAsJson;
  } catch (e) {
    console.log(e);
  }
}
