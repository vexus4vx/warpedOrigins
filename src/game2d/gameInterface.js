import React from 'react';
import { gameStore } from './gameStore';
import { locations } from './locations';
import MenuListComposition from '../organisms/menu';
import { UnitView } from '../game/unitVerse';
import GameDiv from '../molecules/gameDiv';
import './gme.css';
import CityList from '../molecules/menuList';
import { UnitInfo } from '../molecules/menuItems';
import Dropdown from '../atoms/dropdown';

// the info shown in the main Window for the Game
export function InformationWindow() {
    const {selectedTab, settlementNames, settlementData, selectedSettlement} = gameStore(state => {
        return {
            selectedTab: state.selectedTab, 
            settlementNames: state.settlementNames,
            settlementData: state.settlementData,
            selectedSettlement: state.selectedSettlement
        }
    });

    return selectedTab === 'Citizens' ? <Citizens {...{settlementData, selectedSettlement}} /> : 
    selectedTab === 'Facilities' ? <Facilities /> : 
    selectedTab === 'Inventory' ? <Inventory /> : 
    selectedTab === 'Blacksmith' ? <Blacksmith /> : 
    selectedTab === 'Alchimist' ? <Alchimist /> : 
    selectedTab === 'Training Center' ? <TrainingCenter /> : 
    selectedTab === 'Explore' ? <Explore /> : 
    <Settlements {...{settlementData, settlementNames}} />
}

// fake settlement names
const arr1 = [
    'kk2kk',
    'kkk3k',
    'kkkk4',
    '5kkkk',
    'k6kkk',
    'kk8kk',
    'kkk7k',
    'kkk9k',
    '0kkkk',
    'k11kkkdk',
    'kks12dakbadbakkbja',
    'kk23kk',
    'kk122kk',
    'kk3e3kk',
    'kkkk44dk',
    'kksdak56badbakkbja',
    'kkkt54k',
    {name: 'bbbbb', residents: 89, status: 1, captives: 10, visitors: 20}
]

function Settlements({settlementNames, settlementData}) {
    return <div className='max padded column'>
        <div className='dark' style={{height: '120px'}}>
            info on current city

            like name, founded when 
            in jail - why not show jail icon with number on it
            number of facilities ...
            visiting - ...
            residents - ...
            currently in city - ...
            ruler - ...

            so kind of like immutable info ... or a basic overview

            highlight when selected - this will allow view for the detailed info below ...
        </div>
        <div className='max row' style={{marginTop: '10px', height: 'calc(100% - 130px)'}}>
            <div className='cityListWrapper'>
                <CityList arr={arr1}>
                    overflowingList
                    city selection - with high level info
                    so like cityName, number of inhabitants, number of visitors, status (red green ...)
                    arr is to be retrieved from gameStore - from settlementNames or settlements ...
                </CityList>
            </div>
            <div className='dark cityListInfo'>
                cityInfo - detailed
                
                rename 
                construct facilities 
                upgrade facilities ?
                design city ...
                maybe a map with some things on it 
                I think this might be nice ... or bad
                but at least its something to do ...
            </div>
        </div>
    </div>

    /*
          display the settlements in a list
        and display some basic info on the settlement 
        - founded ...
        give option of changeing settlement ...

we need to see all cities 
we want to know their capacity (how many live there)
and if there is some thing going on / action required
the number of units visiting - we should allow units to sneek in ...

give info on current city
    */
}

function Citizens({settlementData, selectedSettlement}) {
    const [units, SetUnits] = React.useState({});
    const [selectedUnit, SetSelectedUnit] = React.useState({});

    React.useEffect(() => {
        const unitsInSettlements = settlementData(selectedSettlement)?.units || []; // will be an object later on
        let obj = {};
        unitsInSettlements.forEach(unit => {
            obj[unit.id] = unit.name;
        });

        SetUnits(obj);
    }, [selectedSettlement]);

    return <div className='max padded column'>
        <div className='row' style={{height: '12%', marginBottom: '5px'}}>
            <Dropdown obj={units} onChange={(k) => SetSelectedUnit(units[k])}/>
            <div style={{fontWeight: 'bold', marginTop: '15px', marginLeft: '40px', fontSize: 30}}>
                {Object.keys(units)?.length ? 'Please Select a unit' : 'No units available'}
            </div>
        </div>

        <div style={{height: '88%'}}>
            <UnitInfo {...{selectedUnit}} />
        </div>
    </div>
}

