import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
  render() {
    return (
      <div style={{display:"flex",fontSize:"10px",marginLeft:"50px",marginBottom:"20px"}}>
        <Link to="/">
        <h2>Movies App</h2>
        </Link>
        <Link to="/favourites"><h3 style={{marginLeft:"2rem",marginTop:"0.5rem"}}>Favorites</h3></Link>
      </div>
    )
  }
}
