import React, { useState, useEffect } from 'react'

function NewTask(props) {

    const [users, setUsers] = useState(null);

    const [typeNew, setTypeNew] = useState("");
    const [tagNew, setTagNew] = useState("Normal");
    const [statusNew, setStatusNew] = useState("");
    const [titleNew, setTitleNew] = useState("");
    const [detailsNew, setDetailsNew] = useState("");
    const [due_dateNew, setDue_dateNew] = useState("");
    const [authorNew, setAuthorNew] = useState(props.USER_INFO.id);
    const [assigneeNew, setAssigneeNew] = useState(props.USER_INFO.id);
    const [date_createdNew, setDate_createdNew] = useState("");
    const [date_assignedNew, setDate_assignedNew] = useState("");
    const [date_updatedNew, setDate_updatedNew] = useState("");

    useEffect(() => {
        fetch('src/data/db.json')
            .then(res => res.json())
            .then(jsonData => {
                setUsers(jsonData.users);
                setStatusNew("Incomplete");
                setDate_createdNew(new Date());
                setDate_assignedNew(new Date());
                setDate_updatedNew(new Date());
                
            })
    }, [])

    useEffect(() => {
        if(assigneeNew === authorNew) {
            setTypeNew("Own")
            return
        }
        if(assigneeNew !== authorNew) {
            setTypeNew("Assigned");
            return
        }
    }, [assigneeNew])

    const selectAssignee = () => {
        if(props.USER_INFO.type !== "Admin")
        return {
            display: "none"
        }
    }

    const handleCreateTask= () => {
        const newTask = {
            type: typeNew,
            tag: tagNew,
            status: statusNew,
            title: titleNew,
            details: detailsNew,
            due_date: due_dateNew,
            author: authorNew,
            assignee: assigneeNew,
            date_created: date_createdNew,
            date_assigned: date_assignedNew,
            date_updated: date_updatedNew
        }

        if(titleNew.trim() == "" && detailsNew.trim() == "") {
            props.onClose();
            return
        }

        if(due_dateNew == "") {
            alert("Please set a due date for the task!");
            return
        }

        

        fetch('http://localhost:8000/tasks', {
            method: 'POST',
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(newTask)
            })
            .then(() => {
                console.log("New Task Added");
                props.onClose();   
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    return(
        <>
            <div className="cover">
                <div className="container">
                    <div className="cover-close" onClick={props.onClose}></div>
                    <div className="modal-container">
                        <textarea type="text" value={titleNew} className="h3" placeholder="Title ..." rows="1" onChange={e => setTitleNew(e.target.value)}></textarea>
                        <textarea type="text" value={detailsNew} className="h5" placeholder="Details ..." rows="8" onChange={e => setDetailsNew(e.target.value)}></textarea>
                        <div className="check-important">
                            <select value={tagNew} onChange={e => setTagNew(e.target.value)}>
                                <option value="Normal">Normal</option>
                                <option value="Important">Important</option>
                            </select>
                        </div>
                        <div className="select-date">
                            <label >Set Due Date</label>
                            <input type="datetime-local" value={due_dateNew} onChange={e => setDue_dateNew(e.target.value)}/>
                        </div>
                        <section className="select-button">
                            <div className="assign" style={selectAssignee()}>
                                <label>Assign to Others?</label>
                                <select name="select-assignee" id="select-assignee" value={assigneeNew} onChange={e=> setAssigneeNew(e.target.value)}>
                                    <option value={props.USER_INFO.id}>Select an Assignee</option>
                                    {users && users.map(user => <option value={user.id} key={user.id}>{user.first_name} {user.last_name}</option>)}
                                </select>
                            </div>
                            <div className='replacement'></div>
                            <button className="create-task" onClick={handleCreateTask}>Create Task</button >
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewTask