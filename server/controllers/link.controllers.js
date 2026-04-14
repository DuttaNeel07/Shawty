const Link = require('../models/Link');

exports.createLink = async (req, res) => {
  try {
    const { slug, destination, expiresAt } = req.body;

    try { new URL(destination); }
    catch { return res.status(400).json({ error: 'Invalid destination URL' }); }

    const existing = await Link.findOne({ slug });
    if (existing) {
      return res.status(409).json({ error: 'Slug already taken' });
    }

    const link = await Link.create({
      slug,
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
    await Link.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  
    );
    res.json(link);
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