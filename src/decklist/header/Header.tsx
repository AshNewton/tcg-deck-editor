import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { setGame } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Game } from "../../types";
import { Grid } from "@mui/material";
import { GAME_ICONS, SUPPORTED_GAMES } from "../util/constants";

const Header = () => {
  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setGame(event.target.value as Game));
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={2}>
        <FormControl>
          <Select
            value={game}
            onChange={handleChange}
            variant="standard"
            disableUnderline
          >
            {SUPPORTED_GAMES.map((option) => (
              <MenuItem key={option} value={option}>
                <img src={GAME_ICONS[option]} alt={option} height={48} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Box display="flex" flexDirection="row"></Box>
      </Grid>
    </Grid>
  );
};

export default Header;
