import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import CustomOption from "./CustomOption"; // Ensure this is the correct path to your CustomOption component

const TransferModal = ({ setReload , reload}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Fetch accounts from API
    axios
      .get("http://localhost:8000/get-accounts/")
      .then((response) => {
        const accountOptions = response.data.accounts.map((account) => ({
          value: account.account_id,
          label: account.name,
          balance: account.balance,
        }));
        setAccounts(accountOptions);
      })
      .catch((error) => {
        console.error("There was an error fetching the accounts!", error);
      });
  }, [loading]);

  const handleClose = () => {
    setShow(false);
    // Reset the form values
    setFromAccount(null);
    setToAccount(null);
    setAmount("");
  };
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const transfer = {
      from_account: fromAccount.value, // Use the value field for the account ID
      to_account: toAccount.value, // Use the value field for the account ID
      amount,
    };
    console.log(transfer);

    try {
      const response = await axios.post("http://localhost:8000/transfer/", {
        transfer,
      });
      console.log("Transfer successful:", response.data);
      toast.success("Transfer done successfully!");
      setReload(!reload);
      handleClose(); // Close the modal on successful transfer
      setLoading(true);
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.error}`);
      setReload(!reload);


      // console.error("There was an error making the transfer!", error);
    }
  };

  const handleFromAccountChange = (selectedOption) => {
    setFromAccount(selectedOption);
    console.log("Selected account:", selectedOption);
  };

  const handleToAccountChange = (selectedOption) => {
    setToAccount(selectedOption);
    console.log("Selected account:", selectedOption);
  };

  // Filter accounts for "To account" dropdown
  const availableToAccounts = fromAccount
    ? accounts.filter((account) => account.value !== fromAccount.value)
    : accounts;

  return (
    <>
      <ToastContainer></ToastContainer>
      <Button
        variant="dark"
        onClick={handleShow}
        style={{ marginBottom: "20px" }}
      >
        Transfer Funds
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="fromAccount">
              <Form.Label>From account</Form.Label>
              <Select
                value={fromAccount}
                onChange={handleFromAccountChange}
                options={accounts}
                placeholder="Select an account"
                isClearable
                autoFocus
                components={{ Option: CustomOption }} // Use the custom option component
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="toAccount">
              <Form.Label>To account</Form.Label>
              <Select
                value={toAccount}
                onChange={handleToAccountChange}
                options={availableToAccounts}
                placeholder="Select an account"
                isClearable
                autoFocus
                components={{ Option: CustomOption }} // Use the custom option component
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransferModal;
