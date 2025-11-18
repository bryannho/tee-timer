import React, { useState, useEffect } from 'react';
import { teeTimesApi, coursesApi } from '../services/api';
import TeeTimeCard from '../components/TeeTimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { format, parseISO, addHours } from 'date-fns';

const CourseManagement = () => {
  const [teeTimes, setTeeTimes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isCreatingTeeTime, setIsCreatingTeeTime] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Form states
  const [teeTimeForm, setTeeTimeForm] = useState({
    start_time: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    course_id: ''
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    location: '',
    holes: 18
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      if (coursesResponse.data.length > 0 && !selectedCourseId) {
        const firstCourseId = coursesResponse.data[0].id.toString();
        setSelectedCourseId(firstCourseId);
        setTeeTimeForm(prev => ({ ...prev, course_id: firstCourseId }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeeTimeFormChange = (e) => {
    const { name, value } = e.target;
    setTeeTimeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseFormChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({
      ...prev,
      [name]: name === 'holes' ? parseInt(value) : value
    }));
  };

  const handleCreateTeeTime = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Convert string to ISO date
      const formattedData = {
        ...teeTimeForm,
        course_id: parseInt(teeTimeForm.course_id)
      };

      await teeTimesApi.create(formattedData);

      // Reset form and refresh data
      setTeeTimeForm({
        start_time: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        course_id: selectedCourseId
      });

      setIsCreatingTeeTime(false);
      await fetchData();

      alert('Tee time created successfully!');
    } catch (err) {
      console.error('Error creating tee time:', err);
      setError('Failed to create tee time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await coursesApi.create(courseForm);

      // Reset form and refresh data
      setCourseForm({
        name: '',
        location: '',
        holes: 18
      });

      setIsCreatingCourse(false);
      await fetchData();

      // Set the newly created course as selected
      setSelectedCourseId(response.data.id.toString());
      setTeeTimeForm(prev => ({ ...prev, course_id: response.data.id.toString() }));

      alert('Course created successfully!');
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
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
      <h1>Course Management</h1>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
        <button
          className="btn"
          onClick={() => setIsCreatingTeeTime(true)}
        >
          Create Tee Time
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setIsCreatingCourse(true)}
        >
          Add New Course
        </button>
      </div>

      {loading && !isCreatingTeeTime && !isCreatingCourse ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="courseSelect" style={{ marginRight: '1rem', fontWeight: 'bold' }}>Select Course: </label>
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

          <h2>Tee Times</h2>
          {filteredTeeTimes.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {filteredTeeTimes.map(teeTime => (
                <TeeTimeCard
                  key={teeTime.id}
                  teeTime={teeTime}
                  course={findCourse(teeTime.course_id)}
                  isManagement={true}
                  onEdit={() => {}} // We could implement editing functionality here
                />
              ))}
            </div>
          ) : (
            <p>No tee times available for this course. Create one now!</p>
          )}
        </div>
      )}

      {/* Create Tee Time Modal */}
      {isCreatingTeeTime && (
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
            <h2 style={{ marginBottom: '1rem' }}>Create New Tee Time</h2>

            <form onSubmit={handleCreateTeeTime}>
              <div className="form-group">
                <label htmlFor="course_id">Course</label>
                <select
                  id="course_id"
                  name="course_id"
                  value={teeTimeForm.course_id}
                  onChange={handleTeeTimeFormChange}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.name} - {course.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="start_time">Start Time</label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={teeTimeForm.start_time}
                  onChange={handleTeeTimeFormChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: '#ccc' }}
                  onClick={() => setIsCreatingTeeTime(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Tee Time'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {isCreatingCourse && (
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
            <h2 style={{ marginBottom: '1rem' }}>Add New Golf Course</h2>

            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label htmlFor="name">Course Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={courseForm.name}
                  onChange={handleCourseFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={courseForm.location}
                  onChange={handleCourseFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="holes">Number of Holes</label>
                <select
                  id="holes"
                  name="holes"
                  value={courseForm.holes}
                  onChange={handleCourseFormChange}
                  required
                >
                  <option value="9">9 Holes</option>
                  <option value="18">18 Holes</option>
                  <option value="27">27 Holes</option>
                  <option value="36">36 Holes</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: '#ccc' }}
                  onClick={() => setIsCreatingCourse(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;