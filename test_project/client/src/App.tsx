import { useState } from 'react'
import './App.css'
import {Navbar, Hero, Footer, Services, Transactions} from './compoents'

const App = () => {

  return (
    <div className="App">
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Hero />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </div>
      )
}

export default App
