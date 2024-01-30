import divBorder from '../assets/misc/divBorder.gif';
import './mol.css';

export default function GameDiv({children, ...props}){

    return <div className="body dark-background">
        <div className="outerBorder">
            <div className="midBorder">
                <div className="innerBorder">
                    <div className='display'>
                        {children}
                    </div>
                    <img className="corner-decoration corner-left-top" src={divBorder}></img>
                    <img className="corner-decoration corner-right-top" src={divBorder}></img>
                    <img className="corner-decoration corner-right-bottom" src={divBorder}></img>
                    <img className="corner-decoration corner-left-bottom" src={divBorder}></img>
                </div>
            </div>
        </div>
    </div>
}