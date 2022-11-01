import React from 'react'
import { Typography } from '@mui/material';

type Props<T extends Object> = {
  data: T;
}
function DataView<T extends Object>({ data }: Props<T>): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(data).map(([key, value], index) => (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '1rem',
          backgroundColor: index % 2 === 0 ? 'white' : '#F6F6F6',
          columnGap: '1rem'
        }}>
          <Typography variant='body1'>{key}</Typography>
          <Typography variant='body1' fontWeight="bold" textAlign='right'>
            {
              Array.isArray(value) ?
                value.join(', ') :
                typeof value === 'object' ? JSON.stringify(value)
                  : value}
          </Typography>
        </div>
      ))}
    </div>
  )
}

export default DataView