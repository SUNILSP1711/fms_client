import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [facilities, setFacilities] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [myIssues, setMyIssues] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [showFacilityModal, setShowFacilityModal] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [bookingData, setBookingData] = useState({
        date: '',
        startTime: '',
        endTime: ''
    });
    const [issueDescription, setIssueDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/signin');
        fetchFacilities();
        fetchMyBookings();
        fetchMyIssues();
    }, []);

    const fetchFacilities = async () => {
        try {
            const res = await fetch(`${API_URL}/facilities`);
            const data = await res.json();
            setFacilities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/bookings/my`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setMyBookings(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyIssues = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/issues/my`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setMyIssues(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    const openFacilityModal = (facility) => {
        setSelectedFacility(facility);
        setShowFacilityModal(true);
    };

    const closeFacilityModal = () => {
        setSelectedFacility(null);
        setShowFacilityModal(false);
    };

    const handleBookClick = (facility, e) => {
        e.stopPropagation(); // Prevent opening modal
        setSelectedFacility(facility);
        setShowBookingForm(true);
    };

    const handleReportClick = (facility, e) => {
        e.stopPropagation(); // Prevent opening modal
        setSelectedFacility(facility);
        setShowIssueForm(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const timeSlot = `${bookingData.startTime} - ${bookingData.endTime}`;
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    facility: selectedFacility._id,
                    date: bookingData.date,
                    timeSlot: timeSlot
                })
            });

            if (res.ok) {
                alert('Booking Request Sent');
                setShowBookingForm(false);
                setBookingData({ date: '', startTime: '', endTime: '' });
                fetchMyBookings();
            } else {
                alert('Booking Failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error sending booking request');
        }
    };

    const handleIssueSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    facility: selectedFacility._id,
                    description: issueDescription
                })
            });

            if (res.ok) {
                alert('Issue Reported Successfully');
                setShowIssueForm(false);
                setIssueDescription('');
                fetchMyIssues();
            } else {
                alert('Failed to report issue');
            }
        } catch (err) {
            console.error(err);
            alert('Error reporting issue');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-800">Staff Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-md p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Facilities</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {facilities.map(facility => (
                                <div key={facility._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer" onClick={() => openFacilityModal(facility)}>
                                    <div className="h-48 bg-gray-200 w-full relative">
                                        {facility.images && facility.images.length > 0 && facility.images[0] ? (
                                            <img src={facility.images[0]} alt={facility.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold">{facility.name}</h3>
                                                <p className="text-sm text-gray-600">{facility.type} | {facility.capacity} pax</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex space-x-2">
                                            <button
                                                onClick={(e) => handleBookClick(facility, e)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                            >
                                                Book
                                            </button>
                                            <button
                                                onClick={(e) => handleReportClick(facility, e)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                            >
                                                Report Issue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">My Bookings</h2>
                            {myBookings.length === 0 ? (
                                <p className="text-gray-500 text-sm">No bookings found.</p>
                            ) : (
                                <ul>
                                    {myBookings.map(booking => (
                                        <li key={booking._id} className="border-b py-2 last:border-b-0">
                                            <span className="font-medium">{booking.facility.name}</span>
                                            <br />
                                            <span className="text-sm text-gray-600">
                                                {new Date(booking.date).toLocaleDateString()} - {booking.timeSlot}
                                            </span>
                                            <br />
                                            <span className={`text-sm font-bold ${booking.status === 'Approved' ? 'text-green-600' :
                                                booking.status === 'Declined' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">My Reported Issues</h2>
                            {myIssues.length === 0 ? (
                                <p className="text-gray-500 text-sm">No issues reported.</p>
                            ) : (
                                <ul>
                                    {myIssues.map(issue => (
                                        <li key={issue._id} className="border-b py-2 last:border-b-0">
                                            <span className="font-medium">{issue.facility.name}</span>
                                            <p className="text-sm text-gray-600">{issue.description}</p>
                                            <div className="mt-1">
                                                <span className={`text-xs font-bold ${issue.status === 'Resolved' ? 'text-green-600' : 'text-red-600'}`}>
                                                    Status: {issue.status}
                                                </span>
                                                {issue.status === 'Resolved' && issue.adminResponse && (
                                                    <p className="text-xs text-green-700 mt-1 italic">
                                                        "{issue.adminResponse}"
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
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

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={(e) => { closeFacilityModal(); handleBookClick(selectedFacility, e); }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Book Now
                                </button>
                                <button onClick={closeFacilityModal} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {showBookingForm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Book {selectedFacility?.name}</h3>
                            <form onSubmit={handleBookingSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        value={bookingData.date}
                                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <input
                                            type="time"
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                            value={bookingData.startTime}
                                            onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                                        <input
                                            type="time"
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                            value={bookingData.endTime}
                                            onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showIssueForm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Report Issue for {selectedFacility?.name}</h3>
                            <form onSubmit={handleIssueSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        rows="4"
                                        value={issueDescription}
                                        onChange={(e) => setIssueDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowIssueForm(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
