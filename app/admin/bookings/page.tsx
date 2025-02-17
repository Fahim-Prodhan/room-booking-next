"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import baseUrl from "@/helper/baseUrl";
import UpdateBookingModal from "@/components/MyBookings/UpdateBookingModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchBookings, deleteBooking } from "@/redux/slices/bookingsSlice";

interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  room: {
    name: string;
  };
}

const MyBookings = () => {
  const { user } = useUser();
  const dispatch: AppDispatch = useDispatch();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [limit, setLimit] = useState(10);

  const pageRange = 2;

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  

  const onPageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page)
  };

  const fetchBookingsAdmin = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/bookings?page=${currentPage}&size=${limit}`
      );
      const data = await response.json();
      setBookings(data.bookings);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin bookings data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsAdmin();
  }, [currentPage,limit]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    dispatch(deleteBooking(bookingId));
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleUpdate = () => {
    fetchBookingsAdmin();
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings?.length === 0 ? (
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
              {bookings?.map((booking) => (
                <tr key={booking?.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{booking?.room.name}</td>
                  <td className="p-3 border">{booking?.title}</td>
                  <td className="p-3 border">
                    {new Date(booking?.startTime).toLocaleString()}
                  </td>
                  <td className="p-3 border">
                    {new Date(booking?.endTime).toLocaleString()}
                  </td>
                  <td className="p-3 border flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(booking?.id)}
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

      {showModal && selectedBooking && (
        <UpdateBookingModal
          bookingId={selectedBooking?.id}
          roomName={selectedBooking?.room.name}
          existingData={{
            title: selectedBooking?.title,
            description: selectedBooking?.description,
            date: selectedBooking?.startTime.split("T")[0],
            startTime: selectedBooking?.startTime.split("T")[1].substring(0, 5),
            endTime: selectedBooking?.endTime.split("T")[1].substring(0, 5),
          }}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mr-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-gray-200"
          }`}
        >
          Prev
        </button>

        {getPageNumbers().map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span key={index} className="px-4 py-2 mx-1 text-gray-500">
                ...
              </span>
            );
          }
          return (
            <button
              key={index}
              onClick={() => onPageChange(pageNumber as number)}
              className={`px-4 py-2 rounded mx-1 ${
                pageNumber === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ml-2 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyBookings;
