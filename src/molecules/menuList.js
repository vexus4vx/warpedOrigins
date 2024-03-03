
import { CityItem } from './menuItems';
import './mol.css';

export default function CityList({arr = [], style}){
    return <div className='max menuList' style={{...style}}>
       {arr.map((obj, k) => <CityItem {...obj} key={k} />)}
    </div>
}