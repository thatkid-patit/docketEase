import React, { useState, useEffect } from 'react';
import BurgerMenu from "../partials/BurgerMenu.jsx";
import ScrollTop from '../partials/ScrollTop.jsx';

function EditMyInfo(props) {

    const [isChanged, setIsChanged] = useState(false);

    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [currInfo, setCurrInfo] = useState(
        {
            type: props.USER_INFO.type,
            first_name: props.USER_INFO.first_name,
            last_name: props.USER_INFO.last_name,
            photo: props.USER_INFO.photo,
            email: props.USER_INFO.email,
            password: props.USER_INFO.password,
            status: props.USER_INFO.status,
            date_created: props.USER_INFO.date_created,
            date_updated: props.USER_INFO.date_updated
        }
    )

    const handleChangePhoto = e => {
        if(e.target.value.trim() == "") {
            setIsChanged(false); 
            return;
        }
        setCurrInfo(c => ({...c, photo: e.target.value}));
        setIsChanged(true);
    }

    const handleChangeFirstName = e => {
        if(e.target.value.trim() == "") {
            setIsChanged(false); 
            return;
        }
        setCurrInfo(c => ({...c, first_name: e.target.value}));
        setIsChanged(true);
    }

    const handleChangeLastName = e => {
        if(e.target.value.trim() == "")  {
            setIsChanged(false); 
            return;
        }
        setCurrInfo(c => ({...c, last_name: e.target.value}));
        setIsChanged(true);
    }

    const handleChangePasswordNew = e => {
        if(e.target.value.trim() == "")  {
            setIsChanged(false); 
            return;
        }
        setPasswordNew(e.target.value);
    }

    const handleChangePasswordConfirm = e => {
        if(passwordNew == "")  {
            setIsChanged(false); 
            return;
        }
        if(e.target.value.trim() == "")  {
            setIsChanged(false); 
            return;
        }
        setPasswordConfirm(e.target.value);
    }

    useEffect(() => {
        if(passwordNew == "" || passwordConfirm == "") {
            return
        }
        if(passwordNew !== passwordConfirm) {
            return
        }
        setCurrInfo(c => ({...c, password: passwordNew}));
        setIsChanged(true);
        setPasswordNew("");
        setPasswordConfirm("");
    }, [passwordNew, passwordConfirm]);

    const handleClickSaveChanges = () => {
        if(passwordNew !== passwordConfirm) {
            alert("Passwords do NOT macth!")
            setPasswordNew("");
            setPasswordConfirm("");
            setIsChanged(false);
            return
        }

        if(!isChanged) {
            console.log("No changes has been made!")
            setIsChanged(false);
            return
        }

        const verify = prompt("For security purposes, please verify your current password!")

        if(verify !== props.USER_INFO.password) {
            alert("Unable to confirm your identity!");
            alert("You will be logged out!");
            setIsChanged(false);
            window.location.pathname = "/";
            return
        }

        fetch('http://localhost:8000/users/' + props.USER_INFO.id, {
            method: 'PUT',
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(currInfo)
        })
        .then(() => {
            alert("Changes has been saved. You will be logged out!");
            setIsChanged(false);
            window.location.pathname = "/";
        })
        .catch(err => {
            console.log(err.message);
        })

    }
    

    return(
        <>
            <div className="page">
                <div className="title-container">
                    <h3>Account Center</h3>
                </div>
                <div className="edit-my-info-container">
                    <div className="info-box">
                        <div className="change">
                            <section className="input-photo">
                                <label>Enter New Photo URL:</label><br />
                                <input type="url" onChange={handleChangePhoto}/>
                            </section>
                        </div>   
                        <div className="change">
                            <section className="input-first">
                                <label>Change First Name:</label><br />
                                <input type="text" onChange={handleChangeFirstName}/>
                            </section>
                        </div>
                        <div className="change">
                            <section className="input-last">
                                <label>Change Last Name:</label><br />
                                <input type="text" onChange={handleChangeLastName}/>
                            </section>
                        </div>
                        <div className="change">
                            <section className="input-new">
                                <label>New Password:</label><br />
                                <input type="password" onChange={handleChangePasswordNew} value={passwordNew && passwordNew}/>
                            </section>
                        </div>
                        <div className="change">
                            <section className="input-confirm">
                                <label>Confirm New Password:</label><br />
                                <input type="password" onChange={handleChangePasswordConfirm} value={passwordConfirm && passwordConfirm}/>
                            </section>
                        </div>
                        <div className='button-container'>
                            <button onClick={handleClickSaveChanges}>Save Changes</button>
                        </div>

                    </div>
                </div>
            </div>
            <BurgerMenu/>
            <ScrollTop/>
        </>
    )
}

export default EditMyInfo