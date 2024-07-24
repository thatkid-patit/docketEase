import React, {useState, useEffect} from 'react';
import DocketEaseLogo from '../assets/docketEaseLogo.png'

function LogIn(props) {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('src/data/db.json')
      .then(res => res.json())
      .then(jsonData => {
        setUsers(jsonData.users);
      })
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };

  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const handleClickLogin = () => {
    const userInfo = users.find(user => {
      return user.email === email
    })

    if(userInfo == null) {
      alert("Email not recognized!");
      setEmail("");
      setPassword("");
      return
    }

    if(userInfo.password !== password) {
      alert("Incorrect password entered");
      setPassword("");
      return
    }

    if(email == "" || password == "") {
      alert("Both email and password are required!")
      return
    }
    props.getUsers(users);
    props.getUserInfo(userInfo);
    props.onClose();
  };

  return(
    <div className='login-container'>
      <div className='login-form'>
        <div className="logo-container">
          <img src={DocketEaseLogo} alt="DocketEase Logo" onClick={() => window.location.pathname = "/"}/>
        </div>
        <h3>SIGN IN</h3>
        <div className='input-container'>
          <label><i className="icon-user"></i></label>
          <input type="email" value={email} onChange={handleChangeEmail} />
        </div>
        <div className='input-container'>
          <label><i className="icon-lock"></i></label>
          <input type="password" value={password} onChange={handleChangePassword}/>
        </div>
        <div className="button-container">
          <button className="login-button" onClick={handleClickLogin}>LOGIN</button>
        </div>
      </div>
    </div>
  );

};

export default LogIn