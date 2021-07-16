import React, { useState } from 'react';
import {
  makeStyles,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemText
} from '@material-ui/core';
import Employees from './Employees';
import Treatments from './Treatments';
import AvailableRooms from './AvailableRooms';
import Patients from './Patients';
import Addresses from './Addresses';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const componentTypes = ['Employees', 'Treatments', 'Available Rooms', 'Patients', 'Addresses'];

export default function Menu() {
  const [componentType, setComponentType] = useState(componentTypes[3]);

  const classes = useStyles();

  const changeComponent = (type) => {
    setComponentType(type);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Hospital Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {componentTypes.map((text, index) => (
            <ListItem button key={text} onClick={() => changeComponent(text)}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {componentType === 'Employees' && (<Employees />)}
        {componentType === 'Treatments' && (<Treatments />)}
        {componentType === 'Available Rooms' && (<AvailableRooms />)}
        {componentType === 'Patients' && (<Patients />)}
        {componentType === 'Addresses' && (<Addresses />)}
      </main>
    </div>
  );
}
