import React, { useState, useEffect } from 'react';
import BurgerMenu from "../partials/BurgerMenu.jsx";
import CardFiller from '../partials/CardFiller.jsx';
import NewTask from '../modals/NewTask.jsx';
import FinishTask from '../modals/FinishTask.jsx';
import ScrollTop from '../partials/ScrollTop.jsx';

function MenuStarted(props) {

    const [tasks, setTasks] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [card, setCard] = useState(null);

    const [newTaskIsOpen, setNewTaskIsOpen] = useState(false);
    const [finishTaskIsOpen, setFinishTaskIsOpen] = useState(false);

    useEffect(() => {
        const abortConst = new AbortController();

        fetch('src/data/db.json', {signal: abortConst.signal})
            .then(res => {
                if(!res.ok) {
                    throw Error("Could not get 200 OK response");
                }
                return res.json();
            })
            .then(jsonData => {
                const data = jsonData.tasks.filter(task => task.status == "Started" && task.assignee == props.USER_INFO.id);
                setTasks(data);
                setIsFetching(false);
            })
            .catch(err => {
                if(err.name === 'AbortError') {
                    console.log("Fetch Aborted");
                }else{
                    setIsFetching(false);
                    setError(err.message);
                }
            });

            return () => abortConst.abort();
    }, [newTaskIsOpen, finishTaskIsOpen, isDeleting]);

    const styles = {
        backgroundColor: "#264b96",
        color: "#ffffff"
    }

    const displayDate = data => {
        let date = new Date(data);
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    };

    const handleDeleteTask = id => {
        setIsDeleting(true);
        fetch('http://localhost:8000/tasks/' + id, {
            method: 'DELETE'
        })
        .then(() => {
            setIsDeleting(false);
            alert("Card has been deleted successfully!");
        })
    }

    return(
        <>
            <div className='plus'  onClick={() => setNewTaskIsOpen(true)}>
                <i className="icon-plus" ></i>
            </div>
            <div className="page">
                <div className="title-container">
                    <h3>Started Tasks</h3>
                </div>
                <div className="card-container">
                    {error && <div style={{color: "#bf212f"}}>{error}</div>}
                    {isFetching && <div style={{color: "#264b96"}}>Loading ...</div>}
                    {tasks && tasks.sort((a, b) => {
                        let d1 = new Date(a.due_date), d2 = new Date(b.due_date)
                        if(d1 > d2) return 1
                        if(d1 < d2) return -1
                    })
                    .map(task => 
                        <div className="card" key={task.id}>
                            <div className='top-mid'>
                                <section className="top">
                                    <div className="status-container">
                                        <p className="status" style={styles}>{task.status}</p>
                                         {task.tag !== "Normal" ? <i className="icon-exclamation"></i> : null}
                                    </div>
                                    {props.USER_INFO.id == task.author ? <i className="icon-trash" onClick={() => handleDeleteTask(task.id)}></i> : <></>}
                                </section>
                                <section className="mid" onClick={() => {
                                                                setCard(task);
                                                                setFinishTaskIsOpen(true);
                                                            }}>
                                    <h3>{task.title}</h3>
                                    <p>{task.details}</p>
                                </section>
                            </div>
                            <section className="bot">
                                <div className="date-container">
                                    <i className="icon-flag"></i>
                                    <p>{displayDate(task.due_date)}</p>
                                </div>
                            </section>
                        </div>
                    )}
                    {tasks && tasks.length === 0 ? <div className='card card-plus' style={{textAlign: "center"}}>Folder Empty</div> : <></>}
                    {tasks && <CardFiller LENGTH={tasks.length}/> }   
                    {newTaskIsOpen ? <NewTask onClose={() => setNewTaskIsOpen(false)} USER_INFO={props.USER_INFO}/> : <></>}
                    {finishTaskIsOpen ? <FinishTask onClose={() => setFinishTaskIsOpen(false)} CARD_INFO={card} USER_INFO={props.USER_INFO}/> : <></>}
                </div>                
            </div>
            <BurgerMenu/>
            <ScrollTop/>
        </>
    );
}

export default MenuStarted