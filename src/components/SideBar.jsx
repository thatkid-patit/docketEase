import { Link } from 'react-router-dom';
import { useResolvedPath, useMatch } from 'react-router-dom';
import BurgerMenu from './partials/BurgerMenu';

function SideBar(props) {

    const ListAnchor = ({to, children}) => {
        const resolvedPath = useResolvedPath(to);
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
        return(
            <li className={isActive ? "active side-menu" : "side-menu"}>
                <Link to={to} >{children}</Link>
            </li>
        );
    };

    const signOut = () => {
        props.onClose();
        window.location.pathname = "/";
    }
    
    return(
        <>
            <div className="sidebar">
                <div className="user-container">
                    <Link to={`/account/settings/${props.USER_INFO.first_name}/${props.USER_INFO.last_name}/edit`}><img src={props.USER_INFO.photo} alt="Profile Picture" /></Link>
                    <div className="user-info">
                        <h5>{props.USER_INFO.first_name} {props.USER_INFO.last_name}</h5>
                        <p><i>{props.USER_INFO.type}</i></p>
                    </div>
                </div>
                <ul className="side-items">
                    <ListAnchor to="/"><i className="icon-tasks"></i>My Tasks</ListAnchor>
                    <ListAnchor to="/important" ><i className="icon-exclamation-sign"></i>Important</ListAnchor>
                    <ListAnchor to="/started" ><i className="icon-folder-open"></i>Started</ListAnchor>
                    {props.USER_INFO.type == "Admin" ? <ListAnchor to="/assigned" ><i className="icon-pushpin"></i>Assigned</ListAnchor> : <></>}
                    <ListAnchor to="/completed" ><i className="icon-check-sign"></i>Completed</ListAnchor>
                    {props.USER_INFO.type == "Admin" ? <ListAnchor to="/my_team" ><i className="icon-group"></i>My Team</ListAnchor> : <></>}
                </ul>
                <button onClick={signOut}>Sign Out<i className="icon-signout"></i></button>
            </div>
            <BurgerMenu/>
        </>
    );
}

export default SideBar