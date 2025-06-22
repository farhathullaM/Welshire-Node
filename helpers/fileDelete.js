const deleteFileWithFolderName = async (folderPath, filename) => {
  if (!filename) return;

  try {
    const filePath = path.join(folderPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filename}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);
  }
};

export { deleteFileWithFolderName };
