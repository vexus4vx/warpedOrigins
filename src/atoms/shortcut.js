import './atm.css';

export default function Shortcut({children}){
    return typeof children === "string" ? <div className="shortcut">{children}</div> : null;
}