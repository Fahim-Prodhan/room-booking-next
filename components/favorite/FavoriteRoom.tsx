"use client";

import { useEffect, useState } from "react";
import baseUrl from "@/helper/baseUrl";
import RoomViewModal from "@/components/RoomsCard/RoomViewModal"; 
import BookingModal from "@/components/RoomsCard/BookingModal"; 
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleFavorite } from "@/redux/slices/favoriteRoomsSlice";


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
  

const FavoriteRoom = () => {
  const [favoriteRoomsData, setFavoriteRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalType, setModalType] = useState<"view" | "book" | null>(null); 
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const favoriteRooms = useSelector((state: RootState) => state.favoriteRooms); 



  const fetchFavoriteRooms = async () => {
    const storedRooms = localStorage.getItem("favoriteRooms");
    const roomIds = storedRooms ? JSON.parse(storedRooms) : [];

    if (roomIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/rooms/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch favorite rooms");

      setFavoriteRooms(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteRooms();
  }, []);

  const handleBookNow = (roomId: string, roomName: string) => {
    if (!user) {
      alert("You need to be logged in to book a room.");
      return;
    }
    setSelectedRoom({ id: roomId, name: roomName, capacity: 0, amenities: [], bookings: [], image: '', createdAt: "", updatedAt: "" });
    setModalType("book"); 
  };

  // const handleViewRoom = async (roomId: string) => {
  //   try {
  //     const response = await fetch(`${baseUrl}/api/rooms/${roomId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       const { room } = data; // Destructure the room object
        
  //       setSelectedRoom(room);   
  //       setModalType("view"); // Open the RoomViewModal
  //     } else {
  //       console.error("Failed to fetch room details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching room details:", error);
  //   }
  // };

  const handleFetch = ()=>{
    fetchFavoriteRooms();
  }

  const closeModal = () => {
    setModalType(null); 
    setSelectedRoom(null); 
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Favorite Rooms</h1>

      {loading ? (
        <p>Loading favorite rooms...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favoriteRooms.length === 0 ? (
        <p>No favorite rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {favoriteRoomsData.slice(0, 6).map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
          {room.image && <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{room.name}</h2>
            <p className="text-gray-600 mb-2">Capacity: {room.capacity}</p>
            <p className="text-gray-600">Amenities: {room.amenities.join(", ")}</p>
          </div>

          {/* Favorite button positioned at the top-right corner */}
          <button
            className={`absolute border-none shadow-md top-2 right-2 btn btn-sm ${favoriteRooms.includes(room.id) ? "bg-red-500" : "bg-orange-400"} text-white`}
            onClick={() => {dispatch(toggleFavorite(room.id)); handleFetch()}}
          >
            {favoriteRooms.includes(room.id) ? "Unfavorite" : "Favorite"}
          </button>

          <div className="mx-4 mb-4 flex justify-between">
            {/* <button
              className="btn btn-sm mt-3 bg-[#344CB7] text-white"
              onClick={() => handleViewRoom(room.id)} // Show RoomViewModal
            >
              View
            </button> */}
            <button
              className="btn btn-sm mt-3 bg-[#16C47F] text-white"
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
      )}
    </div>
  );
};

export default FavoriteRoom;
