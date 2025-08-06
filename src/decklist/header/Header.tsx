import { useTranslation } from "react-i18next";

import Button from "../components/mui/Button";
import Image from "../components/mui/Image";

import AppBar from "@mui/material/AppBar";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";

import { isMTG } from "../util/util";
import { setGame, setMenu } from "../../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { GAME_ICONS, SUPPORTED_GAMES } from "../util/constants";

import { Game, Menu } from "../../types";

type NameType = { name: string; type: Menu };

const Header = () => {
  const game = useAppSelector((state) => state.ui.game);

  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setGame(event.target.value as Game));
  };

  const mtg = isMTG(game);

  const { t } = useTranslation();

  const MENU_ITEMS: Array<NameType> = [
    { name: t("menu.deckOrganizer"), type: "Deck Organizer" },
    { name: t("menu.startingHand"), type: "Starting Hand" },
    { name: t("menu.deckSearch"), type: "Deck Search" },
    { name: t("menu.colorBreakdown"), type: "Color Breakdown" },
  ];

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ gap: 2 }}>
        <FormControl>
          <Select
            id="header-game-select"
            value={game}
            onChange={handleChange}
            variant="standard"
            disableUnderline
          >
            {SUPPORTED_GAMES.map((option) => (
              <MenuItem
                key={option}
                value={option}
                id={`header-game-select-${option}`}
              >
                <Image
                  src={GAME_ICONS[option]}
                  alt={option}
                  m={0}
                  margin="auto"
                  sx={{ height: 48 }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {MENU_ITEMS.map(
          (item: NameType) =>
            (mtg || item.type !== "Color Breakdown") && (
              <Button
                key={item.name}
                color="primary"
                variant="text"
                onClick={() => dispatch(setMenu(item.type))}
                text={item.name}
              />
            )
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
