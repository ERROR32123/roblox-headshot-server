const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' })); // allow large payloads

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Endpoint to accept base64 image
app.post('/upload', (req, res) => {
    const { filename, data } = req.body;
    if (!filename || !data) return res.status(400).send("Missing data or filename.");

    const buffer = Buffer.from(data, 'base64');
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const hostname = process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost:10000';
    const url = `https://${hostname}/uploads/${filename}`;
    res.send(url);
});

// Serve images publicly
app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Headshot server running on port ${PORT}`));
