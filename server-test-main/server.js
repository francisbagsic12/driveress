// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

app.use(express.json());
app.use(bodyParser.json());
const io = socketIo(server, {
  cors: { origin: "*" },
});
// const JWT_SECRET = ""; // Store this securely
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ai-driven",
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Add PUT and OPTIONS
    credentials: true,
  })
);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});
let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("sendLocation", (data) => {
    const { lat, lng, village, town, state, userId } = data;

    if (!village || !town || !state || !userId) {
      console.warn("Incomplete address or missing userId, location not saved");
      return;
    }

    // Check if location already exists for this userId
    const checkQuery = "SELECT id FROM locations WHERE userId = ?";
    db.query(checkQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error checking location:", err);
        return;
      }

      if (results.length > 0) {
        console.log("Location already exists for user:", userId);
        users[socket.id] = {
          lat,
          lng,
          village,
          town,
          state,
          locationId: results[0].id,
        };
      } else {
        const insertQuery = `
        INSERT INTO locations (userId, socketId, village, town, state, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
        db.query(
          insertQuery,
          [userId, socket.id, village, town, state, lat, lng],
          (err, result) => {
            if (err) {
              console.error("Error saving location:", err);
            } else {
              users[socket.id] = {
                lat,
                lng,
                village,
                town,
                state,
                locationId: result.insertId,
              };
              console.log("New location saved for user:", userId);
            }
          }
        );
      }

      io.emit("updateLocations", users);
    });
  });

  socket.on("getReports", () => {
    const query = `
      SELECT reports.*, locations.village, locations.town, locations.state
      FROM reports
      LEFT JOIN locations ON reports.locationId = locations.id
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching reports:", err);
      } else {
        socket.emit("updateReports", rows); // send to requesting client
      }
    });
  });

  socket.on("sendReport", (report) => {
    const {
      reporterName,
      householdCount,
      urgency,
      helpTypes,
      message,
      additionalInfo,
      lat,
      lng,
    } = report;

    const locationId = users[socket.id]?.locationId || null;

    const query = `
      INSERT INTO reports (
        locationId, socketId, reporterName, householdCount, urgency,
        helpTypes, message, additionalInfo, lat, lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        locationId,
        socket.id,
        reporterName,
        householdCount,
        urgency,
        JSON.stringify(helpTypes),
        message,
        additionalInfo,
        lat,
        lng,
      ],
      (err) => {
        if (err) {
          console.error("Error saving report:", err);
        } else {
          console.log("Report saved for:", socket.id);
        }
      }
    );
    db.query(
      "SELECT reports.*, locations.village, locations.town, locations.state FROM reports LEFT JOIN locations ON reports.locationId = locations.id",
      (err, rows) => {
        if (!err) {
          io.emit("updateReports", rows);
        }
      }
    );
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateLocations", users);
    console.log("User disconnected:", socket.id);
  });
});

app.get("/api/reports", (req, res) => {
  const query = `
    SELECT 
      reports.id,
      reports.reporterName AS author,
      reports.urgency AS category,
      reports.message AS content,
      reports.householdCount,
      reports.helpTypes,
      reports.additionalInfo,
      reports.timestamp AS date,
      reports.lat,
      reports.lng,
      locations.village,
      locations.town,
      locations.state
    FROM reports
    LEFT JOIN locations ON reports.locationId = locations.id
    ORDER BY reports.timestamp DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Parse helpTypes from JSON string to array
    const parsedResults = results.map((report) => ({
      ...report,
      helpTypes: (() => {
        try {
          const parsed = JSON.parse(report.helpTypes);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })(),
    }));

    res.status(200).json(parsedResults);
  });
});
app.get("/d", (req, res) => {
  return res.send("d");
});

app.post("/api/resources", (req, res) => {
  const { name, quantity, category } = req.body;

  if (!name || !quantity || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO resources (name, quantity, category)
    VALUES (?, ?, ?)
  `;

  db.query(query, [name, quantity, category], (err, result) => {
    if (err) {
      console.error("Error inserting resource:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ id: result.insertId, name, quantity, category });
  });
});
app.get("/api/resources", (req, res) => {
  db.query("SELECT * FROM resources", (err, results) => {
    if (err) {
      console.error("Error fetching resources:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

app.post("/api/operations", (req, res) => {
  const { name, status, lead, location, assignedTeam } = req.body;

  const insertQuery = `
    INSERT INTO operation
     (name, status, lead, location, assignedTeam)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [name, status, lead, location, assignedTeam],
    (err, result) => {
      if (err) {
        console.error("Error adding operation:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // ✅ Update rescue team status to "Deployed"
      const updateTeamQuery = `
      UPDATE rescue_teams SET status = 'Deployed' WHERE name = ?
    `;
      db.query(updateTeamQuery, [assignedTeam], (updateErr) => {
        if (updateErr) {
          console.error("Error updating rescue team status:", updateErr);
          return res.status(500).json({ error: "Team status update failed" });
        }

        res.status(201).json({
          id: result.insertId,
          name,
          status,
          lead,
          location,
          assignedTeam,
        });
      });
    }
  );
});

app.put("/api/operations/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Active", "Standby", "Completed", "Aborted"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const query = "UPDATE operation SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating operation status:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ success: true, status });
  });
});
app.get("/api/operations", (req, res) => {
  const query = " SELECT * FROM operation";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching operations:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results);
  });
});
app.post("/api/rescue-teams", (req, res) => {
  const { name, status, location, contact_person, contact_number } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO rescue_teams (name, status, location, contact_person, contact_number)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, status, location, contact_person, contact_number],
    (err, result) => {
      if (err) {
        console.error("Error adding rescue team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        id: result.insertId,
        name,
        status,
        location,
        contact_person,
        contact_number,
      });
    }
  );
});

