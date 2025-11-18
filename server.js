import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✔ Route: Home
app.get("/", (req, res) => {
  res.send("Supabase + Express CRUD API is running!");
});

// ---------------------------------------------
// ✔ CREATE (POST)
// ---------------------------------------------
app.post("/todos", async (req, res) => {
  const { title } = req.body;

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title, done: false }]);

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

// ---------------------------------------------
// ✔ READ ALL (GET)
// ---------------------------------------------
app.get("/todos", async (req, res) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

// ---------------------------------------------
// ✔ READ by ID (GET)
// ---------------------------------------------
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("todos")
    .select()
    .eq("id", id)
    .single();

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

// ---------------------------------------------
// ✔ UPDATE (PUT)
// ---------------------------------------------
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  const { data, error } = await supabase
    .from("todos")
    .update({ title, done })
    .eq("id", id);

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

// ---------------------------------------------
// ✔ DELETE (DELETE)
// ---------------------------------------------
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
