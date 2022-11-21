import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import { alpha, Avatar, Button, IconButton, styled, Typography } from "@mui/material";
import { ClientListing, EmploymentStatusFriendly, ExperienceLevelFriendly, SearchListing, WorkPlaceType } from 'common/models';
import theme from 'common/static/theme';
import { formatDistance } from "date-fns";
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = SearchListing ;

export const Chip = styled('div')({
  backgroundColor: alpha(theme.palette.secondary.main, 0.3),
  color: '#5971e4',
  borderRadius: '0.4rem',
  padding: '1rem',
  textTransform: 'lowercase',
  fontWeight: 'bold',
})

const Result: React.FC<ClientListing> = ({
  organisationLogo,
  title,
  organisationName,
  experienceLevel,
  employmentStatus,
  workplaceType,
  createdDate,
  createdByName,
  salary,
  _id,
}) => {
  const nav = useNavigate();
  return (
    <Button
      onClick={() => nav(`/listing/${_id}`)}
      style={{
        border: '1px solid lightGrey',
        backgroundColor: theme.palette.secondary.light,
        borderRadius: "8px",
        boxSizing: 'border-box',
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        marginBottom: "4rem",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 0,
        color: 'black',
        width: '385px',
      }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        padding: '2rem',
        paddingBottom: 0,
      }}>
        <Avatar
          sx={{
            width: '100px',
            height: '100px',
            '& > img': {
              backgroundColor: theme.palette.grey[200],
              borderRadius: '0.8rem',
            }
          }}
          color='primary'
          variant='rounded'
          src={organisationLogo} />
        <div style={{
          padding: "0 2rem",
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
                variant="h6"
                fontWeight="bolder"
                textAlign='left'
                style={{
                  height: 'fit-content',
                  fontSize: '1.4rem',
                }}>
                {title}
              </Typography>
              <Typography
                textAlign='left'
                variant="subtitle1"
                fontWeight="bold"
                style={{
                  color: theme.palette.grey[500],
                  position: 'relative',
                  height: 'fit-content'
                }}>
                {`${organisationName} - ${createdByName}`}
              </Typography>
              <Typography
                textAlign='left'
                variant="subtitle1"
                fontWeight="bold"
                style={{
                  position: 'relative',
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
        display: 'flex',
        flexDirection: 'row',
        columnGap: '1rem',
        rowGap: '2rem',
        padding: '2rem',
      }}>
        <Chip>
          {
            //@ts-ignore
            EmploymentStatusFriendly[employmentStatus]
          }
        </Chip>
        <Chip>
          {
            //@ts-ignore
            ExperienceLevelFriendly[experienceLevel]
          }
        </Chip>
        <Chip>
          {
            //@ts-ignore
            WorkPlaceType[workplaceType]
          }
        </Chip>
      </div>
      <div style={{
        display: "flex",
        padding: "1rem 2rem",
        width: "100%",
        marginTop: "2rem",
        backgroundColor: theme.palette.grey[200],
        borderBottomRightRadius: "0.8rem",
        borderBottomLeftRadius: "0.8rem",
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p>{formatDistance(new Date(), new Date(+(createdDate || 0)))} ago</p>
        <IconButton>
          <BookmarkAddOutlinedIcon />
        </IconButton>
      </div>
    </Button >
  )
}

const Results: React.FC<Props> = ({ listings, hits }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: '0 2rem',
    }}>
      <p style={{
        color: theme.palette.grey[800],
        fontSize: '1.2rem',
        margin: 0,
        fontWeight: 'bold',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        {`${hits} Results found`}
      </p>
      <div style={{ flexWrap: 'wrap', display: 'flex', flexDirection: 'row', rowGap: '2rem', columnGap: '2rem' }}>
        {listings.map(l => <Result key={l._id} {...l} />)}
      </div>
    </div>
  )
}

export default Results