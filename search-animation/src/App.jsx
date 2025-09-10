import React from 'react'
import Searchbar from './searchbar/SearchbarWithResults'
import './App.css'

const App = () => {
  return (
    <div className="app">
      <div className="search-container">
        <Searchbar />
      </div>
    </div>
  )
}

export default App
