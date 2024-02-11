import divBorder0 from '../assets/misc/divBorder0.gif';
import divBorder1 from '../assets/misc/divBorder1.gif';
import divBorder2 from '../assets/misc/divBorder2.gif';
import divBorder3 from '../assets/misc/divBorder3.gif';
import divBorder4 from '../assets/misc/divBorder4.gif';
import divBorder5 from '../assets/misc/divBorder5.gif';
import divBorder6 from '../assets/misc/divBorder6.gif';
import './mol.css';

export default function GameDiv({children, scale = '', clip = [], type, style}){
    const deco = type === 1 ? divBorder1 : type === 2 ? divBorder2 : type === 3 ? divBorder3 : type === 4 ? divBorder4 : type === 5 ? divBorder5 : type === 6 ? divBorder6 : divBorder0;

    return <div className="body dark-background" style={style}>
        <div className="outerBorder">
            <div className="innerBorder">
                <div className='max'>
                    {children}
                </div>
                {clip.includes('tl') ? null : <img className={`corner-decoration cornerLeftTop${scale}`} src={deco} />}
                {clip.includes('tr') ? null : <img className={`corner-decoration cornerRightTop${scale}`} src={deco} />}
                {clip.includes('br') ? null : <img className={`corner-decoration cornerRightBottom${scale}`} src={deco} />}
                {clip.includes('bl') ? null : <img className={`corner-decoration cornerLeftBottom${scale}`} src={deco} />}
            </div>
        </div>
    </div>
}