import Button from "./Button";

import Box from "@mui/material/Box";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

const SaveLoad = (props) => {
  const { saveload, justifyContent = "flex-end" } = props;

  const handleSave = async () => {
    try {
      // open file writer
      const opts = {
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
        suggestedName: "data.json",
      };

      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();

      // format data to save
      const data = saveload.reduce((acc, item) => {
        acc[item.name] = item.getter;
        return acc;
      }, {});

      const contents = JSON.stringify(data, null, 2);

      // save
      await writable.write(contents);
      await writable.close();
    } catch (err) {
      console.error("Save cancelled or failed:", err);
    }
  };

  const handleLoad = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const text = await file.text();

      const parsed = JSON.parse(text);
      saveload.forEach(({ name, setter }) => {
        setter(parsed[name]);
      });
    } catch (err) {
      console.error("Error loading file:", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent={justifyContent}
      flexDirection="row"
      alignItems="center"
      gap={2}
    >
      <Button startIcon={<UploadIcon />} text="Load" onClick={handleLoad} />
      <Button startIcon={<DownloadIcon />} text="Save" onClick={handleSave} />
    </Box>
  );
};

export default SaveLoad;
