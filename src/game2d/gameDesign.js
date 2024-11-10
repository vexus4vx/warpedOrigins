/*
    this file is for designing the / any game
*/


// saveing - we should create an object and save it to a json file - this way we simply need to load it into existance
const LoadGame = () => {
    // required
}
const SaveGame = () => {
    // required
}

const TheGame = ({world, ...props}) => {
    // like every part of it 
    /*
        world is the map we are playing on
            1: elevation: at minimum this should include a heightMap or relative function with seed
                1.0: climate (a set description of the weather, heat, humidity forever in this region)
                    should follow from height, soil composition and location
                1.1: terrain (soil type + current like wet, dry, warm, cold -- kinda like the weather on the day)
                    should follow from height and location + climate / seasons
            2: interactivity: ie an algorithm where a manipulation to a set of constants causes permanent change
                this amounts to digging a hole or manually changeing the preset terrain or weather effects on terrain
                basically this is constant change in the environment 
                like a neural net where you randomly spawn the input weights and biases
                and then edit them one by one to cause obvious changes in the environment
                - this is a kinda back burner thing for now
            3: flora: procedurally spawned based on climate, allow for interaction
            4: fauna: procedurally spawned based on climate, allow for interaction
                link to flora
    */
}

const TheRules = ({...props}) => {
    // that which gives order to actions
    /*
        the rules are specific to what the player can do and what the units may do
            1: skills and genes
                these need to be dynamically created by user or units
            2: harvesting - unit to world interaction
                how units interact with the world
            3: social - unit to unit interaction (fighting also counts here)
                how units interact between each other
            4: control - user to unit interaction
                how the user affects the units
    */
}


/*

    what if we make a game class that handels the basics of interaction and plays on data we load into the game ?


    initially I want the following
    1: an explanation of the game
    2: Load, settings, exit and new Game options - this should be kinda in your face

        3: New Game
            1: carackter creation 
                this is not limited to playable charackters visual appearance
                it could be something like choosing a race or bonuses you want to play with
                this should have a default or random option for lazy people who will inevitably be screwed by their lack of patience at this point
            2: gameplay
                we need a clear description of objectives along with an introduction to the various options
            3: auxilary
                we need some auxilary mechanisms that speed up and allign processes
*/