import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BurgerMenu from "../partials/BurgerMenu.jsx";
import CardFiller from '../partials/CardFiller.jsx';
import ScrollTop from '../partials/ScrollTop.jsx';
import NewUser from '../modals/NewUser.jsx';

function MenuMyTeam(props) {

    const [users, setUsers] = useState([]);

    const [newUserIsOpen, setNewUserIsOpen] = useState(false);

    useEffect(() => {
        fetch('src/data/db.json')
            .then(res => res.json())
            .then(jsonData => {
                if(props.USER_INFO.type !== "Admin") {
                    setUsers([]);
                }else{
                    setUsers(jsonData.users);
                }
            })
    }, []);

    const displayDate = data => {
        let date = new Date(data);
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    };

    return(
        <>
            <div className='plus' onClick={() => setNewUserIsOpen(true)}>
                <i className="icon-plus" ></i>
            </div>
            <div className="page">
                <div className="title-container">
                    <h3>My Team</h3>
                </div>
                <div className="card-container">

                    {users.sort((a, b) => {
                        if(a.first_name > b.first_name) return 1
                        if(a.first_name < b.first_name) return -1
                    })
                    .map(user => 
                        <div className="card card2"  key={user.id}>
                        <div className="user-container">
                            <img src={user.photo} alt="User Profile" />
                            <div className="user-info">
                                <h3>{user.first_name} {user.last_name}</h3>
                                <p>{user.type}</p>
                            </div>
                        </div>
                        <div className="other-info">
                            <p>Status: {user.status}</p>
                            <p>User account created on {displayDate(user.date_created)}</p>
                        </div>
                        {props.USER_INFO.id !== user.id ? <button><i><Link to={`/assigned/tasks/${user.first_name}/${user.last_name}/${user.id}`}>View assigned tasks ...</Link></i></button> : <></>}
                        
                        <h5>Updated Last {displayDate(user.date_updated)}</h5>
                        </div>
                    )}
                    <div className='card card-plus' onClick={() => setNewUserIsOpen(true)}>+</div>
                    {newUserIsOpen ? <NewUser onClose={() => setNewUserIsOpen(false)} USER_INFO={props.USER_INFO}/> : <></>}
                    <CardFiller/>
                </div>
            </div>
            <BurgerMenu/>
            <ScrollTop/>
        </>
    );
}

export default MenuMyTeam