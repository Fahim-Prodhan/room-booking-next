"use client";
import { useState } from "react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRooms } from "@/redux/slices/roomsSlice";
import BookingModal from "@/components/RoomsCard/BookingModal";
import { useUser } from "@clerk/nextjs"; // Import Clerk authentication

const RoomsCard: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, loading, error } = useSelector((state: RootState) => state.rooms);

  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string } | null>(null);
  const { user } = useUser();

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 6 }));
  }, [dispatch]);

  const handleBookNow = (roomId: number, roomName: string) => {
    if (!user) {
      alert("You need to be logged in to book a room.");
      return;
    }
    setSelectedRoom({ id: roomId, name: roomName });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {rooms.slice(0, 6).map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {room.image && <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{room.name}</h2>
            <p className="text-gray-600 mb-2">Capacity: {room.capacity}</p>
            <p className="text-gray-600">Amenities: {room.amenities.join(", ")}</p>
          </div>
          <div className="mx-4 mb-4 flex justify-between">
            <button
              className="btn btn-sm mt-3 bg-[#18aeff] text-white"
              onClick={() => handleBookNow(room.id, room.name)}
            >
              Book Now
            </button>
            <button className="btn btn-sm mt-3 bg-orange-400 text-white">Favorite</button>
          </div>
        </div>
      ))}

      {selectedRoom && user && (
        <BookingModal
          roomId={selectedRoom.id}
          roomName={selectedRoom.name}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default RoomsCard;
