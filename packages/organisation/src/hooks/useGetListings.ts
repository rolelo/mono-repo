import { gql, useQuery } from "@apollo/client";
import { Listing } from "common/models";

const GET_LISTINGS = gql`
  query Listings {
    listings {
      _id
      organisationName
      organisationDescription
      organisationWebsite
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
      applicants {
        id
        createdDate
        user {
          name
          email
          profile {
            cv
          }
        }
      }
    }
  }
`;

const useGetListings = () => {
  const { data, loading, startPolling, stopPolling } = useQuery<{
    listings: Listing[];
  }>(GET_LISTINGS, {
    fetchPolicy: "cache-and-network",
  });

  return {
    data,
    loading,
    startPolling,
    stopPolling,
  };
};

export default useGetListings;