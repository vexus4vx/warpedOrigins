# Components Required
    Menu with Navigation options - navigate to bases, close locations, portals and dungeions
    Toolbar with Menu Options and displayed current location / action display, also a pause button and an action required button
        - menu options : navigate to, Save, units in location, exit, world map (opens world map component - has explore option), set up base, 
    unit menu - view and edit jobs (main and sub), spouse/s, children, familly tree (3 generations), location (based and current - [city, locationInCity](for based)), stats, personallity, age, name, 


## Atoms
        Menu Button

## Molecules
        Menu
            - save Game
            - current location Name
            - world map

## Organisms
        Toolbar

## Templates

## Pages


# Functionallity required
## Architecture

## Game
- on start
    background (some nice bright fantasy like background)
    lore - You are a higher being comeing to this realm to watch over it's inhabitants and guide them to a better future
    LoadGame, newGame - or do I just load ??? - maybe some credentials ...

- onLoadGame
    I could have a ton of stuff here like a full ?km**2 world but thats too much ...
    so lets go with a segmented approach
    we will see our home base
        each base should have a set space to place items (3d - isometric - 6 hex area ?) 
            - this will allow individual development
            items available to build ... - handle this somehow
        - in the menu we should be able to navigate to other bases
        - in the menue we should see the base Name
        - bases may be invaded and destroyed 
        - citizens may be captured etc

### Create a base
1: select world map in the menu
2: select rations / luggage / horses / cart / etc
3: select units to be part of the expedition
4: select items for each unit
5: select location on world map
6: select start expidition
7: once location is reached you will be notified an expedition log exists - depending on how far it is away it will take a while to get there - calculated based on equipment taken ets, things logged will be materials / units discovered and camped etc (we won't show them marching - calculate journey log on start expidition and notify you on combat and on reach location)
if you are attacked you will get a popup notification either x it (auto battle) or go to location battle it out and decide what to do - contingue journey, go back (new journey log calculated) or set up base (from menu)
8: select setup base from menu (will add location to accessable locations)

### Place items
1: houses, trees, walls, fences, magic formations, etc
2: assign a function to houses (farm - house - [workshop](type))
- for a workshop some types may be used by the same craftsmen (
    a smithey will not be usable by a cook but a cook and a baker may use the same location
)

### Regents and craftsmen
every city needs a regent (City Lord) but only the Main base has a king if the main Base were to be enialated then one of them would be selected to be the new king
every unit in a base will be effected by the regent who oversees taxation

you need to assign each unit their job [Farmer-Regent-Hunter-Warrior-Baker-Laborour-etc](one of these)
each job will have certian requirements 
    - Baker / Cook - Bake / cook - produce food
        relies on Supplies from Farmer or stored supplies
    - Farmer - Tend to Crops
        each farmer will focus on certian crops (a range) - breeding new fauna requires some study time

a craftsman will need either a house(of their own or where the current head has the same job as them) or a workshop which is designated the type that they require (based on their main job)

a Craftmans Children will inherret their Parents Proffesions unless you go to the unit menu and assign them a different job

example : 
    you marry 2 units with jobs they have children - their children will have either of their jobs unless the jobs farmer or regent are among the 2 farmer will only beget farmer, regent will beget the sub job aristocrat to the child and you will be prompted to select a job for them

example : 
    you marry farmer to any job - since farmer is special the married party will take on the sub job farmer unless they have the job farmer they have children whill then have the job farmer
    you want to make one of them a worrier or maybe a baker - (you need a menu for this)
    select change job in menu
    select a new job
    their old job will now become their sub job with an asterix
    you will need to appoint a workshop for them

only regents have a family name - a new regent must be selected from the regens bloodline faviouring the male side

- a sub job will determine the units productivity along with their main job the time of year etc
- units that are not assigned a craftmanship base (farm - house - workshop) will take on the Laborour sub job unless they have the Regent job 

personallity will influence actions like remarieing etc

#### Workshops, training areas, farms and house limits

a farm needs a designated area you can add this area (the larger it is the more Farm Houses you require) and the more personel
- farm size may be in/decreased at any time
- adding a house on an area designated as part of the farm allows you to add it to current owners property list
- fruit trees on a farms property will add to their products
- feilds need to be designated on a farms property
- to keep animals fences need to be made before they can be kept

when a farm / house reaches its max capacity units can no longer be married to males in this house

Workshops have designated types which allows units to work there 
a unit will need to be logged in the workshop until its max capacity is achieved at which point its efficiency will decrease
when a unit dies, joins another workshop or leaves on an expedition the limit is temperarilly or permanently decreased

training areas will require some land around them - the more the better up to a certian limmit once the limit is reached training efficiency reduces

### Battle 
a unit may be captured during battle 
a units weapon proficiency will increase over its life 
a unit killed during battle is considered dead

depending on the weapons carried and a units proficiency therin their combat power changes

weapons may be devided into meele, ranged, intermediate and special

contingious battle will stress units physically and mentally

when units are on a journey they may be injured and die after the battle

### items
items may be crafted if the materials to craft them are available


# name game - suggestions follow
watchers oddesy