import Drawer from 'common/components/drawer';
import DataView from 'common/components/dataview';
import { IListing } from 'common/models';
import React from 'react';

type Props = {
  listing?: IListing
  handleClose: () => void;
}
const ListingDrawer: React.FC<Props> = ({ listing, handleClose }) => {
  return (
    <Drawer
      title={listing?.title || ''}
      subtitle="Job Listing"
      open={Boolean(listing)}
      onClose={handleClose}
    >
      {
        listing && <DataView data={listing} />
      }
    </Drawer>
  )
}

export default ListingDrawer