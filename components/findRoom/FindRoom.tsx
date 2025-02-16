"use client";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRooms } from "@/redux/slices/roomsSlice";
import { toggleFavorite } from "@/redux/slices/favoriteRoomsSlice";
import { useUser } from "@clerk/nextjs";
import RoomViewModal from "@/components/RoomsCard/RoomViewModal";
import BookingModal from "@/components/RoomsCard/BookingModal";
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

const FindRoom: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    rooms,
    loading,
    error,
    pagination: { page, limit, totalRooms, totalPages, currentPage },
  } = useSelector((state: RootState) => state.rooms);
  const favoriteRooms = useSelector((state: RootState) => state.favoriteRooms);
  const { user } = useUser();

  const [capacity, setCapacity] = useState(0);
  const [selectedAmenity, setSelectedAmenity] = useState(""); // Selected amenity filter
  const [amenities, setAmenities] = useState<string[]>([]); // Store unique amenities
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalType, setModalType] = useState<"view" | "book" | null>(null);

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
    dispatch(
      fetchRooms({
        page,
        limit: 6,
        search: selectedAmenity,
        capacity,
      })
    );
  };

  // Fetch unique amenities from backend
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/rooms/amenities`);
        if (response.ok) {
          const data = await response.json();
          setAmenities(data.uniqueAmenities); // Store unique amenities
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };
    fetchAmenities();
  }, []);

  // Fetch rooms whenever the selected amenity or capacity changes
  useEffect(() => {
    dispatch(
      fetchRooms({
        page: currentPage,
        limit: 6,
        search: selectedAmenity,
        capacity,
      })
    );
  }, [
    dispatch,
    selectedAmenity,
    capacity,
    page,
    limit,
    selectedAmenity,
    currentPage,
  ]);

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

  const handleViewRoom = async (roomId: string) => {
    try {
      sessionStorage.setItem("lastViewedRoomId", roomId);
      const response = await fetch(
        `${baseUrl}/api/rooms/get-single-room/${roomId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedRoom(data.room);
        setModalType("view");
      } else {
        console.error("Failed to fetch room details");
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRoom(null);
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {/* Capacity Filter */}
        <select
          className="select select-bordered w-full sm:w-1/4 p-2 border border-gray-300 rounded-lg"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value))}
        >
          <option value={0}>All Capacities</option>
          <option value={1}>1-10 People</option>
          <option value={10}>11-20 People</option>
          <option value={20}>20-30 People</option>
          <option value={30}>30+ People</option>
        </select>

        {/* Amenities Dropdown */}
        <select
          className="select select-bordered w-full sm:w-1/3 mt-2 sm:mt-0 p-2 border border-gray-300 rounded-lg"
          value={selectedAmenity}
          onChange={(e) => setSelectedAmenity(e.target.value)}
        >
          <option value="">All Amenities</option>
          {amenities?.map((amenity, index) => (
            <option key={index} value={amenity}>
              {amenity}
            </option>
          ))}
        </select>
      </div>

      {/* Room Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner text-blue-500 w-10 h-10"></span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">Error loading rooms. Please try again.</p>
      ) : rooms?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <div key={room?.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              {room?.image && (
                <img src={room?.image} alt={room?.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{room?.name}</h2>
                <p className="text-gray-600 mb-2">Capacity: {room?.capacity}</p>
                <p className="text-gray-600">Amenities: {room?.amenities?.join(", ")}</p>
              </div>

              <button
                className={`absolute border-none shadow-md top-2 right-2 btn btn-sm ${
                  favoriteRooms?.includes(room.id) ? "bg-red-500" : "bg-orange-400"
                } text-white`}
                onClick={() => dispatch(toggleFavorite(room?.id))}
              >
                {favoriteRooms.includes(room?.id) ? "Unfavorite" : "Favorite"}
              </button>

              <div className="mx-4 mb-4 flex gap-2">
                <button className="btn btn-sm mt-3 bg-[#344CB7] text-white" onClick={() => {}}>
                  View
                </button>
                <button className="btn btn-sm mt-3 bg-[#16C47F] text-white" onClick={() => {}}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 col-span-3">No rooms found.</p>
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

      {/* Modals */}
      {modalType === "book" && selectedRoom && (
        <BookingModal
          roomId={selectedRoom.id}
          roomName={selectedRoom.name}
          onClose={closeModal}
        />
      )}
      {modalType === "view" && selectedRoom && (
        <RoomViewModal room={selectedRoom} onClose={closeModal} />
      )}
    </div>
  );
};

export default FindRoom;
