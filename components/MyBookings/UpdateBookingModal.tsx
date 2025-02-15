"use client";
import baseUrl from "@/helper/baseUrl";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type UpdateBookingModalProps = {
  bookingId: string;
  roomName: string;
  existingData: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh data after update
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

const UpdateBookingModal: React.FC<UpdateBookingModalProps> = ({
  bookingId,
  roomName,
  existingData,
  onClose,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(existingData.date);
  const timeSlots = generateTimeSlots();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormInputs>();

  useEffect(() => {
    // Pre-fill form fields with existing data
    setValue("title", existingData.title);
    setValue("description", existingData.description);
    setValue("date", existingData.date);
    setValue("startTime", existingData.startTime);
    setValue("endTime", existingData.endTime);
  }, [existingData, setValue]);

  const onSubmit: SubmitHandler<BookingFormInputs> = async (data) => {
    setLoading(true);
    setError("");

    const startTime = `${selectedDate}T${data.startTime}:00.000Z`;
    const endTime = `${selectedDate}T${data.endTime}:00.000Z`;

    try {
      const response = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          startTime,
          endTime,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update booking");
      }

      alert("Booking updated successfully!");
      onUpdate(); // Refresh data
      onClose();
    } catch (err: any) {
      setError(err.message || "Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Booking for {roomName}</h2>
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
              {...register("date", { required: "Date is required" })}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
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
              {loading ? "Updating..." : "Update"}
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

export default UpdateBookingModal;
