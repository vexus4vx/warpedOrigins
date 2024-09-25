
import React from 'react';
import Dropdown from '../atoms/dropdown';
import './gme.css';

// 32
import elfFemale from '../assets/elf2f_0.png';
import elfMale from '../assets/elf1m_0.png';
import humanFemale from '../assets/human1f_0.png';
import humanMale from '../assets/human1m_0.png';
import vulpinFemale from '../assets/vulpin1f_0.png';
import vulpinMale from '../assets/vulpin1m_0.png';
import foxkinFemale from '../assets/foxkin1f_2.png';
import foxkinMale from '../assets/foxkin1m_1.png';
import seaElfFemale from '../assets/seaElf1f_0.png';
import seaElfMale from '../assets/seaElf1m_0.png';
import danaieyFemale from '../assets/danaiey1f_0.png';
import danaieyMale from '../assets/danaiey1m_0.png';
import drogeFemale from '../assets/droge1f_3.png';
import drogeMale from '../assets/droge1m_0.png';
import fenrikFemale from '../assets/fenrik1f_0.png';
import fenrikMale from '../assets/fenrik1m_0.png';
import flutterlingFemale from '../assets/flutterling1f_0.png';
import flutterlingMale from '../assets/flutterling1m_0.png';
import korbisFemale from '../assets/korbis1f_4.png';
import korbisMale from '../assets/korbis1m_0.png';
import mosslingFemale from '../assets/mossling1f_0.png';
import mosslingMale from '../assets/mossling1m_0.png';
import forestNymphFemale from '../assets/forestNymh1f_0.png';
import forestNymphMale from '../assets/forestNymh1m_0.png';
import lamiaFemale from '../assets/lamia1f_0.png';
import lamiaMale from '../assets/lamia1m_0.png';
import merfolkFemale from '../assets/merfolk1f_0.png';
import merfolkMale from '../assets/merfolk1m_0.png';
import tharanthosFemale from '../assets/tharanthos1f_0.png';
import tharanthosMale from '../assets/tharanthos1m_0.png';
import dryadFemale from '../assets/dryad1f_0.png';
import elvenCity0 from '../assets/locations/elvenCity0.png';
import { Button } from '@mui/material';
import { ReadFileData } from '../io/fileIO';
//

export default function () {
    const [disply, setDisply] = React.useState('');

    return <div className='max column padded' style={{backgroundColor: 'oldlace'}}>
        Admin Screen here ...
        I'm just gona make this as I go so deal with it.
        <Dropdown onChange={(a) => setDisply(a)} obj={{map: 'Map_Creation'}} />
        {disply === 'map' ? <MapCreation /> : ''}
    </div>
}

function MapCreation () {
    const [img, setImg] = React.useState('');
    const [imgArr, setImgArr] = React.useState([]);

    const createCollage = () => {
        // get info from images ...

        console.log({imgArr}, typeof(imgArr[0])) // img Count


        return null
    }

    return <div className='max column homeImg' style={{backgroundImage: `url(${img})`}}>
        Map_Creation
        <Button><ReadFileData set={(v) => setImgArr([...imgArr, v])} mimeType='.png'/></Button>


        <Button onClick={() => createCollage()}>make image collage</Button>
        <Button>blur collage</Button>
        <Button>save</Button>
    </div>
}