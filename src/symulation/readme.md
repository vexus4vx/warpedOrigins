# interface
    provides the user with a way to select, navigate and view
    we are observing from point A and focusing on point B
    for the trigger boundaries we rotate our field of view
    for onDrag we move along - same as on select

    -- so 1 : we need to write the functions that dock into the interface 
        this would be the screen rotation as the main issue and the positional movement as secondary

# World
    the simulated world
    everything here works through magnetic field interactions
    the observed field is what we see in the interface
    ???
    should I split this into 2 dimentions ? 
    light and matter ?
    to begin with I have issues with the 3d part so how to show this ?
    what would the best course of action be ?
## option 1
    3d coordinate world where we have all the locations
## option 2
    3d coordinate world where we have 2 locations
## option 3
    3d coordinate world where we assign mag fields / boxes


# for now
    we simply need to look at something to fix up the interface 
    this does not need to properly conform to any rules
    but we need this to be able to implement some basic zoom, and movement features
    since this can be achieved with our current capabilities lets prioritse this.