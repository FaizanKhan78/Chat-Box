import { Dialog } from "@mui/material";

const DetailsModal = ({ modal, handleModal }) => {
  return (
    <>
      <Dialog open={modal} onClose={handleModal}>
        Hello
      </Dialog>
    </>
  );
};

export default DetailsModal;