function Facilities() {
    return <div className='max padded column'>
        this cities facilities,
        houses, farms, workshops, basically all buildings.
        buildings have their own inventory
    </div>
}

function Inventory() {
    return <div className='max padded column'>
        this cities inventory ...
    </div>
}

function Blacksmith() {
    return <div className='max padded column'>
        Blacksmith,
        create blueprints to manifacture
    </div>
}

function Alchimist() {
    return <div className='max padded column'>
        Alchimist,
        create blueprints to manufacture
    </div>
}

function TrainingCenter() {
    return <div className='max padded column'>
        TrainingCenter,
        create skills, that units can learn
    </div>
}

function Explore() {
    return <div className='max padded column'>
        For this lets open up a popup allow the user to select a team of units and 
        Explore
    </div>
}

/* nice background - home ??
    having tons of interfaces is crap so lets prepare some eye candy
    we need a menu - and some visuals + a way to load / save data
    the units need to be sorted into jobs by the user lets ??? or since we picked a vilage starter theme lets auto initialise them ...
    - all races are a tad bit different - ie initially that is
    so foxkin won't have magicians to begin with ... - and some races might all be gatherers

    skill creator
    - skills need 1: time, 2: energy, 3: stamina as their building blocks
    - a skill will be made up of a number of parts 
    - to transition from 1 part to another may take less time - say moving from a punch to an elbow will take less time than a straight elbow from scratch
    - magic skills require energy
    - all skills take time 
    - physical skills take stamina
    - some skills may absorb energy ...
    the sum of the skill parts creates the skill
    counter skills exist

    when A attacks B then 
    they will both use skills
    some are used to attack some to block and some to counter 

    the overall cost of the skill is the time/energy/stamina requirement
    while the effect is dependant on the skills used by both parties in battle and their respective stats - since skills do damage based on stats
    this is especially important for elemental skills

    ...
*/

/*
<div style={{width: 200}}>
            <MenuListComposition menuListStyle={{backgroundColor: 'rgba(80, 80, 80, 0)'}} arr={arr} />
            {/*...
            add menu 
            buttons for ...
            number of inhabitants - click to see 
            facilities - click to see 
            incidents ...
            wheel of time
            actually overlay an absolute menu onto the top menu to make these be on top ...
            assest ...
            ///
            special areas - click in screen to move there ...

            // - gameplay
            1: solve incidents
            2: increase capacity
            3: explore
            4: hunt
            5: assign units to tasks, ocupations ...
            ...
            I also like the idea of magic/energy nature - so like conjurers are bad at emmitter stuff etc
            gota flesh this out
            1: perfect emmitter - put energy into something and (propell it / have it move away from you) without the energy decreasing
                ranged weapons / healers / enchanters / support mage
            2: perfect manipulater - put energy into something to bend it to your will
                summoners / golem users / necromancers
            3: perfect enhancer - multiply power
                attack mage / close range weapon user / martial artist
            4: perfect transmuter - change the form of energy 
                elemental mage / energiser
            5: perfect conjurer - project own intent outward
                illusion master / mind controll user / formation master
            6: perfect absorber - absorb all energy
                anti magic user / frozen user * /}

                </div>
*/


/// ... remove styles and rework
export function Travel({destination}) {
    const {setState} = gameStore(state => ({setState: state.setState}));
    const [loc, setLoc] = React.useState(0);
    const trail = locations[`init${destination}`];

    const onClick = () => {
        if(loc < (trail.length - 1)) setLoc(loc + 1);
        else if(loc === (trail.length - 1)) setState({location: destination})
    }

    return <div style={styles.main}>
        <div onClick={onClick} style={{...styles.main, ...styles.travel, backgroundImage: `url(${trail[loc].loc})`}} />
        <div style={styles.description}>
            {trail[loc].desc}
        </div>
    </div>
}

const styles = {
    main: {
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
    },
    travel: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: "contain",
        backgroundPosition: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    description: {
        position: 'absolute',
        width: '20%',
        height: '50%',
        color: 'red',
        left: '3%'
    },
    window: {
        backgroundColor: 'rgba(120, 120, 120, 0.9)',
        width: '70%',
        marginTop: '5%',
        height: '80%',
        border: 'solid',
        borderWidth: 10,
        borderRadius: 5,
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        overflowY: 'auto'
    },
    windowTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20
    }, 
    windowBody: {
        marginBottom: 10
    }
}