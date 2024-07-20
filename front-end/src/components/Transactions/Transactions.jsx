import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transactions.css"; // Import the CSS file
import TransferModal from "./Modal";
import { Spinner, Container, Row, Col , Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage , reload]);

  const fetchTransactions = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-transactions/?page=${page}`);
      if (response.status === 200) {
        const data = response.data;
        setTransactions(data.transactions);
        setTotalRows(data.num_pages * 10); // Assuming 10 rows per page
        setCurrentPage(data.current_page);
      } else {
        toast.error('Failed to fetch transactions');
      }
    } catch (error) {
      toast.error('Error fetching transactions: ' + error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTransactions(page);
  };


  const columns = [
    { name: "From account", selector: (row) => row.from_account__name, sortable: true },
    { name: "To account", selector: (row) => row.to_account__name, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true,   
      cell: (row) => (
        <Badge bg={row.status ? 'success' : 'danger'}>
        {row.status ? 'Success' : 'Failed'}
      </Badge>
    ), },
    { name: "Date",selector: (row) => new Date(row.timestamp).toLocaleString(), sortable: true },
  ];

  return (
    <Container>
      <TransferModal
        setReload={setReload}
        reload = {reload}
      />
      <DataTable
        columns={columns}
        data={transactions}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={10}
        onChangePage={handlePageChange}
      />
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default Transactions;
