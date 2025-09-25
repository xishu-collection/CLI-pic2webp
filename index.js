#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const sharp = require('sharp');
const { createCommand } = require('commander');

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

function getUniqueOutputPath(outputDir, baseName, extension) {
	let counter = 1;
	let candidatePath = path.join(outputDir, `${baseName}${extension}`);

	while (fs.existsSync(candidatePath)) {
		candidatePath = path.join(outputDir, `${baseName}${counter}${extension}`);
		counter++;
	}

	return {
		path: candidatePath,
		fileName: path.basename(candidatePath)
	};
}

async function processFile(inputFile, outputDir, webpOption) {
	const parsed = path.parse(inputFile);
	try {
		const metadata = await sharp(inputFile).metadata();
		if (!metadata.format) {
			console.error(`Error: File ${parsed.base} is not a supported image type`);
			return false;
		}

		const orientation = metadata.orientation || 1;
		const baseName = `${parsed.name}-generated`;
		const extension = '.webp';

		const { path: outputFilePath, fileName: outputFileName } = getUniqueOutputPath(outputDir, baseName, extension);

		let image = sharp(inputFile, {
			exif: {
				rotate: false
			}
		});

		if (orientation === 6) {
			image = image.rotate(90);
		} else if (orientation === 8) {
			image = image.rotate(-90);
		} else if (orientation === 3) {
			image = image.rotate(180);
		} else {
			image = image.rotate(0);
		}

		await image
			.withMetadata({ orientation: 1 })
			.webp(webpOption)
			.toFile(outputFilePath);

		console.log(`√ Conversion successful: ${parsed.base} -> ${outputFileName}`);
		return true;
	} catch (error) {
		console.error(`× Conversion failed [${parsed.base}]: ${error.message}`);
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

	console.log(`Found ${files.length} files, starting conversion...`);

	let successCount = 0;
	for (const file of files) {
		if (await processFile(file, outputDir, webpOption)) {
			successCount++;
		}
	}
	return successCount;
}

function startInteractiveMode() {
	console.log('Welcome to the Image to WebP Converter!\n');
	console.log('Usage examples:');
	console.log('  - Convert single file: -i <file path>');
	console.log('  - Convert directory: -d <directory path>');
	console.log('  - More parameters, view help: -h/h or --help/help');
	console.log('  - Exit program: exit or quit\n');

	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	function promptUser() {
		const program = createCommand();
		program.exitOverride();
		program
			.option('-i, --input <path>', 'Input file path')
			.option('-d, --directory <path>', 'Input directory path (choose one with -i)')
			.option('-o, --output <path>', 'Output directory path (if not specified, just use the same folder from -i or -d)')
			.option('-q, --quality <number>', 'Image quality (1-100)', '80')
			.option('-l, --lossless <number>', 'Compression level (1: lossy, 2: medium, 3: lossless)', '1')
			.option('-m, --minimal <boolean>', 'Force minimal file size regardless of compression level', 'false');

		rl.question('Please enter command parameters: ', async (userInput) => {
			if (userInput.toLowerCase().trim() === 'exit' || userInput.toLowerCase().trim() === 'quit') {
				console.log('Thank you for using, goodbye!');
				rl.close();
				return;
			}

			if (userInput.toLowerCase().includes('-h') || userInput.toLowerCase().includes('--help') || userInput.toLowerCase() === 'h' || userInput.toLowerCase() === 'help') {
				program.outputHelp();
				promptUser();
				return;
			}

			const fullArgs = ['node', 'convert2webp.js', ...userInput.split(/\s+/).filter(arg => arg.trim() !== '')];

			try {
				program.parse(fullArgs, { from: 'node' });
				await interactiveProcess(program);
			} catch (error) {
				console.error(`Parameter parsing error: ${error.message}`);
				console.error('Please check your input parameters (name/value/count) and try again.');
			}

			console.log('\n');
			promptUser();
		});
	}

	promptUser();

	rl.on('SIGINT', () => {
		console.log('\nThank you for using, goodbye!');
		rl.close();
	});
}

async function interactiveProcess(program) {
	try {
		const params = checkParameters(program);
		console.log(`Parameter check passed, preparing to start processing...`);

		const webpOption = prepareWebpOptions(params.quality, params.losslessLevel, params.minimal);

		const startTime = Date.now();
		let successCount;

		if (params.inputType === 'file') {
			successCount = await processFile(params.inputPath, params.outputPath, webpOption) ? 1 : 0;
		} else {
			successCount = await processDirectory(params.inputPath, params.outputPath, webpOption);
		}

		const duration = ((Date.now() - startTime) / 1000).toFixed(1);
		console.log(`\nConversion completed! Success: ${successCount} file(s), Time: ${duration}s`);
	} catch (error) {
		console.error(`Error occurred during processing: ${error.message}`);
	}
}

function checkParameters(program) {
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
