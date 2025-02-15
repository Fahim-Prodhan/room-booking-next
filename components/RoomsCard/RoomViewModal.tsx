import { FC } from "react";

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

interface RoomViewModalProps {
  room: Room;
  onClose: () => void;
}

const RoomViewModal: FC<RoomViewModalProps> = ({ room, onClose }) => {
    
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 font-bold text-xl"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">{room.name}</h2>
        {room?.image && (
          <img src={room.image} alt={room.name} className="w-full h-48 object-cover rounded-lg mb-4" />
        )}
        <div className="mb-4">
          <p className="text-gray-700"><strong>Capacity:</strong> {room.capacity}</p>
          <p className="text-gray-700">
            <strong>Amenities:</strong> {room.amenities && room.amenities.length > 0 ? room.amenities.join(", ") : "No amenities available"}
          </p>
          {/* <p className="text-gray-700"><strong>Created At:</strong> {new Date(room.createdAt).toLocaleString()}</p>
          <p className="text-gray-700"><strong>Updated At:</strong> {new Date(room.updatedAt).toLocaleString()}</p> */}
        </div>
        <h3 className="text-xl font-semibold mb-2">Bookings:</h3>
        <ul className="list-disc pl-5">
          {(room.bookings && room.bookings.length > 0) ? (
            room.bookings.map((booking, index) => (
              <li key={index}>
                <strong>{booking.title}</strong>: {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
              </li>
            ))
          ) : (
            <p>No bookings yet.</p>
          )}
        </ul>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

export default RoomViewModal;
