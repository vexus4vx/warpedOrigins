import { MenuButton2 } from '../atoms/button';
import './mol.css';

export function Confirmation({children, onReject, onConfirm}){
    return <div className='max overall'>
        <div className='max confirmationPopup'/>
        <div className='confirmationPopupInner'>
            <div className='max confirmationWindow'>
                <div className='conformationText' children={children}/>
                <div className='confirmationButtons'>
                    <MenuButton2 className={'buttonStyle'} onClick={() => onConfirm()} children={'Confirm'} />
                    <MenuButton2 className={'buttonStyle'} onClick={() => onReject()} children={'Cancel'}/>
                </div>
            </div>
        </div>
    </div>
}