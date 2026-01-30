import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

export default function Dashboard() {
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const [range, setRange] = useState("monthly");

  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    totalPrice: 0,
    visits: 0,
  });

  /* ================= FETCH BAR CHART ================= */
  useEffect(() => {
    const fetchBar = async () => {
      const res = await api.get("/admin/chart/users-listings");

      const merged = {};

      res.data.users.forEach((u) => {
        merged[u.date] = { date: u.date, users: u.users, listings: 0 };
      });

      res.data.listings.forEach((l) => {
        if (!merged[l.date]) {
          merged[l.date] = { date: l.date, users: 0, listings: l.listings };
        } else {
          merged[l.date].listings = l.listings;
        }
      });

      const finalData = Object.values(merged);
      setBarData(finalData);

      // Stats
      const totalUsers = finalData.reduce((sum, d) => sum + d.users, 0);
      const totalListings = finalData.reduce((sum, d) => sum + d.listings, 0);

      setStats((prev) => ({
        ...prev,
        users: totalUsers,
        listings: totalListings,
      }));
    };

    fetchBar();
  }, []);

  /* ================= FETCH LINE CHART ================= */
  useEffect(() => {
    const fetchLine = async () => {
      const res = await api.get("/admin/chart/visits");

      const formatted = res.data.map((row) => ({
        date: row.date,
        visits: row.visits,
      }));

      setLineData(formatted);

      const totalVisits = formatted.reduce((sum, d) => sum + d.visits, 0);

      setStats((prev) => ({
        ...prev,
        visits: totalVisits,
      }));
    };

    fetchLine();
  }, []);

  /* ================= FETCH PIE CHART ================= */
  useEffect(() => {
    const fetchPie = async () => {
      const res = await api.get("/admin/chart/categories");

      const formatted = res.data.map((row) => ({
        name: row.category,
        value: row.total,
      }));

      setPieData(formatted);

      const totalPrice = formatted.reduce((sum, d) => sum + d.value, 0);

      setStats((prev) => ({
        ...prev,
        totalPrice,
      }));
    };

    fetchPie();
  }, []);

  /* ================= FILTER BY RANGE (FRONTEND ONLY) ================= */

  const filterByRange = (data) => {
    const now = new Date();

    if (range === "weekly") {
      return data.slice(-7);
    }

    if (range === "yearly") {
      return data.slice(-365);
    }

    // monthly default
    return data.slice(-30);
  };

  const filteredBar = filterByRange(barData);
  const filteredLine = filterByRange(lineData);

  return (
    <div className="dashboard-root">
      <h3>Analytics Overview</h3>

      {/* ================= STATS BLOCKS ================= */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <h4>Total Users</h4>
          <p>{stats.users}</p>
        </div>

        <div className="stat-card green">
          <h4>Total Listings</h4>
          <p>{stats.listings}</p>
        </div>

        <div className="stat-card orange">
          <h4>Total Category Data</h4>
          <p>{stats.totalPrice}</p>
        </div>

        <div className="stat-card blue">
          <h4>Total Visits</h4>
          <p>{stats.visits}</p>
        </div>
      </div>

      <hr></hr>
      <hr></hr>

      {/* ================= RANGE DROPDOWN ================= */}
      <div className="range-bar">
        <span>Show Data:</span>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="chart-box">
        <h4>Users vs Listings</h4>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="users" fill="#6366f1" name="Users" />
            <Bar dataKey="listings" fill="#22c55e" name="Listings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= LINE CHART ================= */}
      <div className="chart-box">
        <h4>User Visits</h4>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={filteredLine}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="visits"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE CHART ================= */}
      <div className="chart-box full">
        <h4>Listings by Category</h4>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