// GET /api/rescue-teams
app.get("/api/rescue-teams", (req, res) => {
  db.query(
    "SELECT * FROM rescue_teams ORDER BY timestamp DESC",
    (err, results) => {
      if (err) {
        console.error("Error fetching rescue teams:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
    }
  );
});
app.put("/api/rescue-teams/status", (req, res) => {
  const { name, status } = req.body;
  const query = `UPDATE rescue_teams SET status = ? WHERE name = ?`;

  db.query(query, [status, name], (err) => {
    if (err) {
      console.error("Error updating team status:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Team status updated" });
  });
});
app.put("/api/rescue-teams/status-by-operation", (req, res) => {
  const { operationId, status } = req.body;

  const getTeamQuery = "SELECT assignedTeam FROM operation WHERE id = ?";
  db.query(getTeamQuery, [operationId], (err, results) => {
    if (err || results.length === 0) {
      console.error("Error finding assigned team:", err);
      return res.status(500).json({ error: "Team lookup failed" });
    }

    const teamName = results[0].assignedTeam;
    const updateQuery = "UPDATE rescue_teams SET status = ? WHERE name = ?";
    db.query(updateQuery, [status, teamName], (updateErr) => {
      if (updateErr) {
        console.error("Error updating team status:", updateErr);
        return res.status(500).json({ error: "Team status update failed" });
      }

      res.status(200).json({ message: "Rescue team reset to Ready" });
    });
  });
});
//ai assistant
app.post("/query", async (req, res) => {
  const { prompt } = req.body;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  async function callOpenAI(prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          },
          {
            headers: {
              Authorization:' Bearer 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',
            },
          }
        );
        return response.data.choices[0].message.content;
      } catch (err) {
        if (err.response?.status === 429 && i < retries - 1) {
          const wait = 1000 * Math.pow(2, i); // 1s, 2s, 4s...
          console.warn(`Rate limited. Retrying in ${wait}ms...`);
          await delay(wait);
        } else {
          throw err;
        }
      }
    }
  }

  try {
    const reply = await callOpenAI(prompt); // ✅ Call the function
    res.json({ reply }); // ✅ Send response to client
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI query failed" });
  }
});
app.post("/api/shelters", (req, res) => {
  const { name, occupancy, capacity, status } = req.body;
  const query = `
    INSERT INTO shelters (name, occupancy, capacity, status)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [name, occupancy, capacity, status], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res
      .status(201)
      .json({ id: result.insertId, name, occupancy, capacity, status });
  });
});

app.get("/api/shelters", (req, res) => {
  db.query(
    "SELECT * FROM shelters ORDER BY updated_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(200).json(results);
    }
  );
});
app.get("/api/shelters", (req, res) => {
  const query = "SELECT name, occupancy, capacity FROM shelters";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});
app.get("/api/operation-summary", (req, res) => {
  const query = `
    SELECT status, COUNT(*) AS count
    FROM operation
    GROUP BY status
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});
app.get("/api/daily-reports", (req, res) => {
  const query = `
    SELECT DATE(timestamp) AS date, COUNT(*) AS count
    FROM reports
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});
app.delete("/api/rescue-teams/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM rescue_teams WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json({ message: "Team deleted successfully" });
  });
});
app.put("/api/shelters/:id", (req, res) => {
  const { id } = req.params;
  const { name, capacity, occupancy, status } = req.body;
  db.query(
    "UPDATE shelters SET name = ?, capacity = ?, occupancy = ?, status = ? WHERE id = ?",
    [name, capacity, occupancy, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.status(200).json({ message: "Shelter updated" });
    }
  );
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(
      token,
      "9a1c3adcd3bc0ea35b25423c86edccecd066298040fde78eaf8908946fc09a82"
    );
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Example protected route
app.get("/api/admin/dashboard", verifyToken, (req, res) => {
  res.json({ message:` Welcome, ${req.admin.username} `});
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const admin = results[0];
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        "9a1c3adcd3bc0ea35b25423c86edccecd066298040fde78eaf8908946fc09a82",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ message: "Login successful", token });
    }
  );
});
app.delete("/api/shelters/:id", (req, res) => {
  const shelterId = parseInt(req.params.id);
  const query = "DELETE FROM shelters WHERE id = ?";

  db.query(query, [shelterId], (err, result) => {
    if (err) {
      console.error("Error deleting shelter:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Shelter not found" });
    }

    res.json({ message: "Shelter deleted successfully" });
  });
});

server.listen(5000, () => {
  console.log("Socket.IO server running on port 4000");
});