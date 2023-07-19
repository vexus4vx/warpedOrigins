import { create } from 'zustand';

const useStore = create(set => ({
    // for testing
    acceptState: 0,
    setAcceptState: (v) => set(state => ({ acceptState: v })),
    landingMenuSelection: -1,
    showGameWindow: false,
    setLandingMenuSelection: (v) => {
        if(v > 1) set(state => ({ landingMenuSelection: v }))
        else {
            // I need to await and ignore dubble clicks ...
            if(!v) {
                // try load game Data - if no file then prompt user
                // if file - change to game window 
                set(state => ({ showGameWindow: true }))
            }else {
                // change to game window
                set(state => ({ showGameWindow: true }))
            }
        }
    },
    onLoadWorld: () => {
        // check if game data file exists
            // y => call switchGameMode from useStore
                // show Game window with loader in Game area and some fantasy background
                // show frontend huds
                // populate game and display
            // n => tell the user that no game data exists
      
        // skip check if you are creating a new game and overwrite everything on save
      },
      onNewWorld: () => {
        //
      }
}));

export default useStore;