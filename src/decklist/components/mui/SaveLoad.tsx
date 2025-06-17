import Button from "./Button";

import Box from "@mui/material/Box";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

import { useAppDispatch } from "../../../hooks";

import { Card, mtgCard, ygoCard } from "../../../types";

type Props = {
  saveload: Array<any>;
  justifyContent?: string;
  validateCard: (card: ygoCard | mtgCard) => boolean;
};

const SaveLoad = (props: Props) => {
  const { saveload, validateCard, justifyContent = "flex-end" } = props;

  const dispatch = useAppDispatch();

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

      if (!window.showSaveFilePicker) {
        console.error("File picker is not supported in this browser.");
        return;
      }

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
      if (!window.showOpenFilePicker) {
        console.error("File picker is not supported in this browser.");
        return;
      }

      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const text = await file.text();

      const parsed = JSON.parse(text);

      saveload.forEach(({ name, setter }) => {
        const allValid = parsed[name].every((card: Card) =>
          validateCard(card.details)
        );

        if (!allValid) {
          throw new Error(`Invalid card data for deck type`);
        }

        dispatch(setter(parsed[name]));
      });
    } catch (err) {
      const error = err as Error;

      if (error.name !== "AbortError") {
        alert("Failed to load file: " + error.message);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent={justifyContent}
      flexDirection="row"
      alignItems="center"
      gap={2}
      mr={2}
    >
      <Button startIcon={<UploadIcon />} text="Load" onClick={handleLoad} />
      <Button startIcon={<DownloadIcon />} text="Save" onClick={handleSave} />
    </Box>
  );
};

export default SaveLoad;
