import React from 'react';
import { useParams } from 'react-router-dom';
import Form from './Form';
import Time from './Time';
import Employees from './Employees';
import { Box, Typography } from '@mui/material';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  

const StoreTabs = () => {
  const { tab } = useParams();

  return (
    <>
      {tab === '0' && (
        <TabPanel value={0} index={0}>
          <Form />
        </TabPanel>
      )}
      {tab === '1' && (
        <TabPanel value={1} index={1} className="--bg-light">
          <Time />
        </TabPanel>
      )}
      {tab === '2' && (
        <TabPanel spacing={3} value={2} index={2} className="--bg-light">
          <Employees />
        </TabPanel>
      )}
    </>
  );
};

export default StoreTabs;
