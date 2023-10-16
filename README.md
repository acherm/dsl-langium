# Some experiments and demonstrators of domain-specific languages in Langium 

The DSLs have been used in the past mostly for educational purpose (see eg https://github.com/FAMILIAR-project/HackOurLanguages-SIF or https://github.com/acherm/teaching-MDE-MIAGE1718), and originally in Xtext since something like 2012. 
Here is the list of DSLs:
 * poll: basic grammar, some examples, and a transformation to HTML 
 * VideoGenerator: basic grammar 
 * Chess:
   * based on the old tutorial of Xtext in 2009 (https://www.slideshare.net/HeikoB/xtext-at-eclipse-democamp-london-in-june-2009)  
   * implementation of two compilers (Python with https://python-chess.readthedocs.io/en/latest/pgn.html and JS) and an interpreter (JS), together with CLI redefinition to generate with an option to choose the targeted compiler
   * test: how to write unit tests of your grammar and compilers/interpreters, using [vite.js ](https://vitest.dev/)... and even some differential testing for checking the validity of two compilers 
   * TODO: I'd like to display the board with the monaco-editor, leveraging https://github.com/jhlywa/chess.js/blob/master/README.md (the interpreter works nicely, very closed!) 
 * hello-world: some basic experiments 

Langium sounds great but there are missing functionalities or unpleasant user experience:
 * testing framework (the boilerplate of the demonstration with Chess can certainly be systematized and generated in a langium generator
 * CLI bug (needs to be fixed): main is not exposed/imported
 * "ability to generate DSL code from an in-memory data structure like a programmatically constructed AST" basically for model-to-model transformations, and then model-to-text to serialize the model in the original syntax... seems to be on the roadmap: https://www.typefox.io/blog/langium-1.0-a-mature-language-toolkit/ 
 * the "hello-world" automatically generated involves a specific validators and a demonstration of a generator... Unfortunately, when writing your own grammar, you have to fix this.

