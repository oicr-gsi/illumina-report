//first make a csv summary file of 130417_M00146_0021_000000000-A2WDF test run and save it under: illumina-report/test/summaryData.csv
//this run is a NextSeq test run

'use strict';

process.env.NODE_ENV = 'test';

const fs = require('fs');
const JSON = require('JSON');

const test = require('unit.js');
const makeJson = require('../getMetrics');
const miseqPath = './test/miseqSummaryData.csv';
const nextseqPath = './test/nextseqSummaryData.csv';

describe('convert illumina output to json', function() {
  // checks that the test is properly set up: the illumina summary file is present withing the test directory
  before('illumina file present', function(done) {
    const summary = fs.readFileSync('./test/miseqSummaryData.csv', 'utf8');
    test.string(summary).isNotEmpty();
    test.bool(fs.existsSync(nextseqPath)).isTrue();
    done();
  });
  // using parseInt on a blank field, or one that contains letters will result in a null value
  it('no null fields', async function() {
    const summary = fs.readFileSync(miseqPath, 'utf8');
    const csvAsCells = await makeJson.readCsv(summary);
    const summaryObject = await makeJson.makeObject(csvAsCells);
    const jsonString = JSON.stringify(summaryObject);
    test.string(jsonString).notHasValue('null');
  });
  // MiSeq information is correct
  it('MiSeq summary information matches', async function() {
    const summary = fs.readFileSync(miseqPath, 'utf8');
    const csvAsCells = await makeJson.readCsv(summary);
    const summaryObject = await makeJson.makeObject(csvAsCells);
    test
      .object(summaryObject)
      .hasProperty('run_name', '130417_M00146_0021_000000000-A2WDF')
      .hasProperty('r1_yield', 1.2)
      .hasProperty('r1_projected_yield', 1.2)
      .hasProperty('r1_aligned', 0)
      .hasProperty('r1_error_rate', 'n/a')
      .hasProperty('r1_intensity_c1', 201)
      .hasProperty('r1_pct_gte_q30', 95.59)
      .hasProperty('r2_yield', 1.2);
    test.object(summaryObject['lanes']).hasKeys(['1']); // and only one lane
    test
      .object(summaryObject['lanes']['1'])
      .hasProperty('r1_phasing', 0.145)
      .hasProperty('r2_phasing', 0.191)
      .hasProperty('r1_prephasing', 0.17)
      .hasProperty('r2_prephasing', 0.453)
      .hasProperty('r2_reads', 10.76)
      .hasProperty('r2_yield', 1.2)
      .hasProperty('r2_intensity_c1_sd', 33);
  });
  // NextSeq information is correct
  it('NextSeq summary information matches', async function() {
    const summary = fs.readFileSync(nextseqPath, 'utf8');
    const csvAsCells = await makeJson.readCsv(summary);
    const summaryObject = await makeJson.makeObject(csvAsCells);
    test
      .object(summaryObject)
      .hasProperty('run_name', '150312_NS500507_0027_AH2KJ5AFXX')
      .hasProperty('r1_yield', 31.29)
      .hasProperty('r2_projected_yield', 1.46)
      .hasProperty('r3_aligned', 0)
      .hasProperty('r4_intensity_c1', 4289)
      .hasProperty('total_pct_gte_q30', 81.46);
    test.object(summaryObject['lanes']).hasKeys(['1', '2', '3', '4']);
    test
      .object(summaryObject['lanes']['1'])
      .hasProperty('r1_density', 306)
      .hasProperty('r2_density_sd', 10)
      .hasProperty('r3_cluster_pf', 78.39)
      .hasProperty('r4_cluster_pf_sd', 5.62)
      .hasProperty('r1_pct_gte_q30', 82.78)
      .hasProperty('r2_yield', 0.36)
      .hasProperty('r3_intensity_c1', 2953)
      .hasProperty('r4_intensity_c1_sd', 579);
  });
});
