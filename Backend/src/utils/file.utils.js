import fs from "fs";

export const deleteFile = (filePath) => {
    if (!filePath) {
        return;
    }

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};