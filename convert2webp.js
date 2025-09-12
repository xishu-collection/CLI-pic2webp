#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const sharp = require('sharp');
const { program } = require('commander');

program
	.option('-i, --input <path>', 'Input file path')
	.option('-d, --directory <path>', 'Input directory path (choose one with -i)')
	.option('-o, --output <path>', 'Output directory path (if not specified, just use the same folder from -i or -d)')
	.option('-q, --quality <number>', 'Image quality (1-100)', '80')
	.option('-l, --lossless <number>', 'Compression level (1: lossy, 2: medium, 3: lossless)', '1')
	.option('-m, --minimal <boolean>', 'Force minimal file size regardless of compression level', 'false')
	.parse(process.argv);

const options = program.opts();

function prepareWebpOptions(quality, losslessLevel, minimal) {
	const webpOption = {
		quality: quality,
		force: true
	};

	if (minimal) {
		webpOption.minSize = true;
		webpOption.mixed = true;
		webpOption.effort = 6;
	} else {
		switch (losslessLevel) {
			case 1:
				webpOption.lossless = false;
				break;
			case 2:
				webpOption.nearLossless = true;
				break;
			case 3:
				webpOption.lossless = true;
				break;
		}
	}

	return webpOption;
}

async function processFile(inputFile, outputDir, webpOption) {
	try {
		const metadata = await sharp(inputFile).metadata();
		if (!metadata.format) {
			console.error(`Error: File ${path.basename(inputFile)} is not a supported image type`);
			return false;
		}

		const parsed = path.parse(inputFile);
		const outputFileName = `${parsed.name}-trans.webp`;
		const outputFilePath = path.join(outputDir, outputFileName);

		await sharp(inputFile)
			.webp(webpOption)
			.toFile(outputFilePath);

		console.log(`✓ Conversion successful: ${path.basename(inputFile)} -> ${outputFileName}`);
		return true;
	} catch (error) {
		console.error(`✗ Conversion failed [${path.basename(inputFile)}]: ${error.message}`);
		return false;
	}
}

async function processDirectory(inputDir, outputDir, webpOption) {
	const files = [];

	function getAllFiles(dir) {
		const items = fs.readdirSync(dir);
		for (const item of items) {
			const fullPath = path.join(dir, item);
			if (fs.statSync(fullPath).isDirectory()) {
				getAllFiles(fullPath);
			} else {
				files.push(fullPath);
			}
		}
	}

	getAllFiles(inputDir);

	console.log(`Found ${files.length} image files, starting conversion...`);

	let successCount = 0;
	const startTime = Date.now();

	for (const file of files) {
		if (await processFile(file, outputDir, webpOption)) {
			successCount++;
		}
	}

	const duration = ((Date.now() - startTime) / 1000).toFixed(1);
	console.log(`\nConversion completed! Success: ${successCount}/${files.length} files, Time: ${duration}s`);
}

function startInteractiveMode() {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	console.log('Welcome to the Image to WebP Converter!\n');
	console.log('Usage examples:');
	console.log('  - Convert single file: -i <file path>');
	console.log('  - Convert directory: -d <directory path>');
	console.log('  - More parameters, View help: h or help');
	console.log('  - Exit program: exit or quit\n');

	function promptUser() {
		rl.question('Please enter command parameters: ', async (userInput) => {
			if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
				console.log('Thank you for using, goodbye!');
				rl.close();
				return;
			}

			if (userInput.includes('-h') || userInput.includes('--help') || userInput.toLowerCase() === 'h' || userInput.toLowerCase() === 'help') {
				program.outputHelp();
				promptUser();
				return;
			}

			const args = ['node', 'convert2webp.js', ...userInput.split(/\s+/).filter(arg => arg.trim() !== '')];

			try {
				process.argv = args;
				program.opts = function () { return {}; };
				program.parse(process.argv, { from: 'user' });
				const options = program.opts();

				const originalExit = process.exit;

				try {
					process.exit = (code) => {
						console.error(`Program attempted to exit, code: ${code}`);
						throw new Error('Process exit prevented');
					};

					await interactiveProcess();
				} catch (error) {
					if (error.message !== 'Process exit prevented') {
						console.error(`Processing error: ${error.message}`);
					}
				} finally {
					process.exit = originalExit;
				}
			} catch (error) {
				console.error(`Parameter parsing error: ${error.message}`);
			}

			console.log('\n');
			rl.close();
		});
	}

	promptUser();

	rl.on('SIGINT', () => {
		console.log('\nThank you for using, goodbye!');
		rl.close();
	});
}

async function interactiveProcess() {
	try {
		const params = checkParameters();
		console.log(`Parameter check passed, preparing to start processing...`);

		const webpOption = prepareWebpOptions(params.quality, params.losslessLevel, params.minimal);

		if (params.inputType === 'file') {
			await processFile(params.inputPath, params.outputPath, webpOption);
		} else {
			await processDirectory(params.inputPath, params.outputPath, webpOption);
		}

	} catch (error) {
		console.error(`Error occurred during processing: ${error.message}`);
	}
}

function checkParameters() {
	const result = {
		inputType: '',
		inputPath: '',
		outputPath: '',
		quality: 80,
		losslessLevel: 1,
		minimal: false
	};

	const options = program.opts();

	if (options.input && options.directory) {
		throw new Error('Only one of -i/--input or -d/--directory parameters can be used');
	}

	if (options.input) {
		result.inputType = 'file';
		result.inputPath = path.resolve(options.input);
		if (!fs.existsSync(result.inputPath)) {
			throw new Error(`Specified file does not exist: ${result.inputPath}`);
		}
		result.outputPath = path.parse(options.input).dir;
	} else if (options.directory) {
		result.inputType = 'directory';
		result.inputPath = path.resolve(options.directory);
		if (!fs.existsSync(result.inputPath)) {
			throw new Error(`Specified directory does not exist: ${result.inputPath}`);
		}
		result.outputPath = result.inputPath;
	} else {
		throw new Error('Must provide -i/--input or -d/--directory parameter');
	}

	if (options.output) {
		const outputPath = path.resolve(options.output);
		if (fs.existsSync(outputPath)) {
			result.outputPath = outputPath;
		} else {
			throw new Error(`Specified output path does not exist: ${outputPath}`);
		}
	}

	const qualityNum = parseInt(options.quality);
	if (isNaN(qualityNum) || qualityNum < 1 || qualityNum > 100) {
		console.warn('Warning: Invalid image quality parameter, using default value 80');
		result.quality = 80;
	} else {
		result.quality = qualityNum;
	}

	const losslessNum = parseInt(options.lossless);
	if (![1, 2, 3].includes(losslessNum)) {
		console.warn('Warning: Invalid compression level parameter, using default value 1');
		result.losslessLevel = 1;
	} else {
		result.losslessLevel = losslessNum;
	}

	result.minimal = options.minimal === 'true' || options.minimal === true;

	return result;
}

startInteractiveMode();
