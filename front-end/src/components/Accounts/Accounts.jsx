import React, { useState, useEffect, useRef } from "react";
import { Spinner, Container, Row, Col, Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileUpload, FaTrash, FaEye } from "react-icons/fa";
import AccountDetailsModal from "./AccountModal";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPageForAccount, setCurrentPageForAccount] = useState(1);
  const [totalRowsForAccount, setTotalRowsForAccount] = useState(0);
  const [reload, setReload] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountTransactions, setAccountTransactions] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAccounts(1);
  }, [reload]);

  const fetchAccounts = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/get-accounts/?page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts);
        setTotalRows(data.num_pages * 10);
        setCurrentPage(data.current_page);
      } else {
        toast.error("Failed to fetch accounts");
      }
    } catch (error) {
      toast.error("Error fetching accounts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csvFile", file);

      const response = await fetch("http://localhost:8000/import-accounts/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        toast.success("Import CSV done successfully");
        setReload(true);
        setFileName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        const errorData = await response.json();
        toast.error("Failed to import CSV: " + errorData.error);
        setFileName("");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error importing CSV: " + error.message);
      setFileName("");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      handleImport(file);
    }
  };

  const handleShowDetails = async (account) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/account-details/${account.id}/?page=1&per_page=5`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedAccount(data.account);
        setAccountTransactions(data.transactions);
        setTotalRowsForAccount(data.num_pages * 10); // Assuming 10 rows per page
        setCurrentPageForAccount(data.currentPage)
        setShowDetails(true);
      } else {
        toast.error("Failed to fetch account details");
      }
    } catch (error) {
      toast.error("Error fetching account details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle page changes in the modal DataTable
  const handleAccountPageChange = (page) => {
    fetchAccountTransactions(selectedAccount.id, page);
  };

  // Update fetchAccountTransactions to fetch transactions with pagination
  const fetchAccountTransactions = async (accountId, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/account-details/${accountId}/?page=${page}&per_page=5`
      );
      if (response.ok) {
        const data = await response.json();
        setAccountTransactions(data.transactions);
        setTotalRowsForAccount(data.num_pages * 10);
        setCurrentPageForAccount(data.currentPage)
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (error) {
      toast.error("Error fetching transactions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/delete-account/${accountId}/`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setReload(!reload);
        toast.success("Account deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting account: " + error.message);
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Balance", selector: (row) => row.balance, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaEye
            className="action-icon"
            style={{ marginRight: "10px", cursor: "pointer", color: "#007bff" }}
            onClick={() => handleShowDetails(row)}
          />
          <FaTrash
            className="action-icon"
            style={{ marginRight: "10px", cursor: "pointer", color: "#dc3545" }}
            onClick={() => handleDeleteAccount(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];



  const handlePageChange = (page) => {
    fetchAccounts(page);
  };


  return (
    <Container>
      <Row style={{ marginBottom: "20px" }}>
        <Col style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="csvFile"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <FaFileUpload size={30} style={{ marginRight: "10px" }} />
            {loading ? (
              <Spinner
                animation="border"
                size="sm"
                style={{ marginLeft: "10px" }}
              />
            ) : (
              <>
                <span>Import clients CSV</span>
              </>
            )}
            {fileName && (
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                {fileName}
              </span>
            )}
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
          </label>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={accounts}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={10}
        onChangePage={handlePageChange}
        style={{ marginTop: "20px" }}
      />
      <ToastContainer />

      {/* Modal for showing account details and transactions */}
      <AccountDetailsModal
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedAccount={selectedAccount}
        fetchAccountTransactions={fetchAccountTransactions}
        accountTransactions={accountTransactions}
        totalRowsForAccount={totalRowsForAccount}
        setTotalRowsForAccount={setTotalRowsForAccount}
        handlePageChange={handleAccountPageChange}
      ></AccountDetailsModal>
    </Container>
  );
};

export default Accounts;
