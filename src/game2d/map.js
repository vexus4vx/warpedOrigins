/*
    the world is 2D so lets allow for easy modding
        1: take any png retrieve the pixelData
        2: blur the image by various degrees
        3: use this as your world Map
            for this to work we need
            1: a mod option in the beginning
            2: an interface that takes an image applies the blur and maybe some other alterations + save as optional worldMap option
            each pixelValue should reprisent a height value for the heightMap - alpha channel ? and a terrain type
            1: we need to define terrain / biotope types 
                water
                desert
                rocky
                swamp
                jungle
                snow
                ...
                some things are mutually exclusive say water covering a mountain top
                so if we use the image to get height we will likely grayscale it first and then get an elevation range 
                if the elevation range is from 0 - 85 inclusive, then we can set the sea level at < 42 so maybe 30 or even better
                sea floor: 0
                sea: 0 => 20
                land area: 21 => 70
                floating islands >= 71

                so if in land area we get water we have a lake or river & if on floating island we get water we have a floating lake
                else we could check for the area and choose the biome accordingly
                or we choose the biome first or irespective of height
                all in all this is a game ... - no need for everything to make sence

    so accesing the map needs to incorporate different levels
        abcde
        a - world map coordinate
        b - coordinate in sector a
        c - coordinate in sector b
        d - coordinate in sector c
        e - coordinate in sector d
            area b is an entire world sector
            area c is an entire large area
            area d is a general area - for hunting near you or scouting, c is kind of like in the vicinity
            area e could be quite specific like a city layout

    do we need climate and temperature zones?
        would be better this can allow us to change vegitation in areas without hassle
            aka have all the flora and fauna in an area correspond to the respective initial organism average range
        temperature zones should be based on climate and height above or below sea level

    flora 
        need temperature range 
        a cold hardy or more heat tollerant strain may develop if they exist in a neighbouring tile
        this should be a little difficult but technically possible
        the issue is do we need to keep track of all the abnormal plants ?
        or of all the vegitation ....
        seems like a pain
        1: temp range
        2: humidity range
        3: water requirements ??
        4: fruit - (64)
        5: flower - (64)
        6: leaves - (64) + size
        7: roots - (4) tubers, normal, spreading, bulbs
        8: stems - (32) none to dense

    fauna: similar to flora however since these can be captured and possibly bread this is some bit more difficult
        we need a system that allows population migration and decimation

    units: 
        asside from fauna we have capturable units
        these are races such as humans, elves, ...
        the point being these need to 
            1: all interbreed
            2: form groups depending on their racial and individual tendancies
            3: have a certian amount of self awareness, relationships, memories and base actions on said memories and relationships
                fear of death is needed
                but to emulate choice we need to think of something fancy
                    1: the individual does not need to know everything
                        but its assumed choice must be based on memory emotions and reason
                        reason is easier - we access the memories and evaluate an outcome which the unit deems desirable 
            the player should have 2 options available 
                1: management you try to organise a group of individuals - that is to run the settlement
                2: individual - standard rpg style - just you age and die but the world lives on
*/
function DivisibleMap() {
    // 2 >> 13 = 8192   =>   map is 8192 ** 2  =>   (2 * 16) * (512 ** 2) maps
}

export default (function() {
    /**
     * 2 >> 13 = 8192   =>   map is 8192 ** 2  =>   (2 * 16) * (512 ** 2) maps
     * 
     * @constructor
     * @public
     */
    function WorldMap() {
        this.size = 2 << 12;
        return this;
    }

    /*
        this is going to require 32, 512 * 512 images and will create a map.png file
    */
    WorldMap.prototype.Create = function (arr) {
        /*
            rgba ...
            first combine images 
            then blur them
            this will provide us with a blurred image that we can use as world map
                we will need to know 
                1: elevation
                    2by
                2: temperature group - elevation dependant
                    4b - say hot to cold ... minus 20 to + ?
                3: humidity - from xy location and elevation
                    4b - 0 to 100 so 100 / 16 so increments of 6.25
                4: terrain - swamp - water - forrest - desert - mountain ...
                    1by split into parts
                        1: amount of veretation
                        2: soft ground to sheer rock

                    jungle = humid + high temp + vegitation max + moderatly soft ground
                    desert = dry + high temp + vegitation min + any ground
                    swamp = not low humidity + not low temp + any vegitation + soft ground

            kinda like this for the A map
            B will take the A value at a given point and draw terrain by doing something funkey
            as will C
            D needs to be a little more specific ... like show fauna + flora areas + elevation
            and I suppose city maps just need to be created on the fly ...
        */
       if(arr.length === 32) {
            // create the AMap as aMap.png - this will become easier if I create an apply and create function
       }
    }

    /*
        This will load the map.png file  
    */
    WorldMap.prototype.Load = function () {
        // ...
    }

    return WorldMap;
})();