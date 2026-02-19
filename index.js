const express = require('express'); // web server
const multer = require('multer');   // handles file uploads
const path = require('path');       // file paths
const fs = require('fs');           // filesystem

const app = express();
const upload = multer({ dest: 'uploads/' }); // temp folder for uploads

// Endpoint for Roblox to POST headshots
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded.');

    // Move the file to permanent location
    const newPath = path.join(__dirname, 'uploads', file.originalname);
    fs.renameSync(file.path, newPath);

    // Build a public URL
    // Render provides a hostname automatically in RENDER_EXTERNAL_HOSTNAME
    const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/uploads/${file.originalname}`;
    
    // Send the public URL back to Roblox
    res.send(url);
});

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
