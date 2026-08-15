import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/leaves";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {

    console.log("Original name:", file.originalname);
    console.log("MIME type:", file.mimetype);

    const allowedMimeTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    const allowedExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png"
    ];

    const extension =
        path.extname(file.originalname).toLowerCase();

    const isValidMimeType =
        allowedMimeTypes.includes(file.mimetype);

    const isOctetStreamPdfOrImage =
        file.mimetype === "application/octet-stream" &&
        allowedExtensions.includes(extension);

    if (
        isValidMimeType ||
        isOctetStreamPdfOrImage
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, JPG, and PNG files are allowed."
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export default upload;