import React, { useState } from "react";

import { Box, Tab, Tabs} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Store = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabClick = (index) => {
    setValue(index);
    navigate(`/loja/${index}`);
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }} className="--bg-light">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Sobre a loja"
            {...a11yProps(0)}
            component={NavLink}
            to="/loja/0"
            onClick={() => handleTabClick(0)}
          />
          <Tab
            label="Hórário de funcionamento"
            {...a11yProps(1)}
            component={NavLink}
            to="/loja/1"
            onClick={() => handleTabClick(1)}
          />
          <Tab
            label="Equipe"
            component={NavLink}
            {...a11yProps(2)}
            to="/loja/2"
            onClick={() => handleTabClick(2)}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Store;
