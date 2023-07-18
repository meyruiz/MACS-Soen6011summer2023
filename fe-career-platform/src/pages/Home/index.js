import React, { Component } from 'react'
import Navbar from './Navbar/navbar';
import HomeContent from './Home-Content';

class Home extends Component {
    state = {  } 
    render() { 
        return (
        <>
            <Navbar/>
            <HomeContent/>
        </>
        );
    }
}
 
export default Home;