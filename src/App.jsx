import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn.jsx';
import SideBar from './components/SideBar.jsx';
import MenuAllTasks from './components/sidebar_pages/MenuAllTasks.jsx'
import MenuImportant from './components/sidebar_pages/MenuImportant.jsx';
import MenuStarted from './components/sidebar_pages/MenuStarted.jsx';
import MenuAssigned from './components/sidebar_pages/MenuAssigned.jsx';
import MenuCompleted from './components/sidebar_pages/MenuCompleted.jsx';
import MenuMyTeam from './components/sidebar_pages/MenuMyTeam.jsx';
import AssignedTasks from './components/other_pages/AssignedTasks.jsx';
import EditMyInfo from './components/other_pages/EditMyInfo.jsx';

function App() {

  const [isLoggedOn, setIsLoggedOn] = useState(false);

  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  if(isLoggedOn) {
    document.querySelector("body").style.justifyContent = "space-between";

    return(
      <>
        <div className="sidebar-container">
          <SideBar onClose={() => setIsLoggedOn(false)} USER_INFO={userInfo}/>
        </div>
        <div className="page-container">
          <Routes>
            <Route path={`/account/settings/${userInfo.first_name}/${userInfo.last_name}/edit/`} element={<EditMyInfo USER_INFO={userInfo} />} />
            <Route path="/" element={<MenuAllTasks USER_INFO={userInfo} />} />
            <Route path="/important" element={<MenuImportant USER_INFO={userInfo}/>} />
            <Route path="/started" element={<MenuStarted USER_INFO={userInfo}/>} />
            <Route path="/assigned" element={<MenuAssigned USER_INFO={userInfo}/>} />
            <Route path="/completed" element={<MenuCompleted USER_INFO={userInfo}/>} />
            <Route path="/my_team" element={<MenuMyTeam USER_INFO={userInfo} />} />
            {users.map(user => 
              <Route key={user.id} path={`/assigned/tasks/${user.first_name}/${user.last_name}/${user.id}`} element={<AssignedTasks USER_INFO={userInfo} MEMBER_INFO={user}/>} />
            )}
          </Routes>
        </div>
      </>
    );
  }else if(!isLoggedOn) {
    document.querySelector("body").style.justifyContent = "center";

    return(
      <div className='container'>
        <LogIn onClose={() => setIsLoggedOn(true)} getUserInfo={info => setUserInfo(info)} getUsers={data => setUsers(data)}/>
      </div>

    );
  };
}

export default App
