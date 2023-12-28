import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'

const ThemeProviderDefault = () => {

    const theme = createTheme({
        palette: {
          primary: {
            main: 'rgb(97, 120, 222)',
          },
          secondary: {
            main: '#6c757d',
          },
          basic: {
            main: 'rgba(0,0,0,0.55)',
          }
        },
        components: {
            // MuiButton: {
            //   styleOverrides: {
            //     root: {
            //         padding: '7px 14px',
            //       },
            //   },
            // },
              MuiDialogContentText: {
                styleOverrides: {
                  root: {
                    fontSize: '16px',
                    padding: '20px',
                    },
                },
              },
              MuiDialogTitle: {
                styleOverrides: {
                  root: {
                    fontSize: '18px',
                    },
                },
              },
              MuiInputLabel: {
                styleOverrides: {
                  root: {
                    fontSize: '16px',
                    },
                },
              },
              MuiInputBase: {
                styleOverrides: {
                  root: {
                    fontSize: '16px',
                    },
                },
              },
              MuiDialog: {
                styleOverrides: {
                  root: {
                    boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
                    },
                },
              },
              MuiDialogActions: {
                styleOverrides: {
                  root: {
                    justifyContent: 'space-between',
                    },
                },
              },
          }
      });

    return (
        <ThemeProvider theme={theme}>
            <Outlet />
        </ThemeProvider>
    )
}

export default ThemeProviderDefault
