const Link = require('../models/Link');

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

exports.createLink = async (req, res) => {
  try {
    const { slug, destination, expiresAt } = req.body;

    if (!slug || !destination) {
      return res.status(400).json({ error: 'Slug and destination are required' });
    }

    if (!SLUG_REGEX.test(slug.toLowerCase())) {
      return res.status(400).json({ error: 'Slug must be lowercase alphanumeric with hyphens only (e.g. my-link)' });
    }

    try { new URL(destination); }
    catch { return res.status(400).json({ error: 'Invalid destination URL' }); }

    const existing = await Link.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Slug already taken' });
    }

    const link = await Link.create({
      slug: slug.toLowerCase(),
      destination,
      createdBy: req.user.email,
      expiresAt: expiresAt || null,
    });

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (link.createdBy !== req.user.email) {
      return res.status(403).json({ error: 'You can only delete your own links' });
    }

    await Link.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ALLOWED_UPDATE_FIELDS = ['destination', 'isActive', 'expiresAt'];

exports.updateLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (link.createdBy !== req.user.email) {
      return res.status(403).json({ error: 'You can only edit your own links' });
    }

    const updates = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.destination) {
      try { new URL(updates.destination); }
      catch { return res.status(400).json({ error: 'Invalid destination URL' }); }
    }

    const updated = await Link.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLinkStats = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json({ slug: link.slug, clickCount: link.clickCount, createdAt: link.createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.redirect = async (req, res) => {
  try {
    const { slug } = req.params;

    const link = await Link.findOneAndUpdate(
      {
        slug,
        isActive: true,
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
        ]
      },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(404).send('Link not found or expired');
    }

    res.redirect(302, link.destination);
  } catch (error) {
    res.status(500).send('Server error');
  }
};