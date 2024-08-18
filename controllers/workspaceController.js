const Workspace = require('../models/Workspace');
const bcrypt = require('bcryptjs');

// Get all workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workspaces: ' + error.message });
  }
};

// Get single workspace
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workspace: ' + error.message });
  }
};

// Create a new workspace
exports.createWorkspace = async (req, res) => {
  const { name, email, phone, address, logo, password } = req.body;
  try {
    if (await Workspace.findOne({ email })) {
      return res.status(400).json({ message: 'Workspace already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const workspace = new Workspace({
      name,
      email,
      phone,
      address,
      logo,
      password: hashedPassword
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Error creating workspace: ' + error.message });
  }
};

// Update an existing workspace
exports.updateWorkspace = async (req, res) => {
  const { name, email, phone, address, logo, password } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    workspace.name = name || workspace.name;
    workspace.email = email || workspace.email;
    workspace.phone = phone || workspace.phone;
    workspace.address = address || workspace.address;
    workspace.logo = logo || workspace.logo;

    if (password) {
      workspace.password = await bcrypt.hash(password, 10);
    }

    await workspace.save();
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workspace: ' + error.message });
  }
};

// Delete a workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    await workspace.remove();
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workspace: ' + error.message });
  }
};