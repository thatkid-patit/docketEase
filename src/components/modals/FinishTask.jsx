import React, { useState, useEffect } from 'react'

function FinishTask(props) {

    const [currCard, setCurrCard] = useState(null);
    const [currAuthor, setCurrAuthor] = useState(null);
    const [currAssignee, setCurrAssignee] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    const [users, setUsers] = useState(null);

    useEffect(() => {
        const abortConst = new AbortController();

        fetch('http://localhost:8000/tasks/' + props.CARD_INFO.id, {signal: abortConst.signal})
            .then(res => {
                if(!res.ok) {
                    throw Error("Could not get 200 ok response from tasks!");
                }
                return res.json();
            })
            .then(jsonData => {
                setCurrCard(jsonData);
            })
            .catch(err => {
                console.log(err.message);
            })

            fetch('http://localhost:8000/users/', {signal: abortConst.signal})
            .then(res => {
                if(!res.ok) {
                    throw Error("Could not get 200 ok response from users!");
                }
                return res.json();
            })
            .then( jsonData => {
                const author = jsonData.find( user => { 
                    return props.CARD_INFO.author == user.id
                })
                const assignee = jsonData.find( user => { 
                    return props.CARD_INFO.assignee == user.id
                })
                setCurrAuthor(author);
                setCurrAssignee(assignee);
                setUsers(jsonData);
            })
            .catch(err => {
                console.log(err.message);
            })


    }, []);

    useEffect(()=> {
        if(currCard == null) return;
        if(props.USER_INFO.id == currCard.assignee) setCurrCard(c => ({...c, type: "Own"}));
        if(props.USER_INFO.id !== currCard.assignee) setCurrCard(c => ({...c, type: "Assigned"}));
    }, [currAssignee]);

    useEffect(() => {
        if(!isChanged) {
            return
        }

        fetch('http://localhost:8000/tasks/' + props.CARD_INFO.id, {
            method: 'PUT',
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(currCard)
        })
        .then(() => {
            setIsChanged(false);
            props.onClose();
            console.log("Changes have been saved!")
        })
        .catch(err => {
            console.log(err.message)
        })

    }, [isChanged]);
    
    const displayDate = data => {
        let date = new Date(data);
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    };

    const notAdmin = () => {
        if(currCard == null) return

        if(props.USER_INFO.type !== "Admin")
        return {
            display: "none"
        }

        if(props.USER_INFO.id !== currCard.author)
        return {
            display: "none"
        }
    }

    const notAuthor = () => {
        if(props.USER_INFO.id !== currCard.author)
        return {
            display: "none"
        }
    }

    const handleChangeTitle = e => {
        if(props.USER_INFO.id !== currCard.author) return;
        setCurrCard(c => ({...c, title: e.target.value, date_updated: new Date()}))
    }

    const handleChangeDetails = e => {
        if(props.USER_INFO.id !== currCard.author) return;
        setCurrCard(c => ({...c, details: e.target.value, date_updated: new Date()}))
    }

    const handleChangeAssignee = e => {
        setCurrCard(c => ({...c, status: "Incomplete", assignee: e.target.value, date_assigned: new Date(), date_updated: new Date()}));
        setCurrAssignee(c => ({...c, id: e.target.value}))
    }

    const handleClickCoverClose = () => {
        if(currCard == null) {
            setIsChanged(false);
            props.onClose();
            return
        }

        setIsChanged(true);
    }

    const handleClickFinish = () => {
        setCurrCard(c => ({...c, status: "Completed", date_updated: new Date()}));
        setIsChanged(true);
    }

    return(
        <>
            <div className="cover">
                <div className="container">
                    <div className="cover-close" onClick={handleClickCoverClose}></div>
                    <div className="modal-container">
                        <section className="dates">
                            <h4>Due on {currCard && displayDate(currCard.due_date)}</h4>
                            <div className="dates-other">
                                <p>Created by {currAuthor && currAuthor.first_name} {currAuthor && currAuthor.last_name} on {currCard && displayDate(currCard.date_created)}</p>
                                <p>Assigned to {currAssignee && currAssignee.first_name} {currAssignee && currAssignee.last_name} on {currCard && displayDate(currCard.date_assigned)}</p>
                                <p>Updated last {currCard && displayDate(currCard.date_updated)}</p>
                            </div>
                        </section>
                        <textarea type="text" className="h3" placeholder="Title ..." rows="1" defaultValue={currCard && currCard.title} onChange={handleChangeTitle}></textarea>
                        <textarea type="text" className="h5" placeholder="Details ..." rows="8" defaultValue={currCard && currCard.details} onChange={handleChangeDetails}></textarea>
                        <div className="check-important" style={currCard && notAuthor()}>
                            <select defaultValue={currCard && currCard.tag} onChange={e => setCurrCard(c => ({...c, tag: e.target.value, date_updated: new Date()}))}>
                                {currCard && currCard.tag !== "Normal"  ?   <><option value="Important">Important</option>
                                                                            <option value="Normal">Normal</option></>
                                                                        :   <><option value="Normal">Normal</option>
                                                                            <option value="Important">Important</option></>}
                            </select>
                        </div>
                        <div className="select-date">
                            <label style={currCard && notAuthor()}>Change Due Date</label>
                            <input type="date" onChange={e => setCurrCard(c => ({...c, due_date: e.target.value, date_updated: new Date()}))} style={currCard && notAuthor()}/>
                        </div>
                        <section className="select-button">
                            <div className="assign">
                                <label style={notAdmin()}>Re-Assign to Others?</label>
                                <select name="select-assignee" id="select-assignee" onChange={handleChangeAssignee} style={notAdmin()}>
                                    <option defaultValue={currCard && currCard.assignee}>Select an Assignee</option>
                                    {users && users.map(user => <option value={user.id} key={user.id}>{user.first_name} {user.last_name}</option>)}
                                </select>
                            </div>
                            <div className='replacement'></div>
                            {currCard && currCard.assignee ===  props.USER_INFO.id  ? <button className="finish" onClick={handleClickFinish}>Finish Task</button>
                                                                                    : <></>}
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FinishTask