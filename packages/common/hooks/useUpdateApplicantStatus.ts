import { gql, useMutation } from "@apollo/client";
import { ListingApplicant, UpdateApplicationStatusInput } from '../models';

const UPDATE_APPLICANT_STATUS = gql`
  mutation UpdateApplicantStatus($input: UpdateApplicationStatusInput!) {
    updateApplicantStatus(input: $input) {
      status
    }
  }
`;

export const useUpdateApplicantStatus = () => {
    const [mutation] = useMutation<
    { updateApplicantStatus: ListingApplicant },
    { input: UpdateApplicationStatusInput }>(UPDATE_APPLICANT_STATUS)

  return {
    mutation
  }
};

