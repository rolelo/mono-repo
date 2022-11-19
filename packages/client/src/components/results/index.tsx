import { Avatar, Typography, IconButton, Button } from "@mui/material";
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import { ClientListing, EmploymentStatusFriendly, ExperienceLevelFriendly, SearchListing } from 'common/models';
import theme from 'common/static/theme';
import { formatDistance } from "date-fns";
import React from 'react';

type Props = SearchListing;

const Result: React.FC<ClientListing> = ({
  organisationLogo,
  title,
  organisationName,
  experienceLevel,
  employmentStatus,
  createdDate,
  salary,
}) => (
  <div style={{
    backgroundColor: theme.palette.secondary.light,
    borderRadius: "8px",
    boxSizing: 'border-box',
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    marginBottom: "4rem",
  }}>
    <div style={{
      display: "flex",
      flexDirection: "row",
      padding: '1rem',
    }}>
      <Avatar
        sx={{
          width: '100px',
          height: '100px',
          marginRight: '2rem',
        }}
        color='primary'
        variant='rounded'
        src={organisationLogo} />
      <div style={{
        padding: "1rem",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        columnGap: "1rem",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
          <div style={{
            position: 'relative',
          }}>
            <Typography
              variant="h5"
              fontWeight="bolder"
              style={{
                height: 'fit-content'
              }}>
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              style={{
                color: theme.palette.grey[500],
                position: 'relative',
                height: 'fit-content'
              }}>
              {organisationName}
            </Typography>
          </div>
          <Button variant="contained" sx={{ height: "fit-content"}}>View Job</Button>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "4rem",
          paddingTop: "2rem",
        }}>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              style={{
                color: theme.palette.grey[500],
                position: 'relative',
                height: 'fit-content'
              }}>
              Experience
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bolder"
              style={{
                height: 'fit-content'
              }}>
              {
                //@ts-ignore
                ExperienceLevelFriendly[experienceLevel]
              }
            </Typography>
          </div>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              style={{
                color: theme.palette.grey[500],
                position: 'relative',
                height: 'fit-content'
              }}>
              Job Type
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bolder"
              style={{
                height: 'fit-content'
              }}>
              {
                //@ts-ignore
                EmploymentStatusFriendly[employmentStatus]
              }
            </Typography>
          </div>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              style={{
                color: theme.palette.grey[500],
                position: 'relative',
                height: 'fit-content'
              }}>
              Salary
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bolder"
              style={{
                height: 'fit-content'
              }}>
              {salary.toLocaleString('en-gb', {
                style: 'currency',
                currency: 'GBP',
              })}
            </Typography>
          </div>
        </div>
      </div>
    </div>
    <div style={{
      display: "flex",
      padding: "1rem 1rem 1rem 3rem",
      width: "100%",
      marginTop: "2rem",
      backgroundColor: theme.palette.background.paper,
      borderBottomRightRadius: "0.8rem",
      borderBottomLeftRadius: "0.8rem",
      boxSizing: 'border-box',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <p>Posted {formatDistance(new Date(), new Date(+(createdDate || 0)))} ago</p>
      <IconButton>
        <BookmarkAddOutlinedIcon />
      </IconButton>
    </div>
  </div >
)

const Results: React.FC<Props> = ({ listings, hits }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
    }}>
      <p style={{
        color: theme.palette.grey[800],
        fontSize: '1.2rem',
        margin: 0,
        marginBottom: '2rem',
      }}>{hits} Results found</p>
      {listings.map(l => <Result key={l._id} {...l} />)}
    </div>
  )
}

export default Results