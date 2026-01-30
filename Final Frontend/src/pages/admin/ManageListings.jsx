import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  getListings,
  deleteListing,
  updateListingStatus,
} from "../../services/adminApi";
import "./ManageListings.css";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

export default function ManageListings() {
  const [allListings, setAllListings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [timePeriod, setTimePeriod] = useState("monthly"); // weekly, monthly, yearly

  const limit = 8;

  /* ================= FETCH LISTINGS ================= */
  const fetchListings = async () => {
    try {
      const res = await getListings();
      setAllListings(res.data.listings || res.data || []);
    } catch (err) {
      toast.error("Failed to load listings");
      console.error("FETCH LISTINGS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  /* ================= TIME PERIOD FILTERING ================= */
  const getFilteredListingsByTimePeriod = () => {
    const now = new Date();
    let filteredByTime = allListings.filter((listing) => {
      if (!listing.created_at) return false;
      const listingDate = new Date(listing.created_at);

      if (timePeriod === "weekly") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return listingDate >= weekAgo;
      } else if (timePeriod === "monthly") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return listingDate >= monthAgo;
      } else if (timePeriod === "yearly") {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return listingDate >= yearAgo;
      }
      return true;
    });

    return filteredByTime;
  };

  const listingsByTimePeriod = getFilteredListingsByTimePeriod();

  /* ================= STATS ================= */

  const totalListings = listingsByTimePeriod.length;
  const totalValue = listingsByTimePeriod.reduce(
    (sum, l) => sum + (parseFloat(l.price) || 0),
    0,
  );

  const categoryMap = {};
  listingsByTimePeriod.forEach((l) => {
    const cat = l.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  /* ================= TIME SERIES CHART DATA ================= */
  const getTimeSeriesData = () => {
    const data = {};

    listingsByTimePeriod.forEach((listing) => {
      if (!listing.created_at) return;
      const date = new Date(listing.created_at);

      let key;
      if (timePeriod === "weekly") {
        // Day-wise for weekly
        key = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      } else if (timePeriod === "monthly") {
        // Day-wise for monthly
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (timePeriod === "yearly") {
        // Month-wise for yearly
        key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      data[key] = (data[key] || 0) + 1;
    });

    return Object.keys(data)
      .sort()
      .map((key) => ({
        name: key,
        count: data[key],
      }));
  };

  const timeSeriesData = getTimeSeriesData();

  /* ================= SEARCH ================= */
  let filteredListings = allListings.filter((item) => {
    const text = `${item.id} ${item.title} ${item.category}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  /* ================= FILTER BY CATEGORY ================= */
  if (filterCategory !== "all") {
    filteredListings = filteredListings.filter(
      (l) => l.category === filterCategory,
    );
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredListings.length / limit);
  const start = (page - 1) * limit;
  const currentListings = filteredListings.slice(start, start + limit);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await deleteListing(id);
      toast.success("Listing deleted");
      setAllListings(allListings.filter((l) => l.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateListingStatus(id, newStatus);
      toast.success(`Listing ${newStatus} successfully`);
      setAllListings(
        allListings.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
      );
    } catch (err) {
      toast.error("Failed to update status");
      console.error("STATUS UPDATE ERROR:", err);
    }
  };

  const categories = ["all", ...Object.keys(categoryMap)];

  return (
    <div className="listings-root">
      <h3>Manage Listings</h3>

      {/* ================= TIME PERIOD DROPDOWN ================= */}
      <div className="time-period-selector">
        <label htmlFor="timePeriod">Filter by:</label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* ================= STATS BLOCKS ================= */}
      <div className="stats-grid-2col">
        <div className="stat-card purple">
          <span>Total Listings</span>
          <strong>{totalListings}</strong>
        </div>

        <div className="stat-card green">
          <span>Total Value</span>
          <strong>₹ {totalValue.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      {/* ================= TIME SERIES CHART ================= */}
      <div className="chart-box">
        <h4>
          Products Added{" "}
          {timePeriod === "weekly"
            ? "Weekly"
            : timePeriod === "monthly"
              ? "Monthly"
              : "Yearly"}
        </h4>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE CHART ================= */}
      <div className="chart-box">
        <h4>Listings by Category</h4>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
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

      <hr />

      {/* ================= SEARCH BAR ================= */}
      <div className="listings-top">
        <input
          type="text"
          placeholder="Search by ID, name or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* ================= CATEGORY FILTER PILLS ================= */}
      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={filterCategory === cat ? "active" : ""}
            onClick={() => {
              setFilterCategory(cat);
              setPage(1);
            }}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="listings-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Seller</th>
              <th>Date Added</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentListings.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No listings found
                </td>
              </tr>
            ) : (
              currentListings.map((item) => {
                const imageSrc = item.image
                  ? item.image.startsWith("/uploads")
                    ? `https://frontend-nkg1.onrender.com${item.image}`
                    : item.image
                  : "/no-image.png";

                const statusColor = {
                  pending: "#f59e0b",
                  approved: "#22c55e",
                  rejected: "#ef4444",
                };

                return (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={imageSrc}
                        alt={item.title}
                        className="listing-avatar"
                      />
                    </td>

                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.seller_name}</td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>₹ {item.price}</td>

                    <td>
                      <select
                        className="status-dropdown"
                        value={item.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
                        }
                        style={{
                          borderColor: statusColor[item.status || "pending"],
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="action-icons">
                      <i
                        className="fa-solid fa-trash delete-icon"
                        onClick={() => handleDelete(item.id)}
                      ></i>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
