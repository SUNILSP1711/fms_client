import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('facilities');
    const [facilities, setFacilities] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [issues, setIssues] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showFacilityModal, setShowFacilityModal] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [issueFilter, setIssueFilter] = useState('Reported');
    const [newFacility, setNewFacility] = useState({
        name: '',
        type: 'Auditorium',
        capacity: '',
        acStatus: 'AC',
        description: '',
        images: ['', '', '']
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/signin');
        fetchFacilities();
        fetchBookings();
        fetchIssues();
    }, []);

    const fetchFacilities = async () => {
        try {
            const res = await fetch("https://fms-server-qb61.onrender.com/api/facilities");
            const data = await res.json();
            setFacilities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://fms-server-qb61.onrender.com/api/bookings", {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchIssues = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://fms-server-qb61.onrender.com/api/issues", {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setIssues(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFacility({ ...newFacility, [name]: value });
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...newFacility.images];
        updatedImages[index] = value;
        setNewFacility({ ...newFacility, images: updatedImages });
    };

    const handleAddFacility = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://fms-server-qb61.onrender.com/api/facilities", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    ...newFacility,
                    images: newFacility.images.filter(img => img.trim() !== '')
                })
            });
            if (res.ok) {
                alert('Facility Added Successfully');
                setShowAddForm(false);
                setNewFacility({
                    name: '',
                    type: 'Auditorium',
                    capacity: '',
                    acStatus: 'AC',
                    description: '',
                    images: ['', '', '']
                });
                fetchFacilities();
            } else {
                alert('Failed to add facility');
            }
        } catch (err) {
            console.error(err);
            alert('Error adding facility');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://fms-server-qb61.onrender.com/api/bookings/${id}", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                alert(`Booking ${status}`);
                fetchBookings();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating status');
        }
    };

    const openFacilityModal = (facility) => {
        setSelectedFacility(facility);
        setShowFacilityModal(true);
    };

    const closeFacilityModal = () => {
        setSelectedFacility(null);
        setShowFacilityModal(false);
    };

    const handleResolveIssue = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://fms-server-qb61.onrender.com/api/issues/${id}/resolve", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
            if (res.ok) {
                alert('Issue Marked as Cleared');
                fetchIssues();
            } else {
                alert('Failed to update issue');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating issue');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* ... (nav remains same) */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* ... (tabs remain same) */}
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'facilities' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setActiveTab('facilities')}
                    >
                        Facilities
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'issues' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setActiveTab('issues')}
                    >
                        Issues
                    </button>
                </div>

                {/* ... (facilities, bookings, reports tabs remain same) */}
                {activeTab === 'facilities' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Manage Facilities</h2>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                {showAddForm ? 'Cancel' : 'Add Facility'}
                            </button>
                        </div>

                        {showAddForm && (
                            <form onSubmit={handleAddFacility} className="mb-6 bg-gray-50 p-4 rounded border">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Facility Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newFacility.name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            name="type"
                                            value={newFacility.type}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        >
                                            <option value="Auditorium">Auditorium</option>
                                            <option value="Laboratory">Laboratory</option>
                                            <option value="Study Area">Study Area</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            value={newFacility.capacity}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">AC Status</label>
                                        <select
                                            name="acStatus"
                                            value={newFacility.acStatus}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        >
                                            <option value="AC">AC</option>
                                            <option value="Non-AC">Non-AC</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            name="description"
                                            value={newFacility.description}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Images (URLs)</label>
                                        {newFacility.images.map((img, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                placeholder={`Image URL ${index + 1}`}
                                                value={img}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save Facility
                                </button>
                            </form>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {facilities.map(facility => (
                                <div key={facility._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer" onClick={() => openFacilityModal(facility)}>
                                    <div className="h-48 bg-gray-200 w-full">
                                        {facility.images && facility.images.length > 0 && facility.images[0] ? (
                                            <img src={facility.images[0]} alt={facility.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold">{facility.name}</h3>
                                        <p className="text-sm text-gray-600">{facility.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Booking Requests</h2>
                        <ul>
                            {bookings.filter(b => b.status === 'Pending').length === 0 ? (
                                <p className="text-gray-500">No pending requests.</p>
                            ) : (
                                bookings.filter(b => b.status === 'Pending').map(booking => (
                                    <li key={booking._id} className="border-b py-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">{booking.facility.name}</p>
                                            <p className="text-sm text-gray-600">Requested by: {booking.user.name} ({booking.user.email})</p>
                                            <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleDateString()} | Time: {booking.timeSlot}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'Approved')}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(booking._id, 'Declined')}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">All Bookings Report</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.facility.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user.name} ({booking.user.email})</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} <br /> {booking.timeSlot}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'issues' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Reported Issues</h2>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 rounded text-sm ${issueFilter === 'Reported' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setIssueFilter('Reported')}
                                >
                                    Pending Issues
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${issueFilter === 'Resolved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setIssueFilter('Resolved')}
                                >
                                    Cleared Issues
                                </button>
                            </div>
                        </div>
                        <ul>
                            {issues.filter(i => i.status === issueFilter).length === 0 ? (
                                <p className="text-gray-500 text-sm">No {issueFilter.toLowerCase()} issues found.</p>
                            ) : (
                                issues.filter(i => i.status === issueFilter).map(issue => (
                                    <li key={issue._id} className="border-b py-4 flex items-start justify-between space-x-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                {issue.facility.images && issue.facility.images.length > 0 && issue.facility.images[0] ? (
                                                    <img src={issue.facility.images[0]} alt={issue.facility.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold">{issue.facility.name}</p>
                                                <p className="text-sm text-gray-600">Reported by: {issue.user.name} ({issue.user.email})</p>
                                                <p className="text-sm text-gray-800 mt-1">{issue.description}</p>
                                                <p className={`text-xs font-semibold mt-1 ${issue.status === 'Resolved' ? 'text-green-600' : 'text-red-600'}`}>
                                                    Status: {issue.status}
                                                </p>
                                            </div>
                                        </div>
                                        {issue.status !== 'Resolved' && (
                                            <button
                                                onClick={() => handleResolveIssue(issue._id)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                            >
                                                Cleared
                                            </button>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Facility Modal */}
            {showFacilityModal && selectedFacility && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl m-4">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedFacility.name}</h2>
                            <button onClick={closeFacilityModal} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                        </div>

                        <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {[...Array(3)].map((_, index) => {
                                    const img = selectedFacility.images && selectedFacility.images[index];
                                    return (
                                        <div key={index} className="w-full h-32 bg-gray-200 rounded border flex items-center justify-center overflow-hidden">
                                            {img ? (
                                                <img src={img} alt={`${selectedFacility.name} ${index + 1}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p><strong>Type:</strong> {selectedFacility.type}</p>
                            <p><strong>Capacity:</strong> {selectedFacility.capacity} pax</p>
                            <p><strong>AC Status:</strong> {selectedFacility.acStatus}</p>
                            <p><strong>Description:</strong> {selectedFacility.description}</p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={closeFacilityModal} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
