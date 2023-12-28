import React from 'react'
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material'

const Overview = (props) => {
    return (
        <Card  sx={{ height: '100%' }}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="rgba(0,0,0,0.55)"
            >
              {props.title}
            </Typography>
            <Typography variant="h4">
              {props.value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: props.color,
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              {props.icon}
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
    )
}

export default Overview
