import React, { Component } from 'react'
import logo from './logo.svg'
import {Navbar, NavbarBrand } from 'reactstrap'
import Menu from './components/MenuComponents'
import './App.css'
import { DISHES } from './shared/dishes'
import Main from './components/MainComponents'
import DishDetail from './components/DishdetailComponent'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigureStore } from './redux/configureStore'

const store = ConfigureStore();

class App extends Component {

  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className='App'>
            <Main />
          </div>
        </BrowserRouter>
      </Provider>
    )
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
