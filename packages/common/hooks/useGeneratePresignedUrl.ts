import { gql, useLazyQuery } from "@apollo/client";


const GET_SIGNED_URL = gql`
  query GetSignedUrl($url: String!) {
    getSignedUrl(url: $url)
  }
`

const useGeneratePresignedUrl = () => {
  const [generatePresignedUrl, state] = useLazyQuery <{ signedUrl: string },{ url: string }>(GET_SIGNED_URL);
  return { generatePresignedUrl };
};

export default useGeneratePresignedUrl;
