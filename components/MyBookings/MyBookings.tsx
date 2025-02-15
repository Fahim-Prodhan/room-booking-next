"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import baseUrl from "@/helper/baseUrl";
import UpdateBookingModal from "@/components/MyBookings/UpdateBookingModal"; 
interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description:string;
  room: {
    name: string;
  };
}

const MyBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); 
   const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/bookings/user/${user.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel booking");
      
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert("Booking canceled successfully");
    } catch (err) {
      alert("Error canceling booking");
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking); 
    setShowModal(true); 
  };

  const handleUpdate = () => {
    // Fetch updated bookings after editing
    setLoading(true);
    setShowModal(false);
    setError("");
    // You can re-fetch bookings here to update the list
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/bookings/user/${user?.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border">Room</th>
                <th className="p-3 text-left border">Title</th>
                <th className="p-3 text-left border">Start Time</th>
                <th className="p-3 text-left border">End Time</th>
                <th className="p-3 text-center border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{booking.room.name}</td>
                  <td className="p-3 border">{booking.title}</td>
                  <td className="p-3 border">{new Date(booking.startTime).toLocaleString()}</td>
                  <td className="p-3 border">{new Date(booking.endTime).toLocaleString()}</td>
                  <td className="p-3 border flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(booking)} // Trigger the edit function
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show Modal when editing a booking */}
      {showModal && selectedBooking && (
        <UpdateBookingModal
          bookingId={selectedBooking.id}
          roomName={selectedBooking.room.name}
          existingData={{
            title: selectedBooking.title,
            description: selectedBooking.description, 
            date: selectedBooking.startTime.split("T")[0], 
            startTime: selectedBooking.startTime.split("T")[1].substring(0, 5), 
            endTime: selectedBooking.endTime.split("T")[1].substring(0, 5), 
          }}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdate} // Pass update function to refresh bookings
        />
      )}
    </div>
  );
};

export default MyBookings;
