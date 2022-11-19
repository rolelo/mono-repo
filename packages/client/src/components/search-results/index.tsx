import { gql, useLazyQuery } from "@apollo/client";
import { Button, TextField, Typography } from '@mui/material';
import RBackdrop from "common/components/backdrop";
import { ClientListingsInput, SearchListing } from "common/models";
import theme from "common/static/theme";
import { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from "react-router-dom";
import FilterPanel from "../filter-panel";
import RecentListing from "../recent-listings";
import Results from "../results";


const GET_LISTINGS = gql`
  query ClientListings($input: ClientListingsInput!) {
    clientListings(input: $input) {
      hits,
      listings {
        _id
        organisationName
        organisationDescription
        organisationWebsite
        organisationLogo
        createdDate
        createdById
        createdByName
        jobPostingOperationType
        title
        advertisingMediums
        description
        location
        skillsDescription
        workRemoteAllowed
        workplaceType
        employmentStatus
        experienceLevel
        expireAt
        listingType
        currency
        salary
      }
    }
  }
`;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { handleSubmit, register, watch, setValue, getValues, formState: { isValid, isDirty } } = useForm<ClientListingsInput>({
    mode: 'all',
    defaultValues: {
      description: searchParams.get('searchfield') || '',
      employmentStatus: [],
      workplaceTypes: [],
    }
  });

  const [query, { data, loading }] = useLazyQuery<
    { clientListings: SearchListing },
    { input: ClientListingsInput }>(GET_LISTINGS, {
    nextFetchPolicy: 'network-only',
  });

  const es = watch().employmentStatus;
  const wt = watch().workplaceTypes;
  const salary = watch().salary;
  const description = watch().description;

  useEffect(() => {
    query({
      variables: {
        input: {
          description,
          employmentStatus: es,
          workplaceTypes: wt,
          salary: salary ? Number((salary as unknown as string).replace(/[^0-9.-]+/g, "")) : undefined,
        },
      },
      fetchPolicy: 'network-only',
    })
  }, [query, searchParams, es, wt, salary, description]);

  const onSubmit: SubmitHandler<FieldValues> = ({ description, workplaceTypes, employmentStatus }) => {
    if (!isValid || !isDirty) return;
    query({
      variables: {
        input: {
          description,
          workplaceTypes,
          employmentStatus
        }
      },
      onCompleted: () => {
        setSearchParams({
          searchfield: description
        });
      }
    })
  }

  return (
    <>
      <div className="wrapper" style={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}>
        <div style={{
          backgroundColor: "#e7eafb",
          position: "absolute",
          width: "100vw",
          height: "11.5rem",
          bottom: "0",
        }} />
        <div style={{
          margin: "8rem",
          width: "70vw",
          maxWidth: "900px",
        }}>
          <Typography
            variant="h1"
            style={{
              color: theme.palette.secondary.light,
              fontWeight: "bold",
              fontSize: "5rem",
              flex: "4",
            }}
          >
            Find your dream job
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: "4rem",
            borderRadius: "8px",
            marginTop: "1rem"
          }}>
            <TextField
              placeholder='Search for your desired job'
              color="primary"
              sx={{
                flex: 3,
                '& input': {
                  backgroundColor: "white",
                  fontSize: "3rem",
                  border: `2px solid ${theme.palette.grey[100]}`,
                  borderRadius: '8px',
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                }
              }}
              variant='outlined'
              {...register('description', {
                required: true,
              })}
            />
            <Button variant='contained' size='large'
              type="submit"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                height: "100%",
                padding: "1.5rem",
                flex: 0.5,
                boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
              }}>
              Search
            </Button>
          </form>
          {loading && <RBackdrop open={loading} />}
        </div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "row",
      }}>
        <div style={{ flex: 1 }}>
          <FilterPanel register={register} watch={watch} setValue={setValue} getValues={getValues} />
        </div>
        <div style={{
          width: "70vw",
          maxWidth: "900px",
        }}>
          {
            data?.clientListings && (
              <Results hits={data.clientListings.hits} listings={data.clientListings.listings} />
            )
          }
        </div>
        <div style={{ flex:1 }}>
          <RecentListing />
        </div>

      </div>
    </>
  );
};

export default SearchResults;
