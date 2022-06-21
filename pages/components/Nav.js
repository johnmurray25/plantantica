import React, { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@mui/material/IconButton";
import styles from "../../styles/nav.module.css";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <IconButton>
            <MenuIcon className={styles.icon} fontSize="large" />
          </IconButton>
        </li>
        <li>
          {isLoggedIn ? (
            <IconButton className={styles.icon}>
              <PersonIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton className={styles.icon}>
              <PersonAddIcon fontSize="large" />
            </IconButton>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Nav;
