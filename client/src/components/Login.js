import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        //👇🏻 saves the username to localstorage
        localStorage.setItem("userId", username);
        setUsername("");
        //👇🏻 redirects to the Tasks page.
        navigate("/tasks");
    };
    return (
        <div className='login__container'>
            <h1 className='login__title'>记事本</h1>
            <form className='login__form' onSubmit={handleLogin}>
                <label htmlFor='username'>请输入用户名</label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <button>登录</button>
            </form>
        </div>
    );
};

export default Login;