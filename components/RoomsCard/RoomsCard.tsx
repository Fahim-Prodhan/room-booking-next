"use client";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRooms } from "@/redux/slices/roomsSlice";
import { toggleFavorite } from "@/redux/slices/favoriteRoomsSlice";
import { useUser } from "@clerk/nextjs";
import RoomViewModal from "@/components/RoomsCard/RoomViewModal"; // Import RoomViewModal
import BookingModal from "@/components/RoomsCard/BookingModal"; // Import BookingModal
import baseUrl from "@/helper/baseUrl";

// Define a type for the room
interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  bookings: any[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

const RoomsCard: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, loading, error } = useSelector((state: RootState) => state.rooms);
  const favoriteRooms = useSelector((state: RootState) => state.favoriteRooms); // Get favorites from Redux

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalType, setModalType] = useState<"view" | "book" | null>(null); // Track which modal to show
  const { user } = useUser();

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 6 }));
  }, [dispatch]);

  const handleBookNow = (roomId: string, roomName: string) => {
    if (!user) {
      alert("You need to be logged in to book a room.");
      return;
    }
    setSelectedRoom({ id: roomId, name: roomName, capacity: 0, amenities: [], bookings: [], image: '', createdAt: "", updatedAt: "" });
    setModalType("book"); 
  };

  const handleViewRoom = async (roomId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        const { room } = data; // Destructure the room object
        
        setSelectedRoom(room);   
        setModalType("view"); // Open the RoomViewModal
      } else {
        console.error("Failed to fetch room details");
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };


  const closeModal = () => {
    setModalType(null); // Close any open modal
    setSelectedRoom(null); // Clear selected room details
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {rooms.slice(0, 6).map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
          {room.image && <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{room.name}</h2>
            <p className="text-gray-600 mb-2">Capacity: {room.capacity}</p>
            <p className="text-gray-600">Amenities: {room.amenities.join(", ")}</p>
          </div>

          {/* Favorite button positioned at the top-right corner */}
          <button
            className={`absolute top-2 right-2 btn btn-sm ${favoriteRooms.includes(room.id) ? "bg-red-500" : "bg-orange-400"} text-white`}
            onClick={() => dispatch(toggleFavorite(room.id))}
          >
            {favoriteRooms.includes(room.id) ? "Unfavorite" : "Favorite"}
          </button>

          <div className="mx-4 mb-4 flex justify-between">
            <button
              className="btn btn-sm mt-3 bg-blue-500 text-white"
              onClick={() => handleViewRoom(room.id)} // Show RoomViewModal
            >
              View
            </button>
            <button
              className="btn btn-sm mt-3 bg-[#18aeff] text-white"
              onClick={() => handleBookNow(room.id, room.name)} 
            >
              Book Now
            </button>
          </div>
        </div>
      ))}

      {modalType === "book" && selectedRoom && (
        <BookingModal
          roomId={selectedRoom.id}
          roomName={selectedRoom.name}
          onClose={closeModal} 
        />
      )}

      {modalType === "view" && selectedRoom && (
        <RoomViewModal
          room={selectedRoom}  // Ensure you're passing 'room' correctly
          onClose={closeModal} // Close the modal when user clicks close
        />
      )}
    </div>
  );
};

export default RoomsCard;
