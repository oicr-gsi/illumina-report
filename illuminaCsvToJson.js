'use strict';

const JSON = require('JSON');
const fs = require('fs');
const parse = require('csv-parse');

const runPath = process.argv[2];

transform();

module.exports = {
  transform: transform,
  readCsv: readCsv,
  makeObject: makeObject
}

async function transform () {
  if (typeof runPath!=='undefined') {
    try {
      const csv = fs.readFileSync(runPath, 'utf8');
      const csvAsCells = await readCsv(csv);
      const grouped = await makeObject(csvAsCells);
      const jsonString = JSON.stringify(grouped);
      if (jsonString.indexOf("null")!= -1) {
        console.error("Error: json contains null field");
      }
      return jsonString;
    } catch (e) {
      console.log(e);
    }
  } else {
    console.error("no file path provided");
  }
}

function readCsv (runData) {
  return new Promise((resolve, reject) => {
    const runDataArray = [];
    const parser = parse({'relax_column_count': true, 'skip_empty_lines': true, 'comment': '#'});
    parser.on('readable', (record) => {
      while (record = parser.read()) runDataArray.push(record);
    });
    parser.on('error', (err) => reject(err.message));
    parser.write(runData)
    resolve(runDataArray);
  });
}

function floatOrNan (val) {
  const toFloat = parseFloat(val);
  return (Number.isNaN(toFloat)) ? 'n/a' : toFloat;
}

function getRunLevelMetrics (prefix, current, output) {
  // run-level data headers
  const runHeaders = {
    // read 1/2: 0
    'yield': 1,
    'projected_yield': 2,
    'aligned': 3,
    'error_rate': 4,
    'intensity_c1': 5,
    'pct_gte_q30': 6
  }
  Object.keys(runHeaders).forEach((key) => {
    output[`${prefix}_${key}`] = floatOrNan(current[runHeaders[key]]);
  });
}

function makeObject (runDataArray) {
  const output = {};
  const read1regex = /Read 1*/;
  const read2regex = /Read 2*/;
  output.run_name = runDataArray.shift()[0];
  runDataArray.shift(); // headers for read-level data
  // There's no reason the following shouldn't match...
  if (read1regex.test(runDataArray[0][0])) {
    let read1 = runDataArray.shift();
    getRunLevelMetrics('r1', read1, output);
  }
  // This might not match if run is not paired
  if (read2regex.test(runDataArray[0][0])) {
    let read2 = runDataArray.shift();
    getRunLevelMetrics('r2', read2, output);
  }
  // I don't know under what conditions this wouldn't match
  if (/Non-indexed*/.test(runDataArray[0][0])) {
    // don't care about this
    runDataArray.shift();
  }
  // Might be useful
  if (/Total*/.test(runDataArray[0][0])) {
    let total = runDataArray.shift();
    getRunLevelMetrics('total', total, output);
  }
  // this reeeeeally should match
  if (read1regex.test(runDataArray[0][0])) {
    // 'Read 1' is the only item in this row and we don't need it
    runDataArray.shift();
  } else {
    console.log('PANIC! Did not find Read 1 indicator');
  }
  
  const lanes = {};

  getMetricsForRead(1, runDataArray, lanes);
  
  // might not match if it's single-end
  if (read2regex.test(runDataArray[0][0])) {
    // 'Read 2' is the only item in this row and we don't need it
    runDataArray.shift();
  }

  getMetricsForRead(2, runDataArray, lanes);

  output.lanes = lanes;

  return output;
}

function getMetricsForRead (readNum, runDataArray, lanes) {
  // We don't need headers
  if (/Lane/.test(runDataArray[0][0].trim())) runDataArray.shift();
  // But we do want the data for each lane.
  // Unfortunately, it comes to us with three rows per lane.
  // We only care about the first of each three rows (totals)
  while (/^\d/.test(runDataArray[0][0].trim())) {
    const lane = runDataArray[0][0].trim();
    switch (runDataArray[0][1].trim()) {
      case '-':
        // Use this; it contains totals from both surfaces
        getLaneLevelMetrics(`r${readNum}`, runDataArray.shift(), lanes);
      default:
        // Don't care, get rid of it
        runDataArray.shift();
    }
  }
  // this while loop should exit as soon as we get past the lanes for this read
}

function getLaneLevelMetrics (prefix, current, lanes) {
  const sd = ' +/- ';
  const pp = ' / ';
  const lane = current[0].trim();
  lanes[lane] = lanes[lane] || {};
  const lh = {
    // Lane: 0
    // Surface: 1
    'tiles': (read) => floatOrNan(read[2]),
    'density': (read) => floatOrNan(read[3].split(sd)[0]),
    'density_sd': (read) => floatOrNan(read[3].split(sd)[1]),
    'cluster_pf': (read) => floatOrNan(read[4].split(sd)[0]),
    'cluster_pf_sd': (read) => floatOrNan(read[4].split(sd)[1]),
    'phasing': (read) => floatOrNan(read[5].split(pp)[0]),
    'prephasing': (read) => floatOrNan(read[5].split(pp)[1]),
    // Phasing slope/offset: 6, Prephasing slope/offset: 7
    'reads': (read) => floatOrNan(read[8]),
    'reads_pf': (read) => floatOrNan(read[9]),
    'pct_gte_q30': (read) => floatOrNan(read[10]),
    'yield': (read) => floatOrNan(read[11]),
    'cycles_error': (read) => floatOrNan(read[12]),
    'aligned': (read) => floatOrNan(read[13].split(sd)[0]), 
    'aligned_sd': (read) => floatOrNan(read[13].split(sd)[1]),
    'error': (read) => floatOrNan(read[14].split(sd)[0]),
    'error_sd': (read) => floatOrNan(read[14].split(sd)[1]),
    'error_35': (read) => floatOrNan(read[15].split(sd)[0]),
    'error_35_sd': (read) => floatOrNan(read[15].split(sd)[1]),
    'error_75': (read) => floatOrNan(read[16].split(sd)[0]),
    'error_75_sd': (read) => floatOrNan(read[16].split(sd)[1]),
    'error_100': (read) => floatOrNan(read[17].split(sd)[0]),
    'error_100_sd': (read) => floatOrNan(read[17].split(sd)[1]),
    'intensity_c1': (read) => floatOrNan(read[18].split(sd)[0]),
    'intensity_c1_sd': (read) => floatOrNan(read[18].split(sd)[1])
  };

  Object.keys(lh).forEach((key) => {
    lanes[lane][`${prefix}_${key}`] = lh[key](current);
  });
}
