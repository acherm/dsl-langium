import { describe, expect, test } from 'vitest';

import type { Game } from '../language/generated/ast.js';

import { AstNode, EmptyFileSystem, LangiumDocument } from 'langium';
import { parseDocument } from 'langium/test';
import { createChessGameServices } from '../language/chess-game-module.js';

const services = createChessGameServices(EmptyFileSystem).ChessGame; 

describe('Test basic game', () => {
    test('Two moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        e2 e4
        e7 e5
        `)
        expect(game.whitePlayer).toBe("INSA INFO5");
        expect(game.moves.length).toBe(2);
    });

    test('Two spoken moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        P e2 e4
        pawn e7 e5
        `)
        expect(game.whitePlayer).toBe("INSA INFO5");
        expect(game.moves.length).toBe(2);
    });

    test('Two spoken moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        Pe2 e4
        knight g8 f6
        `)
        expect(game.whitePlayer).toBe("INSA INFO5");
        expect(game.moves.length).toBe(2);
    });


   
});


describe('Test illegal games', () => {
    test('Illegal piece (Knight vs knight)', async () => {
        await assertModelErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        Knight g1 f3
        d7 d5
        `)
    });

    test('Illegal piece (Knight vs knight)', async () => {
        await assertModelErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT
        
        g1 f3
        d7 d5
        `)
    });
});



async function assertModelNoErrors(modelText: string) : Promise<Game> {
    var doc : LangiumDocument<AstNode> = await parseDocument(services, modelText)
    const db = services.shared.workspace.DocumentBuilder
    await db.build([doc], {validation: true});
    const model = (doc.parseResult.value as Game);
    expect(model.$document?.diagnostics?.length).toBe(0);
    return model;    
}

async function assertModelErrors(modelText: string) {
    var doc : LangiumDocument<AstNode> = await parseDocument(services, modelText)
    const db = services.shared.workspace.DocumentBuilder
    await db.build([doc], {validation: true});
    const model = (doc.parseResult.value as Game);
    expect(model.$document?.diagnostics?.length).toBeGreaterThan(0);  
}
