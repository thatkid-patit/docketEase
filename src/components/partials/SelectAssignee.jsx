import React, { useState, useEffect } from 'react'

function SelectAssignee() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('src/data/db.json')
            .then(res => res.json())
            .then(jsonData => setUsers(jsonData.users))
    }, [])

    return(
        <>
            <label>Assign to Others?</label>
            <select name="select-assignee" id="select-assignee">
                <option value="">Select an Assignee</option>
                {users.map(user => <option value={user.id} key={user.id}>{user.first_name} {user.last_name}</option>)}
            </select>
        </>
    );
}

export default SelectAssignee