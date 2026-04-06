const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /api/v1/contacts
// @access Private
const getContacts = asyncHandler(async(req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc Create a contact
// @route POST /api/v1/contacts
// @access Private
const createContact = asyncHandler(async(req, res) => {
  console.log("request body", req.body);
  const {name, email, phone} = req.body;
  if(!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id:req.user.id
  });
  res.status(201).json({ message: "Create Contact", data: contact });
});

// @desc Get a contact
// @route GET /api/v1/contacts/:id
// @access Private
const getContact = asyncHandler(async(req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    user_id: req.user.id,
  });
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  res.status(200).json(contact);
});

// @desc Update a contact by id
// @route PUT /api/v1/contacts/:id
// @access Private
const updateContact = asyncHandler(async (req, res) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (updatedContact) {
    return res.status(200).json(updatedContact);
  }

  const exists = await Contact.findById(req.params.id);
  if (exists) {
    return res.status(403).json({
      title: "Forbidden",
      message: "You do not have permission to update this contact",
    });
  }

  res.status(404);
  throw new Error("Contact not Found");
});

// @desc Delete a contact by id
// @route DELETE /api/v1/contacts/:id
// @access Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user.id,
  });

  if (contact) {
    return res.status(200).json(contact);
  }

  const exists = await Contact.findById(req.params.id);
  if (exists) {
    return res.status(403).json({
      title: "Forbidden",
      message: "You do not have permission to delete this contact",
    });
  }

  res.status(404);
  throw new Error("Contact not Found");
});


module.exports = {
                  getContacts, 
                  createContact, 
                  getContact, 
                  updateContact, 
                  deleteContact};