grammar ChessGame

entry Game: "White:" whitePlayer=STRING "Black:" blackPlayer=STRING (moves+=Move)+;

Move: AlgebraicMove | SpokenMove;

AlgebraicMove: (piece=Piece)? source=Square (captures?='x')? dest=Square;

SpokenMove: piece=Piece 'at' source=Square (captures?='captures' capturedPiece=Piece 'at' | 'moves_to') dest=Square;

// regular expression ('a'..'h')('1'..'8');
terminal Square: /[a-h][1-8]/; 

Piece returns string: Piece_PAWN | Piece_KNIGHT | Piece_BISHOP | Piece_ROOK | Piece_QUEEN | Piece_KING;
Piece_PAWN returns string: 'P' | 'pawn';
Piece_KNIGHT returns string: 'N' | 'knight'; // not K, because of King
Piece_KING returns string: 'K' | 'king';
Piece_BISHOP returns string: 'B' | 'bishop';
Piece_QUEEN returns string: 'Q' | 'queen';
Piece_ROOK returns string: 'R' | 'rook';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"[^"]*"/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;