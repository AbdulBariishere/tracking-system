import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, BrowserRouter as Router, Switch } from 'react-router-dom'  
import './index.css';
import App from './App';
import Login from './containers/login/Login'
import * as serviceWorker from './serviceWorker';
import History from './containers/history/History';


//  import 'mapbox-gl/dist/mapbox-gl.js';


const routing = (  
    <Router>  
      <div>  
    
    
          <Switch>
        <Route exact path="/" component={Login} />  
        <Route path ="/tracking" component ={App}/>
        <Route path ="/history" component ={History}/>
        {/* <Route path="/about" component={About} />  
        <Route path="/contact" component={Contact} />  
        <Route component = {Notefound}/> */}
        </Switch>
      </div>  
    </Router>  
  )  

  ReactDOM.render(routing, document.getElementById('root'));  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
// if(module.hot){ 
//   module.hot.accept(); 
// } 
