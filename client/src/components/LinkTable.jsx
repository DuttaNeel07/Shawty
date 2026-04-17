import { useState } from "react";

function LinkTable({ links, onDelete, onToggle }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (slug) => {
    navigator.clipboard.writeText(`pb.pointblank.club/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (expiresAt) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  if (links.length === 0) {
    return (
      <div className="empty-state">
        <p>No links yet. Create your first short link above.</p>
      </div>
    );
  }

  return (
    <div className="link-table-wrap">
      <table className="link-table">
        <thead>
          <tr>
            <th>Short Link</th>
            <th>Destination</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link._id} className={!link.isActive || isExpired(link.expiresAt) ? "row-inactive" : ""}>
              <td>
                <button
                  className="slug-copy-btn"
                  onClick={() => copyToClipboard(link.slug)}
                  title="Click to copy"
                >
                  <span className="slug-text">/{link.slug}</span>
                  <span className="copy-icon">
                    {copied === link.slug ? "✓" : "⎘"}
                  </span>
                </button>
              </td>
              <td>
                <a
                  href={link.destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dest-link"
                >
                  {link.destination.length > 45
                    ? link.destination.substring(0, 45) + "..."
                    : link.destination}
                </a>
              </td>
              <td>
                <span className="click-count">{link.clickCount}</span>
              </td>
              <td>
                {isExpired(link.expiresAt) ? (
                  <span className="badge badge-expired">Expired</span>
                ) : (
                  <button
                    className={`badge ${link.isActive ? "badge-active" : "badge-inactive"}`}
                    onClick={() => onToggle(link._id, !link.isActive)}
                  >
                    {link.isActive ? "Active" : "Disabled"}
                  </button>
                )}
              </td>
              <td className="date-cell">{formatDate(link.createdAt)}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(link._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LinkTable;
