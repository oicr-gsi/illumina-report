'use strict';

const parse = require('csv-parse');

module.exports = {
  readCsv: readCsv,
  makeObject: makeObject
};

function readCsv(runData) {
  return new Promise((resolve, reject) => {
    const runDataArray = [];
    // don't freak out about the fact that the first table has fewer columns than the second table
    // skip empty lines so we're only ever dealing with data
    // skip lines starting with # (ie. comment with illumina summary tool version)
    const parser = parse({
      relax_column_count: true,
      skip_empty_lines: true,
      comment: '#'
    });
    parser.on('readable', record => {
      while ((record = parser.read())) runDataArray.push(record);
    });
    parser.on('error', err => reject(err.message));
    parser.write(runData);
    resolve(runDataArray);
  });
}

function floatOrNan(val) {
  const toFloat = parseFloat(val);
  return Number.isNaN(toFloat) ? 'n/a' : toFloat;
}

function getRunLevelMetrics(prefix, current, output) {
  // run-level data headers
  const runHeaders = {
    // read 1/2: 0
    yield: 1,
    projected_yield: 2,
    aligned: 3,
    error_rate: 4,
    intensity_c1: 5,
    pct_gte_q30: 6
  };
  Object.keys(runHeaders).forEach(key => {
    output[`${prefix}_${key}`] = floatOrNan(current[runHeaders[key]]);
  });
}

function makeObject(runDataArray) {
  return new Promise((resolve, reject) => {
    const output = {};
    // there could be up to 4 reads (paired end with dual indices)
    const read1regex = /Read 1.*/;
    const read2regex = /Read 2.*/;
    const read3regex = /Read 3.*/;
    const read4regex = /Read 4.*/;
    const nonIndexed = /Non-indexed.*/;
    const total = /Total.*/;
    const whichRead = [read1regex, read2regex, read3regex, read4regex];

    // run name is the first line
    output.run_name = runDataArray.shift()[0];
    // next are headers for read-level data, which we don't care about
    runDataArray.shift();

    // then the per-read run summary
    for (let i = 0; i < whichRead.length; i++) {
      if (whichRead[i].test(runDataArray[0][0])) {
        let currentRead = runDataArray.shift();
        getRunLevelMetrics(`r${i + 1}`, currentRead, output);
      }
    }
    // then a few more run summary metrics
    if (nonIndexed.test(runDataArray[0][0])) {
      // don't care about this
      runDataArray.shift();
    }
    if (total.test(runDataArray[0][0])) {
      let total = runDataArray.shift();
      getRunLevelMetrics('total', total, output);
    }

    // then the per-read per-lane metrics
    const lanes = {};
    for (let i = 0; i < whichRead.length; i++) {
      const thisRead = runDataArray[0][0];
      if (nonIndexed.test(thisRead)) {
        // weird; should probably yell
        reject('Found unexpected Non-indexed reads section for lanes');
      }
      if (total.test(thisRead)) {
        // weird; should probably yell
        reject('Found unexpected Total reads section for lanes');
      }
      if (whichRead[i].test(thisRead)) {
        // 'Read X' is the only item in the first row and we don't need it
        runDataArray.shift();
        getMetricsForRead(i + 1, runDataArray, lanes);
      }
    }

    output.lanes = lanes;

    resolve(output);
  });
}

function getMetricsForRead(readNum, runDataArray, lanes) {
  // We don't need headers
  if (/Lane/.test(runDataArray[0][0].trim())) runDataArray.shift();
  // But we do want the data for each lane.
  // Unfortunately, it may to us with three rows per lane.
  // We only care about the first of each three rows (totals)
  while (/^\d+/.test(runDataArray[0][0].trim())) {
    const lane = runDataArray[0][0].trim();
    switch (runDataArray[0][1].trim()) {
      case '-':
        // Use this; it contains totals from both surfaces
        getLaneLevelMetrics(`r${readNum}`, runDataArray.shift(), lanes);
        break;
      default:
        // Don't care
        runDataArray.shift();
        break;
    }
  }
  // this while loop should exit as soon as we get past the lanes for this read
}

function getLaneLevelMetrics(prefix, current, lanes) {
  const sd = ' +/- ';
  const pp = ' / ';
  const lane = current[0].trim();
  lanes[lane] = lanes[lane] || {};
  const lh = {
    // Lane: 0
    // Surface: 1
    tiles: read => floatOrNan(read[2]),
    density: read => floatOrNan(read[3].split(sd)[0]),
    density_sd: read => floatOrNan(read[3].split(sd)[1]),
    cluster_pf: read => floatOrNan(read[4].split(sd)[0]),
    cluster_pf_sd: read => floatOrNan(read[4].split(sd)[1]),
    phasing: read => floatOrNan(read[5].split(pp)[0]),
    prephasing: read => floatOrNan(read[5].split(pp)[1]),
    // Phasing slope/offset: 6, Prephasing slope/offset: 7
    reads: read => floatOrNan(read[8]),
    reads_pf: read => floatOrNan(read[9]),
    pct_gte_q30: read => floatOrNan(read[10]),
    yield: read => floatOrNan(read[11]),
    cycles_error: read => floatOrNan(read[12]),
    aligned: read => floatOrNan(read[13].split(sd)[0]),
    aligned_sd: read => floatOrNan(read[13].split(sd)[1]),
    error: read => floatOrNan(read[14].split(sd)[0]),
    error_sd: read => floatOrNan(read[14].split(sd)[1]),
    error_35: read => floatOrNan(read[15].split(sd)[0]),
    error_35_sd: read => floatOrNan(read[15].split(sd)[1]),
    error_75: read => floatOrNan(read[16].split(sd)[0]),
    error_75_sd: read => floatOrNan(read[16].split(sd)[1]),
    error_100: read => floatOrNan(read[17].split(sd)[0]),
    error_100_sd: read => floatOrNan(read[17].split(sd)[1]),
    intensity_c1: read => floatOrNan(read[18].split(sd)[0]),
    intensity_c1_sd: read => floatOrNan(read[18].split(sd)[1])
  };

  Object.keys(lh).forEach(key => {
    lanes[lane][`${prefix}_${key}`] = lh[key](current);
  });
}
