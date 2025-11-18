import React, { useState, useEffect } from 'react';
import { teeTimesApi, coursesApi, usersApi } from '../services/api';
import TeeTimeCard from '../components/TeeTimeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const UserSignup = () => {
  const [teeTimes, setTeeTimes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [bookingTeeTime, setBookingTeeTime] = useState(null);

  // User form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both tee times and courses
        const [teeTimesResponse, coursesResponse] = await Promise.all([
          teeTimesApi.getAll(),
          coursesApi.getAll()
        ]);

        setTeeTimes(teeTimesResponse.data);
        setCourses(coursesResponse.data);

        // Set the first course as selected by default if courses exist
        if (coursesResponse.data.length > 0) {
          setSelectedCourseId(coursesResponse.data[0].id.toString());
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load tee times. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookTeeTime = (teeTime) => {
    setBookingTeeTime(teeTime);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create new user
      const userResponse = await usersApi.create(userForm);
      const userId = userResponse.data.id;

      // Assign user to tee time
      await teeTimesApi.assignUser(bookingTeeTime.id, {
        user_id: userId
      });

      // Refresh tee times
      const teeTimesResponse = await teeTimesApi.getAll();
      setTeeTimes(teeTimesResponse.data);

      // Reset form
      setUserForm({
        name: '',
        email: '',
        phone: ''
      });

      // Close modal
      setBookingTeeTime(null);

      alert('Tee time booked successfully!');
    } catch (err) {
      console.error('Error booking tee time:', err);
      setError('Failed to book tee time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeeTimes = selectedCourseId
    ? teeTimes.filter(teeTime => teeTime.course_id.toString() === selectedCourseId)
    : teeTimes;

  // Find course by ID
  const findCourse = (courseId) => {
    return courses.find(course => course.id === courseId) || null;
  };

  return (
    <div>
      <h1>Book a Tee Time</h1>

      {loading && !bookingTeeTime ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
            <label htmlFor="courseSelect" style={{ marginRight: '1rem', fontWeight: 'bold' }}>Filter by Course: </label>
            <select
              id="courseSelect"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', minWidth: '200px' }}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id.toString()}>
                  {course.name} - {course.location}
                </option>
              ))}
            </select>
          </div>

          {filteredTeeTimes.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {filteredTeeTimes.map(teeTime => (
                <TeeTimeCard
                  key={teeTime.id}
                  teeTime={teeTime}
                  course={findCourse(teeTime.course_id)}
                  onBook={handleBookTeeTime}
                />
              ))}
            </div>
          ) : (
            <p>No tee times available for the selected course.</p>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingTeeTime && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Complete Your Booking</h2>

            <p style={{ marginBottom: '1.5rem' }}>
              You're booking a tee time at {findCourse(bookingTeeTime.course_id)?.name}
              on {new Date(bookingTeeTime.start_time).toLocaleString()}
            </p>

            <form onSubmit={handleSubmitBooking}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userForm.phone}
                  onChange={handleUserFormChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: '#ccc' }}
                  onClick={() => setBookingTeeTime(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSignup;