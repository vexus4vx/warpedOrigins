import { MenuButton2 } from '../atoms/button';
import './mol.css';

export function Confirmation({children, onReject, onConfirm}){
    return [
        <div className='confirmationPopup' key='0'/>,
        <div className='confirmationPopupInner' key='1'>
            <div className='confirmationWindow'>
                <div className='conformationText' children={children}/>
                <div className='confirmationButtons'>
                    <MenuButton2 className={'buttonStyle'} onClick={() => onConfirm()} children={'Confirm'} />
                    <MenuButton2 className={'buttonStyle'} onClick={() => onReject()} children={'Cancel'}/>
                </div>
            </div>
        </div>
    ]
}