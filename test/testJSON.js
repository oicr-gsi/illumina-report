//first make a csv summary file of 150312_NS500507_0027_AH2KJ5AFXX test run and save it under: illumina-report/test/summaryData.csv
//this run is a NextSeq test run 
var fs = require('fs');
var JSON = require('JSON');

var test = require('unit.js');
var makeJson = require("../illuminaToJSON");

describe('convert illumina output to json', function() {
	//checks that the test is properly set up: the illumina summary file is present withing the test directory
	before ('illumina file present', function(done) {
		var summary = fs.readFileSync("./test/summaryData.csv", 'utf8');
		test.string(summary).isNotEmpty();
		done();
	});
	//using parseInt on a blank field, or one that contains letters will result in a null value
	it('no null fields', function(done) {
		var summary = fs.readFileSync("./test/summaryData.csv", 'utf8');
		makeJson.makeObject(summary, "150312_NS500507_0027_AH2KJ5AFXX", function(obj) {
			var jsonString = JSON.stringify(obj);
			test.string(jsonString).notHasValue('null');
			done();
		});
	});
	//read 1 has all the correct summary information
	it('summary information matches', function(done) {
		var summary = fs.readFileSync("./test/summaryData.csv", 'utf8');
		makeJson.makeObject(summary, "150312_NS500507_0027_AH2KJ5AFXX", function(obj) {
			test.object(obj)
				.hasProperty("run_name", "150312_NS500507_0027_AH2KJ5AFXX")
				.hasProperty("r1_yield", 31.29)
				.hasProperty("r1_projected_yield",31.29)
				.hasProperty("r1_aligned", 0)
				.hasProperty("r1_error_rate",0)
				.hasProperty("r1_intensity_c1", 5161)
				.hasProperty("r1_pct_gte_q30", 83.4);
			done();
		});
	});
	//correctly identifies the second read
	it('correct second read', function(done) {
		var summary = fs.readFileSync("./test/summaryData.csv", 'utf8');
		makeJson.makeObject(summary, "150312_NS500507_0027_AH2KJ5AFXX", function(obj) {
			test.object(obj)
				.hasProperty("r2_yield", 31.26)
				.hasLength(14);
			done();
		});
	});
	//this run should have 4 lanes
	it('number of lanes', function(done) {
		var summary = fs.readFileSync("./test/summaryData.csv", 'utf8');
		makeJson.makeObject(summary, "150312_NS500507_0027_AH2KJ5AFXX", function(obj) {
			test.object(obj["lanes"])
				.isArray()
				.hasLength(4);
			done();
		});
	});
	//correct values within the lanes array, looking at lane 1
	it('correct lane information ', function(done) {
		var summary = fs.readFileSync("./test/summaryData.csv", 'utf8');
		makeJson.makeObject(summary, "150312_NS500507_0027_AH2KJ5AFXX", function(obj) {
			test.object(obj["lanes"][0])
				.hasProperty("r1_phasing", 0.185)
				.hasProperty("r2_phasing", 0.223)
				.hasProperty("r1_prephasing", 0.12)
				.hasProperty("r2_prephasing", 0.147)
				.hasProperty("r2_reads", 66.23)
				.hasProperty("r2_yield", 7.78)
				.hasProperty("r2_intensity_c1_sd", 579)
			done();
		});
	});
});