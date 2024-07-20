import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Spinner, Row, Col ,Badge} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "./Accounts.css";
const AccountDetailsModal = ({
  showDetails,
  setShowDetails,
  selectedAccount,
  fetchAccountTransactions,
  accountTransactions,
  totalRowsForAccount,
  setTotalRowsAccount,
  handlePageChange,
}) => {
  const [loading, setLoading] = useState(false);
  const transactionColumns = [
    { name: "From", selector: (row) => row.from_account__name, sortable: true },
    { name: "To", selector: (row) => row.to_account__name, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true,   
        cell: (row) => (
          <Badge bg={row.status ? 'success' : 'danger'}>
          {row.status ? 'Success' : 'Failed'}
        </Badge>
      ), },
     { name: "Date",
      selector: (row) => new Date(row.timestamp).toLocaleString(),
      sortable: true,
    },
  ];
  useEffect(() => {
    if (selectedAccount) {
      fetchAccountTransactions(selectedAccount.id, 1);
    }
  }, [selectedAccount]);

  return (
    <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Account Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            {selectedAccount && (
              <div>
                <Row className="info">
                  <Col lg="4" sm="6">
                    <Card>
                      <Card.Body>
                        <strong>Account ID:</strong> {selectedAccount.id}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg="4" sm="6">
                    <Card>
                      <Card.Body>
                        <strong>Name:</strong> {selectedAccount.name}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg="4" sm="6">
                    <Card>
                      <Card.Body>
                        <strong>Balance:</strong> {selectedAccount.balance}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Card>
                  <Card.Body>
                    <Card.Title>Transactions</Card.Title>
                    <DataTable
                      columns={transactionColumns}
                      data={accountTransactions}
                      noDataComponent={<p>No transactions found</p>}
                      pagination
                      paginationServer
                      paginationTotalRows={totalRowsForAccount}
                      onChangePage={handlePageChange}
                    />
                  </Card.Body>
                </Card>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetails(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountDetailsModal;
