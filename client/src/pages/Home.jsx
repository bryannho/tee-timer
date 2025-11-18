import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Welcome to Tee Timer</h1>

      <div className="card">
        <h2>Book Your Tee Time</h2>
        <p style={{ margin: '1rem 0' }}>
          Looking to hit the greens? Browse available tee times and book your spot at your favorite golf courses.
        </p>
        <Link to="/user-signup" className="btn">Book Now</Link>
      </div>

      <div className="card">
        <h2>Course Management</h2>
        <p style={{ margin: '1rem 0' }}>
          For golf course administrators. Manage your course's tee times, view bookings, and more.
        </p>
        <Link to="/course-management" className="btn btn-secondary">Manage Course</Link>
      </div>
    </div>
  )
}

export default Home