import React, { Component } from 'react'
import Navbar from './Navbar';
import HomeContent from './Home-Content';
import UserProfile from '../../Model/UserProfile';



class Home extends Component {
    state = {  } 
    componentDidMount() {
        console.log('User --- ', UserProfile.getName());
    }
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