import { describe, expect, test } from 'vitest';

import type { Game } from '../language/generated/ast.js';

import { AstNode, EmptyFileSystem, LangiumDocument } from 'langium';
import { parseDocument } from 'langium/test';
import { createChessGameServices } from '../language/chess-game-module.js';
import { convertMovesToPGNWithPython, generateMoves } from '../generator/pgn_converter.js';


const services = createChessGameServices(EmptyFileSystem).ChessGame; 

describe('Test basic game', () => {
    test('Two moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        e2 e4
        e7 e5
        `)
        const pgn_moves = generateMoves(game.moves);
        expect(pgn_moves).toBe("1. e4 e5");
        (async () => {
            const pgn_moves_with_python = await convertMovesToPGNWithPython(game.moves);
            expect(pgn_moves).toBe(pgn_moves_with_python);
        })();
        
    });

    test('Two spoken moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        P e2 e4
        pawn e7 e5
        `)
        const pgn_moves = generateMoves(game.moves);
        expect(pgn_moves).toBe("1. e4 e5");
    });

    test('Two spoken moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        Pe2 e4
        knight g8 f6
        `)
        const pgn_moves = generateMoves(game.moves);
        expect(pgn_moves).toBe("1. e4 Nf6");
    });

    test('Two spoken moves', async () => {
        const game = await assertModelNoErrors(`
        White: "INSA INFO5"
        Black: "ChatGPT"
        
        Pe2 e4
        knight g8 f6
        `)
        const pgn_moves = generateMoves(game.moves);
        expect(pgn_moves).toBe("1. e4 Nf6");
    });

    test('Immortal game', async () => {

        const game = await assertModelNoErrors(`
        White: "Adolf Anderssen"
        Black: "Jean Dufresne"
        
        pawn at e2 moves_to e4 
        pawn at e7 moves_to e5        
        pawn at f2 moves_to f4 
        P at e5 captures pawn at f4 
        bishop at f1 moves_to c4
        queen at d8 moves_to h4
        king at e1 moves_to f1 
        P at b7 moves_to b5
        bishop at c4 captures pawn at b5 
        knight at g8 moves_to f6        
        `);

        const pgn_moves = generateMoves(game.moves);
        expect(pgn_moves).toBe("1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6");
        (async () => {
            const pgn_moves_with_python = await convertMovesToPGNWithPython(game.moves);
            expect(pgn_moves).toBe(pgn_moves_with_python);
        })();
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

