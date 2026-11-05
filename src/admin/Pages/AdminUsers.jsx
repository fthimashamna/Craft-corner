import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3001";

  // FETCH USERS AND ADMINS
  const fetchUsers = async () => {
    try {
      const [usersResponse, adminsResponse] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/admins`),
      ]);

      const normalUsers = usersResponse.data.map((user) => ({
        ...user,
        role: "User",
        accountType: "user",
      }));

      const adminUsers = adminsResponse.data.map((admin) => ({
        ...admin,
        role: "Admin",
        accountType: "admin",
      }));

      setUsers([...adminUsers, ...normalUsers]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users and admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // BLOCK / UNBLOCK USER
  const handleToggleBlock = async (user) => {
    if (user.accountType === "admin") {
      toast.error("Admin accounts cannot be blocked here.");
      return;
    }

    const isBlocked = user.status === "blocked";
    const newStatus = isBlocked ? "active" : "blocked";

    try {
      const response = await axios.patch(
        `${API_URL}/users/${user.id}`,
        { status: newStatus }
      );

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.accountType === "user" &&
          String(item.id) === String(user.id)
            ? {
                ...response.data,
                role: "User",
                accountType: "user",
              }
            : item
        )
      );

      if (
        selectedUser &&
        selectedUser.accountType === "user" &&
        String(selectedUser.id) === String(user.id)
      ) {
        setSelectedUser({
          ...response.data,
          role: "User",
          accountType: "user",
        });
      }

      toast.success(
        isBlocked
          ? "User unblocked successfully!"
          : "User blocked successfully!"
      );
    } catch (error) {
      console.error("Block user error:", error);
      toast.error("Failed to update user status");
    }
  };

  // SEARCH AND ROLE FILTER
  const filteredUsers = users.filter((user) => {
    const name = String(
      user.name || user.username || ""
    ).toLowerCase();

    const email = String(user.email || "").toLowerCase();
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      name.includes(search) || email.includes(search);

    const matchesRole =
      selectedRole === "all" ||
      user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // SUMMARY COUNTS
  const totalAdmins = users.filter(
    (user) => user.accountType === "admin"
  ).length;

  const totalNormalUsers = users.filter(
    (user) => user.accountType === "user"
  ).length;

  const styles = {
    page: {
      padding: "30px",
      color: "#5C3A25",
      minHeight: "100vh",
      backgroundColor: "#FAF6F0",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
    },

    heading: {
      fontSize: "16px",
      fontFamily: "Georgia, serif",
    },

    description: {
      color: "#8B735F",
      fontSize: "16px",
    },

    card: {
      backgroundColor: "#FFFFFF",
      padding: "22px",
      borderRadius: "12px",
      boxShadow: "0 3px 10px rgba(92, 58, 37, 0.08)",
      marginBottom: "25px",
    },

    input: {
      width: "100%",
      maxWidth: "400px",
      padding: "12px",
      border: "1px solid #D6C2AD",
      borderRadius: "7px",
      outline: "none",
      fontSize: "16px",
      fontFamily: "Georgia, serif",
      boxSizing: "border-box",
      backgroundColor: "#F5EBDD",
      color: "#5C3A25",
    },

    select: {
      padding: "12px",
      border: "1px solid #D6C2AD",
      borderRadius: "7px",
      outline: "none",
      fontSize: "16px",
      fontFamily: "Georgia, serif",
      backgroundColor: "#F5EBDD",
      color: "#5C3A25",
      cursor: "pointer",
    },

    tableWrapper: {
      overflowX: "auto",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1000px",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
    },

    th: {
      backgroundColor: "#5C3A25",
      color: "#FFFFFF",
      padding: "14px",
      textAlign: "left",
      fontSize: "16px",
    },

    td: {
      padding: "14px",
      borderBottom: "1px solid #E9DED2",
      fontSize: "16px",
    },

    button: {
      padding: "8px 12px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "4px",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Users Management</h1>

      <p style={styles.description}>
        View and manage registered Craftiva users and admins.
      </p>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={styles.card}>
          <h3 style={{ fontSize: "16px" }}>Total Accounts</h3>
          <h2 style={{ fontSize: "22px" }}>{users.length}</h2>
        </div>

        <div style={styles.card}>
          <h3 style={{ fontSize: "16px" }}>Total Admins</h3>
          <h2 style={{ fontSize: "22px" }}>{totalAdmins}</h2>
        </div>

        <div style={styles.card}>
          <h3 style={{ fontSize: "16px" }}>Total Users</h3>
          <h2 style={{ fontSize: "22px" }}>{totalNormalUsers}</h2>
        </div>
      </div>

      {/* SEARCH AND ROLE FILTER */}
      <div style={styles.card}>
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={styles.input}
          />

          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            style={styles.select}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      {/* REGISTERED ACCOUNTS */}
      <div style={styles.card}>
        <h2 style={{ fontSize: "16px" }}>
          Registered Accounts
        </h2>

        {loading ? (
          <p>Loading accounts...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={`${user.accountType}-${user.id}`}>
                    <td style={styles.td}>{user.id}</td>

                    <td style={styles.td}>
                      {user.name || user.username || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {user.email || "N/A"}
                    </td>

                    {/* ROLE */}
                    <td style={styles.td}>
                      <span
                        style={{
                          backgroundColor:
                            user.role === "Admin"
                              ? "#E8D8C3"
                              : "#E5EFE5",
                          color:
                            user.role === "Admin"
                              ? "#70452F"
                              : "#287A3D",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td style={styles.td}>
                      <span
                        style={{
                          backgroundColor:
                            user.status === "blocked"
                              ? "#F8D7DA"
                              : "#D8EEDC",
                          color:
                            user.status === "blocked"
                              ? "#A33A3A"
                              : "#287A3D",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "14px",
                        }}
                      >
                        {user.status === "blocked"
                          ? "Blocked"
                          : "Active"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td style={styles.td}>
                      <button
                        type="button"
                        style={{
                          ...styles.button,
                          backgroundColor: "#A68A70",
                          color: "#FFFFFF",
                        }}
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>

                      {user.accountType === "user" ? (
                        <button
                          type="button"
                          style={{
                            ...styles.button,
                            backgroundColor:
                              user.status === "blocked"
                                ? "#71866A"
                                : "#8B5E4A",
                            color: "#FFFFFF",
                          }}
                          onClick={() => handleToggleBlock(user)}
                        >
                          {user.status === "blocked"
                            ? "Unblock"
                            : "Block"}
                        </button>
                      ) : (
                        <span
                          style={{
                            color: "#8B735F",
                            fontSize: "13px",
                          }}
                        >
                          Admin Account
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
            fontFamily: "Georgia, serif",
            fontSize: "16px",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              backgroundColor: "#FAF6F0",
              padding: "30px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "450px",
              boxShadow: "0 5px 25px rgba(0, 0, 0, 0.2)",
              color: "#5C3A25",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px" }}>
                Account Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{
                  backgroundColor: "#5C3A25",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontFamily: "Georgia, serif",
                }}
              >
                X
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "20px",
                borderRadius: "8px",
                lineHeight: "2",
              }}
            >
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {selectedUser.name ||
                  selectedUser.username ||
                  "N/A"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedUser.email || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedUser.phone || "N/A"}
              </p>

              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.status === "blocked"
                  ? "Blocked"
                  : "Active"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                backgroundColor: "#5C3A25",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "Georgia, serif",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;