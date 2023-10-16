import { Game, Move } from '../language/generated/ast.js';

import { Chess } from 'chess.js'

export function generateGame(model: Game): String {
    // PGN header
    let pgn = '[Event "Chess Game"]\n';
    pgn += `[Site "Langium DiverSE INSA"]\n`;
    pgn += `[Date "2023.10.12"]\n`;
    pgn += `[Round "1"]\n`;
    pgn += `[White "${model.whitePlayer}"]\n`;
    pgn += `[Black "${model.blackPlayer}"]\n`;
    pgn += `[Result "*"]\n`;
    pgn += `\n`;

    return pgn + generateMoves(model.moves);
    
}

/*
interpret moves as algebraic moves leveraging the chess.js library
each move is interpreted with the chess.js library
*/
export function generateMoves(moves: Move[]): String {


    const chess = new Chess()

    moves.forEach(move => {

        // let move_str = "";

        let move_str = move.source + "-" + move.dest;

        /*
        if (isAlgebraicMove(move)) {
            // cast move to AlgebraicMove
            const algebraicMove : AlgebraicMove = move;
            // algebraicMove.source;
            move_str = algebraicMove.source + "-" + algebraicMove.dest;
        }
        else if (isSpokenMove(move)) {
            const spokenMove : SpokenMove = move;            
            move_str = spokenMove.source + "-" + spokenMove.dest;
        }
        else {
            // error
        }
        */

        chess.move(move_str); 

        
    });

    return chess.pgn();
}


/*
compile moves to python code ie generate a Python program that plays the game leveraging python-chess library
*/

export function generateMovesWithPython(moves: Move[]): String {

    let python_code = "import chess\n";
    python_code += "import chess.svg\n";
    python_code += "import chess.pgn\n";
    python_code += "import chess.engine\n";

    
    python_code += "board = chess.Board()\n";


    moves.forEach(move => {
        let move_str = move.source + "-" + move.dest;
        python_code += "board.push_san(\"" + move_str + "\")\n";        
    });

    // PGN
    // AttributeError: 'Board' object has no attribute 'pgn'
    python_code += "game = chess.pgn.Game.from_board(board) \n";
    python_code += "print(game)\n";


    return python_code;
}


import { exec } from "child_process";

export async function convertMovesToPGNWithPython(moves: Move[]): Promise<string> {
    const python_code = generateMovesWithPython(moves);
    const PYTHON_INTERPRETER = "python3.8";

    try {
        const result = await new Promise<string>((resolve, reject) => {
            exec(PYTHON_INTERPRETER + " -c '" + python_code + "'", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    reject(`error: ${error.message}`);
                } else if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(`stderr: ${stderr}`);
                } else {
                    console.log(`stdout: ${stdout}`);
                    resolve(stdout as string);
                }
            });
        });
        return result.trim();
    } catch (error) {
        console.log(error);
        return `Error: ${error}`;
    }
}

// Assuming Move type and generateMovesWithPython function are defined elsewhere in your code.
