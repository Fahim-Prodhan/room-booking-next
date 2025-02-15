"use client";
import baseUrl from "@/helper/baseUrl";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type BookingModalProps = {
  roomId: string;
  roomName: string;
  onClose: () => void;
};

type BookingFormInputs = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
};

const generateTimeSlots = () => {
  const slots: string[] = [];
  let hour = 9;
  let minute = 0;

  while (hour < 17 || (hour === 17 && minute === 0)) {
    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    slots.push(formattedTime);

    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }

  return slots;
};

const BookingModal: React.FC<BookingModalProps> = ({ roomId, roomName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const timeSlots = generateTimeSlots();

  const user = useUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormInputs>();

  const onSubmit: SubmitHandler<BookingFormInputs> = async (data) => {
    if (!selectedDate) {
      setError("Please select a date first.");
      return;
    }

    setLoading(true);
    setError("");

    const startTime = `${selectedDate}T${data.startTime}:00.000Z`;
    const endTime = `${selectedDate}T${data.endTime}:00.000Z`;

    try {
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          userId: user.user?.id,
          title: data.title,
          description: data.description,
          startTime,
          endTime,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create booking");
      }

      alert("Booking successful!");
      onClose();
    } catch (err: any) {
      setError(err.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Book {roomName}</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Booking Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter booking title"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded-md h-20"
              {...register("description")}
              placeholder="Enter booking description"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Select Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded-md"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Start Time</label>
            <select
              className="w-full border p-2 rounded-md"
              {...register("startTime", { required: "Start time is required" })}
              disabled={!selectedDate}
            >
              <option value="">Select Start Time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">End Time</label>
            <select
              className="w-full border p-2 rounded-md"
              {...register("endTime", { required: "End time is required" })}
              disabled={!selectedDate}
            >
              <option value="">Select End Time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
          </div>

          <div className="flex justify-between">
            <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              {loading ? "Booking..." : "Confirm"}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
