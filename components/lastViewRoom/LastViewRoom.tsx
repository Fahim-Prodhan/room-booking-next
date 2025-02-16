"use client";

import { useEffect, useState } from "react";
import baseUrl from "@/helper/baseUrl";
import { useUser } from "@clerk/nextjs";
import BookingModal from "../RoomsCard/BookingModal";

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
const LastViewRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalType, setModalType] = useState<"view" | "book" | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const lastViewedRoomId = sessionStorage.getItem("lastViewedRoomId");
    if (!lastViewedRoomId) {
      setError("No last viewed room found.");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/rooms/get-single-room/${lastViewedRoomId}`);
        const data = await res.json();
        const { room } = data;

        if (!res.ok)
          throw new Error(data.error || "Failed to fetch room details");

        setRoom(room);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, []);

  const handleBookNow = (roomId: string, roomName: string) => {
    if (!user) {
      alert("You need to be logged in to book a room.");
      return;
    }
    setSelectedRoom({
      id: roomId,
      name: roomName,
      capacity: 0,
      amenities: [],
      bookings: [],
      image: "",
      createdAt: "",
      updatedAt: "",
    });
    setModalType("book");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRoom(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Last Viewed Room</h1>

      {loading ? (
        <p>Loading room details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : room ? (
        <div
          key={room.id}
          className="bg-white rounded-lg shadow-md overflow-hidden relative w-1/3"
        >
          {room.image && (
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{room.name}</h2>
            <p className="text-gray-600 mb-2">Capacity: {room.capacity}</p>
            <p className="text-gray-600">
              Amenities: {room.amenities.join(", ")}
            </p>
          </div>

          <div className="mx-4 mb-4 flex gap-2">
            <button
              className="btn btn-sm mt-3 bg-[#16C47F] text-white"
              onClick={() => handleBookNow(room.id, room.name)}
            >
              Book Now
            </button>
          </div>
        </div>
      ) : null}

      {modalType === "book" && selectedRoom && (
        <BookingModal
          roomId={selectedRoom.id}
          roomName={selectedRoom.name}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default LastViewRoom;
