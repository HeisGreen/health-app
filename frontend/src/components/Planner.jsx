import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import axiosInstance from '../services/axiosInstance';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaCheck, 
  FaTimes,
  FaDumbbell,
  FaClock,
  FaFire,
  FaCalendarAlt,
  FaSpinner
} from 'react-icons/fa';

const Planner = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    exercises: [{ name: '', sets: '', reps: '', duration: '', rest: '' }]
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setFetching(false);
        return;
      }

      const response = await axiosInstance.get('/workouts');
      setWorkouts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      
      // Only handle authentication errors - let axios interceptor handle 403
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        window.location.href = '/login';
        return;
      }
      
      // For other errors (404, 500, network errors), just show empty state
      // Don't log out the user
      if (error.response?.status === 404) {
        // Endpoint might not exist yet or user has no workouts - that's okay
        setWorkouts([]);
      } else if (!error.response) {
        // Network error - don't log out, just show empty state
        console.error('Network error fetching workouts');
        setWorkouts([]);
      } else {
        // Other server errors - don't log out
        console.error('Server error fetching workouts:', error.response.status);
        setWorkouts([]);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', duration: '', rest: '' }]
    });
  };

  const handleRemoveExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index][field] = value;
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const handleSaveWorkout = async () => {
    if (!formData.name.trim() || !selectedDay) {
      alert('Please fill in workout name and select a day');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to save workouts');
        return;
      }

      // Helper function to safely parse integers
      const parseInteger = (value) => {
        if (!value || value === '' || value === null || value === undefined) {
          return null;
        }
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
      };

      const workoutRequest = {
        name: formData.name.trim(),
        day: selectedDay,
        exercises: formData.exercises
          .filter(ex => ex.name && ex.name.trim())
          .map(ex => ({
            name: ex.name.trim(),
            sets: parseInteger(ex.sets),
            reps: ex.reps && ex.reps.trim() ? ex.reps.trim() : null,
            duration: parseInteger(ex.duration),
            rest: parseInteger(ex.rest)
          })),
        completed: editingWorkout?.completed || false
      };

      let response;
      if (editingWorkout) {
        response = await axiosInstance.put(`/workouts/${editingWorkout.id}`, workoutRequest);
      } else {
        response = await axiosInstance.post('/workouts', workoutRequest);
      }

      // Refresh workouts list
      await fetchWorkouts();

      setFormData({
        name: '',
        exercises: [{ name: '', sets: '', reps: '', duration: '', rest: '' }]
      });
      setSelectedDay(null);
      setShowAddModal(false);
      setEditingWorkout(null);
    } catch (error) {
      console.error('Failed to save workout:', error);
      console.error('Error details:', error.response?.data);
      
      // Show more detailed error message
      let errorMessage = 'Failed to save workout. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      exercises: workout.exercises && workout.exercises.length > 0 
        ? workout.exercises.map(ex => ({
            name: ex.name || '',
            sets: ex.sets || '',
            reps: ex.reps || '',
            duration: ex.duration || '',
            rest: ex.rest || ''
          }))
        : [{ name: '', sets: '', reps: '', duration: '', rest: '' }]
    });
    setSelectedDay(workout.day);
    setShowAddModal(true);
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete workouts');
        return;
      }

      await axiosInstance.delete(`/workouts/${id}`);

      // Refresh workouts list
      await fetchWorkouts();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert(error.response?.data?.message || 'Failed to delete workout. Please try again.');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to update workouts');
        return;
      }

      await axiosInstance.patch(`/workouts/${id}/toggle-complete`, {});

      // Refresh workouts list
      await fetchWorkouts();
    } catch (error) {
      console.error('Failed to toggle workout completion:', error);
      alert(error.response?.data?.message || 'Failed to update workout. Please try again.');
    }
  };

  const getWorkoutsForDay = (day) => {
    return workouts.filter(w => w.day === day);
  };

  const getTotalWorkouts = () => workouts.length;
  const getCompletedWorkouts = () => workouts.filter(w => w.completed).length;
  const getTotalExercises = () => workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50'>
      {/* Sidebar - Always fixed on left */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        <Sidebar/>
      </div>
      
      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-w-0 p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Exercise Planner
          </h1>
          <p className="text-gray-600">Plan and track your workout routines</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card-modern"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaDumbbell className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-800">{getTotalWorkouts()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-modern"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{getCompletedWorkouts()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-modern"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <FaFire className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Exercises</p>
                <p className="text-2xl font-bold text-gray-800">{getTotalExercises()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Workout Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingWorkout(null);
              setFormData({
                name: '',
                exercises: [{ name: '', sets: '', reps: '', duration: '', rest: '' }]
              });
              setSelectedDay(null);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FaPlus />
            Add New Workout
          </button>
        </div>

        {/* Weekly Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {daysOfWeek.map((day, index) => {
            const dayWorkouts = getWorkoutsForDay(day);
            const isToday = day === today;
            
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card-modern ${isToday ? 'ring-2 ring-teal-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${isToday ? 'text-teal-600' : 'text-gray-800'}`}>
                    {day}
                    {isToday && <span className="ml-2 text-xs">(Today)</span>}
                  </h3>
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                
                {dayWorkouts.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No workouts scheduled</p>
                ) : (
                  <div className="space-y-3">
                    {dayWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className={`p-3 rounded-lg border-2 ${
                          workout.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-800">
                            {workout.name}
                          </h4>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleToggleComplete(workout.id)}
                              className={`p-1 rounded ${
                                workout.completed 
                                  ? 'text-green-600 hover:bg-green-100' 
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                            >
                              <FaCheck size={12} />
                            </button>
                            <button
                              onClick={() => handleEditWorkout(workout)}
                              className="p-1 rounded text-blue-600 hover:bg-blue-100"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkout(workout.id)}
                              className="p-1 rounded text-red-600 hover:bg-red-100"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>{(workout.exercises?.length || 0)} exercise{(workout.exercises?.length || 0) !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Workout Details Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingWorkout(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Workout Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Upper Body Strength"
                    className="inputClass"
                  />
                </div>

                {/* Day Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Day
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedDay === day
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercises */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Exercises
                    </label>
                    <button
                      onClick={handleAddExercise}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      <FaPlus size={12} />
                      Add Exercise
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.exercises.map((exercise, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Exercise {index + 1}
                          </span>
                          {formData.exercises.length > 1 && (
                            <button
                              onClick={() => handleRemoveExercise(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Exercise Name</label>
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                              placeholder="e.g., Bench Press"
                              className="inputClass text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Sets</label>
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                              placeholder="3"
                              className="inputClass text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Reps</label>
                            <input
                              type="text"
                              value={exercise.reps}
                              onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                              placeholder="8-12"
                              className="inputClass text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Duration (min)</label>
                            <input
                              type="number"
                              value={exercise.duration}
                              onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                              placeholder="30"
                              className="inputClass text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">Rest Time (sec)</label>
                            <input
                              type="number"
                              value={exercise.rest}
                              onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
                              placeholder="60"
                              className="inputClass text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveWorkout}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" />
                        {editingWorkout ? 'Updating...' : 'Saving...'}
                      </span>
                    ) : (
                      editingWorkout ? 'Update Workout' : 'Save Workout'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingWorkout(null);
                    }}
                    className="btn-secondary flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading State */}
        {fetching && (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-teal-600" />
          </div>
        )}

        {/* Workout Details View */}
        {!fetching && workouts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Workouts</h2>
            <div className="space-y-4">
              {workouts.map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card-modern ${workout.completed ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{workout.name}</h3>
                        {workout.completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaCalendarAlt className="text-sm" />
                        {workout.day}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleComplete(workout.id)}
                        className={`p-2 rounded-lg ${
                          workout.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        } hover:bg-opacity-80`}
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleEditWorkout(workout)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-opacity-80"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-opacity-80"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {workout.exercises && workout.exercises.length > 0 ? (
                      workout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            {exercise.sets && (
                              <div>
                                <span className="font-semibold">Sets:</span> {exercise.sets}
                              </div>
                            )}
                            {exercise.reps && (
                              <div>
                                <span className="font-semibold">Reps:</span> {exercise.reps}
                              </div>
                            )}
                            {exercise.duration && (
                              <div className="flex items-center gap-1">
                                <FaClock className="text-xs" />
                                <span className="font-semibold">Duration:</span> {exercise.duration} min
                              </div>
                            )}
                            {exercise.rest && (
                              <div>
                                <span className="font-semibold">Rest:</span> {exercise.rest}s
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">No exercises added</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
