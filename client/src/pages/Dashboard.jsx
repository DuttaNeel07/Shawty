import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllLinks, createLink, deleteLink, updateLink } from "../api/links";
import Navbar from "../components/Navbar";
import CreateLinkForm from "../components/CreateLinkForm";
import LinkTable from "../components/LinkTable";

function Dashboard() {
  const { token } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLinks = async () => {
    try {
      setError("");
      const data = await getAllLinks(token);
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreate = async (linkData) => {
    const created = await createLink(token, linkData);
    setLinks((prev) => [created, ...prev]);
  };

  const handleDelete = async (id) => {
    await deleteLink(token, id);
    setLinks((prev) => prev.filter((l) => l._id !== id));
  };

  const handleToggle = async (id, isActive) => {
    const updated = await updateLink(token, id, { isActive });
    setLinks((prev) => prev.map((l) => (l._id === id ? updated : l)));
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Your Links</h1>
          <p className="dashboard-subtitle">
            {links.length} link{links.length !== 1 ? "s" : ""} created
          </p>
        </div>

        <CreateLinkForm onCreated={handleCreate} />

        {error && <p className="dashboard-error">{error}</p>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading links...</p>
          </div>
        ) : (
          <LinkTable
            links={links}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
