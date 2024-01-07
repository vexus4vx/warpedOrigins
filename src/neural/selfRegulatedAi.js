/*

2 neural networks working in opposite ways
- for now lets invert the inputs => ? to 1-?

both networks run

a mediater function
1: changs the learnrate by checking that the current learnrate gives a better result than the previous
2: checks the validity of weights and turns them on and off so that connections that make no impact on the result dissapear
    - so modifies the number of weights and biases in the hidden layers
3: checks the effect of more layers 
    - so turns on or off layers depending on the networks preformance

--- we need max numbers for layers and weight count in hidden layers
-- strict requirements for edits especially when increasing layers
-- no weights that are created get destroyed but some may become obselete


- this should allow our network to self regulate in a fairly fluid way - we need to make it reactive so that it doesn't just grow
- look at gans
- I would prefer a better solution than the inverting of inputs - think about it


*/