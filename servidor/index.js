const express = require("express");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const cors = require("cors");
const app = express();
const PORT = 8800;
const { check, validationResult } = require("express-validator");

const contactSchema = new Schema(
  {
    name: { type: String },
    surname: { type: String },
    age: { type: Number },
    dni: { type: String },
    birthday: { type: String },
    color: { type: String },
    gender: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contact = model("contact", contactSchema);

// Conectamos con la database
mongoose
  .connect("mongodb://localhost/contacts", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("Database connection successful"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuramos el servidor
app.listen(PORT, () => {
  console.log("Server working fine :)");
});

// Publica la lista en /contacts
app.get("/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// VALIDACIÓN
const valid_contact = [
  check("name", "The name must contain more than 3 characters and no numbers")
    .isLength({ min: 3 })
    .isAlpha(),
  check(
    "surname",
    "The surname must contain more than 3 characters and no numbers"
  )
    .isLength({ min: 3 })
    .isAlpha(),
  check("age", "The age must be a number between 0 and 125").isInt({
    min: 0,
    max: 125,
  }),
  check("dni", "The ID must contain 9 characters").isLength({ min: 9, max: 9 }),
  check("birthday", "The date must be in ISO8601 format").isDate(),
  check(
    "color",
    "The color can't contain numbers and it must have more than 3 characters"
  )
    .isLength({ min: 3 })
    .isAlpha(),
  check("gender", "You have to choose between 'Male, Female, Other, Unspecified'").isIn(['Male', 'Female', 'Other', 'Unspecified']),
];

// Para añadir contacto a la lista (POST)
app.post("/contact", valid_contact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ errors: errors.array() });
  } else {
    const nuevoContacto = new Contact(req.body);
    await nuevoContacto.save();
    res.send({ message: "New contact created." });
  }
});

// Para actualizar contacto
app.put("/contact/:id", valid_contact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ errors: errors.array() });
  } else {
    const contactUpdated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json({ status: "Contact updated." });
  }
});

// Para borrar contacto
app.delete("/contact/:id", async (req, res) => {
  const contactDeleted = await Contact.findByIdAndDelete(req.params.id);
  res.json({ status: "Contact deleted." });
});

// Para visualizar un contacto específico
app.get("/contact/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.send(contact);
});
