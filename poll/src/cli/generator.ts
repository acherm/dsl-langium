import type { Model } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

export function generateHTML(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.html`;

    const fileNode = new CompositeGeneratorNode();
    // fileNode.append('"use strict";', NL, NL);
    // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.ref?.name}!');`, NL));
    fileNode.append(`<html><body>`);
    model.polls.forEach(poll => {

        poll.questions.forEach(question => {
            fileNode.append(`<h2>${question.text}</h2>`, NL);
            fileNode.append(`<ul>`, NL);
            question.options.forEach(option => {
                fileNode.append(`<li>${option.text}</li>`, NL);
            });
            fileNode.append(`</ul>`, NL);
        });

    });
    fileNode.append(`</body></html>`, NL);

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}
