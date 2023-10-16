import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { PollSystemLanguageMetaData } from '../language/generated/module.js';
import { createPollSystemServices } from '../language/poll-system-module.js';
import { extractAstNode } from './cli-util.js';
import { generateHTML } from './generator.js';
import { NodeFileSystem } from 'langium/node';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createPollSystemServices(NodeFileSystem).PollSystem;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateHTML(model, fileName, opts.destination);
    console.log(chalk.green(`HTML code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    // program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
       // .version(require('../../package.json').version);

    const fileExtensions = PollSystemLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates HTML that prints the poll system model')
        .action(generateAction);

    program.parse(process.argv);
}
