const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📂 Vérifier si le dossier `uploads/` existe, sinon le créer
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 🛠 Configuration Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 📂 Dossier où enregistrer les images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 📌 Nom unique
    }
});

// 🚫 Filtrer les fichiers acceptés (JPG, PNG uniquement)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format d’image non supporté'), false);
    }
};

// 🎯 Initialisation de Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: fileFilter
});

module.exports = upload;
