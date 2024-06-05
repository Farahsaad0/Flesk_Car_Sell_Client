import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Col,
  Container,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import ReactPaginate from "react-paginate";
import { toast } from "sonner";

const HistoriqueDeTransaction = () => {
  const [open, setOpen] = useState(1);
  const { auth } = useAuth();
  const userId = auth._id;
  const [pageNumber, setPageNumber] = useState(0);
  const [transactionPerPage, setTransactionPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sentPageNumber, setSentPageNumber] = useState(0);
  const [sentTransactionPerPage, setSentTransactionPerPage] = useState(10);
  const [sentTotalPages, setSentTotalPages] = useState(0);
  const [sentSortOrder, setSentSortOrder] = useState(-1);
  const [sentTransactions, setSentTransactions] = useState([]);
  const [receivedTransactions, setReceivedTransactions] = useState([]);

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  useEffect(() => {
    const fetchSentTransactions = async () => {
      try {
        const response = await axios.get(`/transactions/${userId}`, {
          params: {
            page: sentPageNumber + 1,
            limit: sentTransactionPerPage,
            sentSortOrder,
          },
        });
        setSentTransactions(response?.data?.transactions);
        setSentTotalPages(response?.data?.totalPages);
      } catch (error) {
        console.error("Error fetching sent transactions", error);
        toast.error("Une erreur s'est produite lors de la récupération de l'historique de vos transactions")
      }
    };

    const fetchReceivedTransactions = async () => {
      try {
        const response = await axios.get(`/transactions/expert/${userId}`, {
          params: {
            page: pageNumber + 1,
            limit: transactionPerPage,
            sortOrder,
          },
        });
        setReceivedTransactions(response?.data?.completedTransactions);
        setTotalPages(response?.data?.totalPages);
      } catch (error) {
        console.error("Error fetching received transactions", error);
      }
    };

    fetchSentTransactions();
    fetchReceivedTransactions();
  }, [userId, sortOrder, pageNumber, transactionPerPage]);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleSentPageClick = ({ selected }) => {
    setSentPageNumber(selected);
  };

  const handlePerPageChange = (e) => {
    setTransactionPerPage(parseInt(e.target.value)); // Parse the selected value to an integer
    setPageNumber(0); // Reset page number when changing the number of users per page
  };
  const handleSentPerPageChange = (e) => {
    setSentTransactionPerPage(parseInt(e.target.value)); // Parse the selected value to an integer
    setSentPageNumber(0); // Reset page number when changing the number of users per page
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "croissant") {
      setSortOrder(1);
    } else {
      setSortOrder(-1);
    }
  };

  const handleSentSortChange = (e) => {
    const value = e.target.value;
    if (value === "croissant") {
      setSentSortOrder(1);
    } else {
      setSentSortOrder(-1);
    }
  };

  return (
    <Container className="mb-5">
      <Accordion open={open} toggle={toggle} className="mt-5">
        <AccordionItem>
          <AccordionHeader targetId="1">
            Historique des transactions envoyées
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <Row className="row-cols-lg-auto  d-flex justify-content-between align-items-center mb-3">
              <Col className=" d-flex align-items-center  gap-2">
                <Col>
                  {/* <div className=" d-flex align-items-center gap-3 mb-5"> */}
                  <Label for="priceOrder">
                    <i className="ri-sort-asc"></i> Trier par
                  </Label>
                </Col>
                <Col>
                  <Input
                    type="select"
                    id="priceOrder"
                    onChange={handleSentSortChange}
                    style={{ width: "fit-content" }}
                  >
                    <option value="décroissant">les plus récent</option>
                    <option value="croissant">les plus ancien</option>
                  </Input>
                </Col>
              </Col>

              <Col className=" d-flex align-items-center gap-1">
                <Col>
                  <Input
                    type="select"
                    id="perPageSelect"
                    value={transactionPerPage}
                    onChange={handleSentPerPageChange}
                    style={{ width: "fit-content" }}
                  >
                    <option value={10}> 10 </option>
                    <option value={20}> 20 </option>
                    <option value={35}> 35 </option>
                    <option value={50}> 50 </option>
                  </Input>
                </Col>
                <Col>
                  <Label for="perPageSelect">par page</Label>
                </Col>
              </Col>
            </Row>
            <Table bordered striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Montant</th>
                  <th>Statut de paiement</th>
                  <th>Date de paiement</th>
                  <th>Bénéficiaire</th>
                </tr>
              </thead>
              <tbody>
                {sentTransactions.length > 0 ? (
                  sentTransactions?.map((transaction, i) => (
                    <tr key={transaction?._id}>
                      <th scope="row">{i + 1}</th>
                      <td>{transaction?.type}</td>
                      <td>{transaction?.amount}</td>
                      <td>{transaction?.paymentStatus}</td>
                      <td>{transaction?.paymentDate}</td>
                      <td>
                        {transaction?.recipient?.Role === "Administrateur"
                          ? "Flesk Car Sell"
                          : `${transaction?.recipient?.Nom} ${transaction?.recipient?.Prenom}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <center>
                        Votre historique de transactions est vide pour le
                        moment. Rien à voir ici.
                      </center>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Row>
              <nav aria-label="Page navigation ">
                <ul className="pagination justify-content-center">
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel={<div className="page-link">Previous</div>}
                    nextLabel={<div className="page-link">Next</div>}
                    pageCount={sentTotalPages}
                    onPageChange={handleSentPageClick}
                    containerClassName={"pagination "}
                    pageRangeDisplayed={2}
                    activeClassName={" active"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    renderOnZeroPageCount={null}
                  />
                </ul>
              </nav>
            </Row>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
      {auth.Role === "Expert" && (
        <Accordion open={open} toggle={toggle} className="mt-5">
          <AccordionItem>
            <AccordionHeader targetId="2">
              Historique des transactions reçues
            </AccordionHeader>
            <AccordionBody accordionId="2">
              <Row className="row-cols-lg-auto  d-flex justify-content-between align-items-center mb-3">
                <Col className=" d-flex align-items-center  gap-2">
                  <Col>
                    {/* <div className=" d-flex align-items-center gap-3 mb-5"> */}
                    <Label for="priceOrder">
                      <i className="ri-sort-asc"></i> Trier par
                    </Label>
                  </Col>
                  <Col>
                    <Input
                      type="select"
                      id="priceOrder"
                      onChange={handleSortChange}
                      style={{ width: "fit-content" }}
                    >
                      <option value="décroissant">les plus récent</option>
                      <option value="croissant">les plus ancien</option>
                    </Input>
                  </Col>
                </Col>

                <Col className=" d-flex align-items-center gap-1">
                  <Col>
                    <Input
                      type="select"
                      id="perPageSelect"
                      value={transactionPerPage}
                      onChange={handlePerPageChange}
                      style={{ width: "fit-content" }}
                    >
                      <option value={10}> 10 </option>
                      <option value={20}> 20 </option>
                      <option value={35}> 35 </option>
                      <option value={50}> 50 </option>
                    </Input>
                  </Col>
                  <Col>
                    <Label for="perPageSelect">par page</Label>
                  </Col>
                </Col>
              </Row>
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Montant</th>
                    <th>Statut de paiement</th>
                    <th>Date de paiement</th>
                    <th>Expéditeur</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedTransactions.length > 0 ? (
                    receivedTransactions?.map((transaction, i) => (
                      <tr key={transaction?._id}>
                        <th scope="row">{i + 1}</th>
                        <td>{transaction?.type}</td>
                        <td>{transaction?.amount}</td>
                        <td>{transaction?.paymentStatus}</td>
                        <td>{transaction?.paymentDate}</td>
                        <td>
                          {transaction?.sender?.Nom}{" "}
                          {transaction?.sender?.Prenom}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <center>
                          Votre historique de transactions est vide pour le
                          moment. Rien à voir ici.
                        </center>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Row>
                <nav aria-label="Page navigation ">
                  <ul className="pagination justify-content-center">
                    <ReactPaginate
                      breakLabel="..."
                      previousLabel={<div className="page-link">Previous</div>}
                      nextLabel={<div className="page-link">Next</div>}
                      pageCount={totalPages}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination "}
                      pageRangeDisplayed={2}
                      activeClassName={" active"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      renderOnZeroPageCount={null}
                    />
                  </ul>
                </nav>
              </Row>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      )}
    </Container>
  );
};

export default HistoriqueDeTransaction;
