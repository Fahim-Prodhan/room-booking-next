"use client";
import baseUrl from "@/helper/baseUrl";
import { fetchRooms } from "@/redux/slices/roomsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminPage: NextPage = () => {
  const [limit] = useState(10);

  const [totalBookings, setTotalBookings] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const {
    pagination: { totalRooms },
  } = useSelector((state: RootState) => state.rooms);

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 6, search: "", capacity: 0 }));
  }, [dispatch]);

  const fetchBookingsAdmin = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/bookings`);
      const data = await response.json();
      setTotalBookings(data.totalBookings);
    } catch (error) {
      console.error("Error fetching admin bookings data:", error);
    }
  };

  useEffect(() => {
    fetchBookingsAdmin();
  }, []);

  const metrics = [
    { title: "Total Rooms", value: totalRooms, change: "+2%" },
    { title: "Total Bookings", value: totalBookings, change: "+5%" },
    { title: "Active Users", value: 5, change: "+10%" },
    { title: "Revenue", value: "$5,000", change: "+8%" },
  ];

  const recentBookings = [
    {
      id: 1,
      room: "Conference Room A",
      user: "John Doe",
      date: "2023-10-15",
      status: "Confirmed",
    },
    {
      id: 2,
      room: "Meeting Room B",
      user: "Jane Smith",
      date: "2023-10-16",
      status: "Pending",
    },
    {
      id: 3,
      room: "Training Room C",
      user: "Alice Johnson",
      date: "2023-10-17",
      status: "Cancelled",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg text-gray-600">{metric.title}</h3>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
            <p className="text-sm text-green-500 mt-1">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Room</th>
              <th className="text-left py-2">User</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{booking.room}</td>
                <td className="py-3">{booking.user}</td>
                <td className="py-3">{booking.date}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
