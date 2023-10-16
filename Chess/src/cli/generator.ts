import type { Game } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
import { convertMovesToPGNWithPython, generateGame} from '../generator/pgn_converter.js';


export function generateJavaScript(model: Game, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    
    fileNode.append('"use strict";', NL, NL);
    fileNode.append(`console.log('White player, ${model.whitePlayer}!');`, NL);
    fileNode.append(`console.log('Black player, ${model.blackPlayer}!');`, NL);
    model.moves.forEach(move => { 
        fileNode.append(`console.log('${move.source} ${move.dest}');`, NL);
        
    });
    
    

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

export function generatePGN(model: Game, filePath: string, destination: string | undefined, language: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.pgn`;

    const fileNode = new CompositeGeneratorNode();
    
    let pgnContent : String = "";
    if (language == "Python")
        (async () => {
            pgnContent = await convertMovesToPGNWithPython(model.moves);
        })();
    else if (language == "JavaScript") { // JavaScript
        pgnContent = generateGame(model);
    }
    else {
        // error
        return "";
    }
    
    fileNode.append(`${pgnContent}`, NL, NL);    

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

export function generatePGNWithPython(model: Game, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.pgn`;

    const fileNode = new CompositeGeneratorNode();
    
    const pgnContent = generateGame(model);
    
    fileNode.append(`${pgnContent}`, NL, NL);    

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}

