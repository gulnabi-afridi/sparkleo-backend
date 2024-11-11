import bcrypt from "bcryptjs";
import dbconfig from "../config/db.js";
import jwt from "jsonwebtoken";
import { LogError } from "../utils/consoles.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";

// sign up ----->

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Step 1: Basic validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  // Step 2: Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Step 3: Check if email is already registered in the database
  dbconfig.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        LogError("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Step 4: If user already exists
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already registered." });
      }

      try {
        // Step 5: Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 6: Insert new user into the database
        dbconfig.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err, results) => {
            if (err) {
              LogError("Error inserting user:", err);
              return res.status(500).json({ message: "Error creating user." });
            }

            // Step 7: Generate JWT token
            const userId = results.insertId;
            const token = jwt.sign({ id: userId, email }, JWT_SECRET_KEY, {
              expiresIn: "1h",
            });

            // Step 8: Send response
            res.status(201).json({
              message: "User created successfully!",
              token,
            });
          }
        );
      } catch (err) {
        LogError("Error hashing password:", err);
        return res.status(500).json({ message: "Error creating user." });
      }
    }
  );
};

// sign in ---->

export const signin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  dbconfig.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        LogError("Database query error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        LogError(req.method, "user not found!", err);
        return res.status(400).json({ message: "user not found!" });
      }

      //   console.log(results);

      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Signin successful!",
        token,
      });
    }
  );
};
