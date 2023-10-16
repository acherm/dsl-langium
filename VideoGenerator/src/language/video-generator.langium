grammar VideoGenerator

entry Model:
    vids+=Video+
    ; 

Video : (Mandatory | Optional | Alternatives); 

Mandatory : 'mandatory' video=VideoSeq;
Optional : 'optional' video=VideoSeq; 

Alternatives : 'alternatives' id=ID '{' 
        videos+=VideoSeq+ 
    '}'; 

VideoSeq : 'videoseq' id=ID location=STRING;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

