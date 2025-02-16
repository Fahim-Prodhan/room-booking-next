"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchRooms,
  deleteRoom,
  updateRoom,
  createRoom,
} from "@/redux/slices/roomsSlice";

const RoomPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, loading, error, pagination } = useSelector(
    (state: RootState) => state.rooms
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchRooms({ page: currentPage, limit: itemsPerPage, search: "", capacity: 0 }));
  }, [dispatch, currentPage, itemsPerPage]);

  const handleDeleteRoom = async (id: string) => {
    try {
      await dispatch(deleteRoom(id)).unwrap();
      alert("Room deleted successfully");
      dispatch(fetchRooms({ page: currentPage, limit: itemsPerPage, search: "", capacity: 0 }));
    } catch (error) {
      alert("Failed to delete room");
    }
  };

  return (
    <div className="px-8">
      <h1 className="text-3xl font-bold mb-8">Room Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Capacity</th>
                <th className="border p-2">Amenities</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border">
                  <td className="p-2">{room.name}</td>
                  <td className="p-2">{room.capacity}</td>
                  <td className="p-2">{room.amenities.join(", ")}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomPage;
