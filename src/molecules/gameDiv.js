import divBorder from '../assets/misc/divBorder.gif';
import './mol.css';

export default function GameDiv({children, scale = ''}){

    return <div className="body dark-background">
        <div className="outerBorder">
            <div className="midBorder">
                <div className="innerBorder">
                    <div className='display'>
                        {children}
                    </div>
                    <img className={`corner-decoration cornerLeftTop${scale}`} src={divBorder}></img>
                    <img className={`corner-decoration cornerRightTop${scale}`} src={divBorder}></img>
                    <img className={`corner-decoration cornerRightBottom${scale}`} src={divBorder}></img>
                    <img className={`corner-decoration cornerLeftBottom${scale}`} src={divBorder}></img>
                </div>
            </div>
        </div>
    </div>
}