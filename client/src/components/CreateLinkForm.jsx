import { useState } from "react";

function CreateLinkForm({ onCreated }) {
  const [slug, setSlug] = useState("");
  const [destination, setDestination] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Slug must be lowercase alphanumeric with hyphens (e.g. my-link)");
      return;
    }

    try {
      new URL(destination);
    } catch {
      setError("Enter a valid URL (e.g. https://example.com)");
      return;
    }

    setLoading(true);
    try {
      await onCreated({ slug, destination, expiresAt: expiresAt || null });
      setSlug("");
      setDestination("");
      setExpiresAt("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2 className="create-form-title">Create New Link</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <div className="input-prefix-wrap">
            <span className="input-prefix">pb.pointblank.club/</span>
            <input
              id="slug"
              type="text"
              placeholder="my-link"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
              required
            />
          </div>
        </div>

        <div className="form-group form-group-grow">
          <label htmlFor="destination">Destination URL</label>
          <input
            id="destination"
            type="url"
            placeholder="https://example.com/very-long-url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiresAt">Expires (optional)</label>
          <input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Link"}
      </button>
    </form>
  );
}

export default CreateLinkForm;
