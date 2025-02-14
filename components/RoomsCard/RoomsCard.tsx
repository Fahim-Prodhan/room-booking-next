"use client";
import { NextPage } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store"; // Adjust the import path as needed
import { fetchRooms } from "@/redux/slices/roomsSlice"; // Adjust the import path as needed

type Room = {
  id: number;
  name: string;
  capacity: number;
  amenities: string[];
  image?: string;
};

const RoomsCard: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, loading, error } = useSelector(
    (state: RootState) => state.rooms
  );

  // Fetch rooms when the component mounts
  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 6 })); // Fetch first 6 rooms
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {rooms.slice(0, 6).map(
        (
          room // Display only the first 6 rooms
        ) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
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
            <div className="mx-4 mb-4 flex justify-between">
              <button className="btn btn-sm mt-3 bg-orange-400 text-white">
                Book Now
              </button>
              <button className="btn btn-sm mt-3 bg-sky-400 text-white">
              Favorite
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RoomsCard;
