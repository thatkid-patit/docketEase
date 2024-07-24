import { useState, useEffect } from 'react'

function NewUser(props) {

    const [typeNew, setTypeNew] = useState("");
    const [first_nameNew, setFirst_nameNew] = useState("");
    const [last_nameNew, setLast_nameNew] = useState("");
    const [photoNew, setPhotoNew] = useState("");
    const [emailNew, setEmailNew] = useState("");
    const [passwordNew, setPasswordNew] = useState("");
    const [statusNew, setStatusNew] = useState("");
    const [date_createdNew, setDate_createdNew] = useState("");
    const [date_updatedNew, setDate_updatedNew] = useState("");

    const handleAddUser = () => {
        const newUser = {
            type: typeNew,
            first_name: first_nameNew,
            last_name: last_nameNew,
            photo: photoNew,
            email: emailNew,
            password: passwordNew,
            status: statusNew,
            date_created: date_createdNew,
            date_updated: date_updatedNew
        }

        if(first_nameNew.trim() == "" || last_nameNew.trim() == "" || emailNew.trim() == "" || passwordNew.trim() == "") {
            alert("All fields are required!");
            props.onClose();
            alert("Unable to addnew user!");
            return
        }

        if(typeNew == "" ) {
            alert("Please specify the type of user you're adding");
            return
        }

        fetch('http://localhost:8000/users', {
            method: 'POST',
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(newUser)
            })
            .then(() => {
                props.onClose(); 
                console.log("New User Added, refresh to update database!");
            })
            .catch(err => {
                console.log(err.message);
            })
        
    }

    const handleChangeOtherInfo = e => {
        setTypeNew(e.target.value);
        setPhotoNew('https://avatar.iran.liara.run/public');
        setStatusNew('Active');
        setDate_createdNew(new Date());
        setDate_updatedNew(new Date());
    }

    return(
        <>
            <div className="cover">
                <div className="container">
                    <div className="cover-close" onClick={props.onClose}></div>
                    <div className="modal-container user">
                        <div className="input-container">
                            <section className="input-a">
                                <label>First Name:</label><br />
                                <input type="text" placeholder="Enter first name ..." onChange={e => setFirst_nameNew(e.target.value)} value={first_nameNew}/>
                            </section>
                            <section className="input-b">
                                <label>Last Name:</label><br />
                                <input type="text" placeholder="Enter last name ..." onChange={e => setLast_nameNew(e.target.value)} value={last_nameNew}/>
                            </section>
                            <section className="input-c">
                                <label>E-mail:</label><br />
                                <input type="email" placeholder="Enter email ..." onChange={e => setEmailNew(e.target.value)} value={emailNew}/>
                            </section>
                            <section className="input-d">
                                <label>Temp Password</label><br />
                                <input type="text" placeholder="Set temporary password ..." onChange={e => setPasswordNew(e.target.value)} value={passwordNew}/>
                            </section>
                        </div>
                        <div className="input-container-b">
                            <label>User Type:</label><br />
                            <select onChange={handleChangeOtherInfo} value={typeNew}>
                                <option value="">Select ...</option>
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>    
                            </select>
                        </div>
                        <div className="button-user-container">
                            <button className="add-user" onClick={handleAddUser}>Add User</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewUser