import React, { Component } from 'react';
 
import './App.css';
import InfiniteScroll from 'react-infinite-scroller';
import Tracking  from './containers/tracking/Tracking';
import History from './containers/history/History';

 

export default class App extends Component {
   

  render() {
    return (
      <div>
      <Tracking/>
    
      </div>

    );
  }
}



