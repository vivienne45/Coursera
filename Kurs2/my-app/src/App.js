import React, { Component } from 'react'
import logo from './logo.svg'
import {Navbar, NavbarBrand } from 'reactstrap'
import Menu from './components/MenuComponents'
import './App.css'
import { DISHES } from './shared/dishes'
import Main from './components/MainComponents';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Main />
      </div>
    );
  }

  render () {
    return (
      <div>
        <Navbar dark color='primary'>
          <div className='container'>
            <NavbarBrand href='/'> Ristorante Con Fusion</NavbarBrand>
          </div>
        </Navbar>
        <Menu dishes={this.state.dishes} />
      </div>
    )
  }
}

export default App
