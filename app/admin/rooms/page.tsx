"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store.js";
import {
  fetchRooms,
  deleteRoom,
  updateRoom,
  createRoom,
} from "@/redux/slices/roomsSlice";

type Room = {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  image?: string;
};

type FormData = {
  name: string;
  capacity: number;
  amenities: string;
  image: FileList;
};

const RoomPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type
  const { rooms, loading, error, pagination:{totalPages,totalRooms} } = useSelector(
    (state: RootState) => state.rooms
  );


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    reset();
  };

  const openEditModal = (room: Room) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setSelectedRoom(room);
    setValue("name", room.name);
    setValue("capacity", room.capacity);
    setValue("amenities", room.amenities.join(", "));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedRoom(null);
    reset();
  };

  // Fetch rooms with pagination
  useEffect(() => {
    dispatch(fetchRooms({ page: currentPage, limit: itemsPerPage,search:'',capacity:0 }));
  }, [dispatch, currentPage, itemsPerPage]);

  const handleDeleteRoom = async (id: string) => {
    try {
      await dispatch(deleteRoom(id)).unwrap(); // Dispatch the deleteRoom action
      alert("Room deleted successfully");
      dispatch(fetchRooms({ page: currentPage, limit: itemsPerPage,search:'',capacity:0 }));
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    }
  };

  // Handle room creation
  const handleCreateRoom = async (roomData: Omit<Room, "id">) => {
    try {
      await dispatch(createRoom(roomData)).unwrap(); // Dispatch the createRoom action
      alert("Room created successfully");
      dispatch(fetchRooms({ page: currentPage, limit: itemsPerPage,search:'',capacity:0 }));
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room");
    }
  };

  // Handle room update
  const handleUpdateRoom = async (roomData: Room) => {
    try {
      await dispatch(updateRoom(roomData)).unwrap();
      alert("Room updated successfully");
      dispatch(fetchRooms({ page: currentPage, limit: itemsPerPage,search:'',capacity:0 }));
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room");
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

    if (!apiKey) {
      console.error("IMGBB API key is missing.");
      return;
    }

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const imageData = await response.json();
    console.log("Uploaded Image URL:", imageData.data.url);

    return imageData.data.url;
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      let imageUrl = selectedRoom?.image;

      // Upload image if a new file is provided
      if (data.image && data.image[0]) {
        imageUrl = await uploadImage(data.image[0]);
      }

      // Prepare room data
      const roomData = {
        name: data.name,
        capacity: parseInt(data.capacity.toString()),
        amenities: data.amenities.split(",").map((item) => item.trim()),
        image: imageUrl,
      };

      if (isEditMode && selectedRoom) {
        // Update the room in the list
        const updatedRoom: Room = {
          id: selectedRoom.id,
          ...roomData,
        };
        console.log(updatedRoom);

        handleUpdateRoom(updatedRoom);
      } else {
        // Create a new room
        handleCreateRoom(roomData);
      }

      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };



  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="px-8">
      <h1 className="text-3xl font-bold mb-8">Room Management</h1>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600 transition duration-200"
      >
        Add Room
      </button>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Capacity</th>
              <th className="text-left py-3 px-4">Amenities</th>
              <th className="text-left py-3 px-4">Image</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms?.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{room.name}</td>
                <td className="py-3 px-4">{room.capacity}</td>
                <td className="py-3 px-4">{room.amenities.join(", ")}</td>
                <td className="py-3 px-4">
                  {room?.image && (
                    <img
                      src={room?.image}
                      alt={room?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => openEditModal(room)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Modal for Add/Edit Room */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {isEditMode ? "Edit Room" : "Add New Room"}
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Room Name
                      </label>
                      <input
                        type="text"
                        {...register("name", {
                          required: "Room name is required",
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Capacity
                      </label>
                      <input
                        type="number"
                        {...register("capacity", {
                          required: "Capacity is required",
                          min: {
                            value: 1,
                            message: "Capacity must be at least 1",
                          },
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.capacity && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.capacity.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amenities
                      </label>
                      <input
                        type="text"
                        {...register("amenities", {
                          required: "Amenities are required",
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Separate amenities with commas (e.g., Projector, Whiteboard)"
                      />
                      {errors.amenities && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.amenities.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image
                      </label>
                      <input
                        type="file"
                        {...register("image")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting} // Disable button during submission
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center"
                      >
                        {isSubmitting ? ( // Show spinner during submission
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : isEditMode ? (
                          "Update"
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RoomPage;
