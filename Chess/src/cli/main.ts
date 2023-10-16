import type { Game } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { ChessGameLanguageMetaData } from '../language/generated/module.js';
import { createChessGameServices } from '../language/chess-game-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript, generatePGN } from './generator.js';
import { NodeFileSystem } from 'langium/node';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createChessGameServices(NodeFileSystem).ChessGame;
    const model = await extractAstNode<Game>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export const generatePGNAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createChessGameServices(NodeFileSystem).ChessGame;
    const model = await extractAstNode<Game>(fileName, services);      
    const generatedFilePath : String = generatePGN(model, fileName, opts.destination, opts.language);
    console.log(chalk.green(`PGN generated successfully: ${generatedFilePath}`));
}

export type GenerateOptions = {
    destination?: string;
    language?: string;
}

export default function gene(): void {
    const program = new Command();

    //program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
    //    .version(require('../../package.json').version);

    const fileExtensions = ChessGameLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program
        .command('generate-pgn')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .option('-l, --language <lang>', 'PGN compilation with either Python or JavaScript (currently supported!)')
        .description('generates PGN code')
        .action(generatePGNAction);


    program.parse(process.argv);
}

gene();


