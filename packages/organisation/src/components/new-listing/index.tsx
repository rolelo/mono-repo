import { useReactiveVar } from "@apollo/client";
import { Avatar, Box, MenuItem, Select, Typography } from "@mui/material";
import React from 'react';
import { userVar } from "../dashboard/layout";
import { useForm } from 'react-hook-form';

const NewListing: React.FC = () => {
  const user = useReactiveVar(userVar);
  const {  } = useForm();
  console.log(user);
  return (
    <Box sx={{ padding: '2rem', boxSizing: 'border-box' }}>
      <Typography variant='h3'>New Job Listing</Typography>
      <Box style={{
        backgroundColor: "white",
        borderRadius: "5px",
        width: "100%",
        marginTop: '2rem',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <Box style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
          <Box>
            <Typography variant="h4" style={{ display: "flex", alignItems: 'center', columnGap: '1rem', marginBottom: '2rem' }}>
              <Avatar sx={{ bgcolor: 'black' }}>1.</Avatar>
              Select Organisation
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={watch}
              label="Age"
              onChange={() => console.log("hello world")}
              placeholder="Please select your organisation"
            >
              {user?.organisations.map(({ _id, name }) => (<MenuItem value={_id}>{ name }</MenuItem>))}
            </Select>
          </Box>
          <Box>
            <Typography variant="h4" style={{ display: "flex", alignItems: 'center', columnGap: '1rem' }}>
              <Avatar sx={{ bgcolor: 'black' }}>2.</Avatar>
              Choose advertising medium
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default NewListing