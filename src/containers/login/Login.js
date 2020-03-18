import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {Form, Input, Button, Checkbox } from "antd";
import { history } from "react-router";
import { createBrowserHistory } from "history";
import {Strings} from '../../common/String';
import { UserOutlined, LockOutlined} from '@ant-design/icons';
import '../../containers/login/Login.css'



export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    //   alert(email+" "+password);
    var data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    fetch("http://13.233.112.236:8082/api/session", {
      method: "POST",
      body: data,
      headers: {
        // Accept: "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(response => {
      response.json().then(data => {
        console.log("Successful" + data);
        // alert(JSON.stringify(email, password));
        // window.location='/tracking'
        localStorage.setItem('email',JSON.stringify(email));
        localStorage.setItem('password',JSON.stringify(password));
        props.history.push("/tracking");
      });
    });
  }

  return (
    <div id='LoginForm-body'>
    <h1 style={{ textAlign: 'center' }}>{Strings.Login}</h1>
    <Form   
      name="normal_login"
      className="login-form"
 
            initialValues={{
        remember: true,
      }}
      >
      <Form.Item
        name="username"
      
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]} >
        <Input  value={email}
                 onChange={e => setEmail(e.target.value)} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]} >
        <Input

         value={password}
                   onChange={e => setPassword(e.target.value)}
                   type="password"
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"/>
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{Strings.remeberme}</Checkbox>
        </Form.Item>
        <span>{Strings.forgotpassword}</span>
      </Form.Item>
      <Form.Item>
      
          <Button type="ghost" htmlType="submit" onClick={handleSubmit} className="login-form-button" block>
            {Strings.Login}
          </Button>
      </Form.Item>
    </Form>
  </div>
    
    // <div className="Login">
    //   <section className="container-fluid bg">
    //     <div className="imgeset">
          
    //     </div>
    //     <section className="row justify-content-center">
    //       <section className="col-12 col-sm-6 col-md-3">
    //         <form className="form-container" onSubmit={handleSubmit}>
    //           <p className="h4 mb-4" style={{ textAlign: "center" }}>
    //             Sign in to GPS System
    //           </p>
    //           <div className="form-group">
               

    //             <input
    //               className="form-control"
    //               autoFocustype="text"
    //               value={email}
    //               onChange={e => setEmail(e.target.value)}
    //               aria-describedby="emailHelp"
    //               placeholder="Enter email"
    //             />
                
    //           </div>
    //           <div className="form-group">
                 
    //             <input
    //               value={password}
    //               onChange={e => setPassword(e.target.value)}
    //               type="password"
    //               className="form-control"
    //               placeholder="Password"
    //             />
    //           </div>
    //           <div className="form-group form-check">
    //             <input
    //               type="checkbox"
    //               className="form-check-input"
    //               id="exampleCheck1"
    //             />
    //             <label className="form-check-label" htmlFor="exampleCheck1">
    //               Remember me
    //             </label>
    //             <br />
    //             <span>
    //               <a href="#">Forgot password</a>
    //             </span>
    //           </div>
    //           <button
    //             disabled={!validateForm()}
    //             type="submit"
    //             className="btn btn-primary btn-block"
    //           >
    //             {" "}
    //             SIGN IN
    //           </button>
    //           <div style={{ textAlign: "center" }}>
    //             {" "}
    //             <span>
    //               Not a member?<a href="#">Register</a>
    //             </span>
    //           </div>
    //         </form>
    //       </section>
    //     </section>
    //   </section>
    // </div>
  );
}
