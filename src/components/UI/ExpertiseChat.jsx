import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";
import "../../styles/chat.css";
import axios from "../../api/axios";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { io } from "socket.io-client";
import { toast } from "sonner";

const ExpertiseChat = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const { auth } = useAuth();
  const chatContainerRef = useRef(null);
  const socket = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/job/${jobId}`);
      console.log(res?.data?.data);
      console.log(res?.data?.data);
      console.log(res?.data?.data);
      console.log(res?.data?.data);
      setJob(res?.data?.data);
      setDocuments(res?.data?.data?.documents || []);
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  // const fetchDocuments = async () => {
  //   try {
  //     const res = await axios.get(`/job/files`);
  //     setDocuments(res?.data?.data || []);
  //   } catch (error) {
  //     console.error("Error fetching documents:", error);

  //   }
  // };

  useEffect(() => {
    socket.current = io("http://localhost:8001");

    socket.current.on("receiveMessage", (message) => {
      if (message.jobId === jobId) {
        setJob((prevJob) => ({
          ...prevJob,
          chat: [...prevJob.chat, message],
        }));
        scrollToBottom();
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleMessageChange = (e) => {
    setNewMessageText(e.target.value);
  };

  const handleSendMessage = () => {
    const message = {
      jobId,
      sender: auth._id,
      message: newMessageText,
      timestamp: new Date().toISOString(),
    };
    socket.current.emit("sendMessage", message);
    setNewMessageText("");
    scrollToBottom();
  };

  // const handleSendMessage = async () => {
  //   try {
  //     await axios.post(`/job/${jobId}/chat`, {
  //       sender: auth._id,
  //       message: newMessageText,
  //     });
  //     setNewMessageText(""); // Clear the message input
  //     fetchJob(); // Refresh the chat
  //     scrollToBottom(); // Scroll to the bottom after sending a message
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("documents", selectedFile);

    try {
      await axios.post(`/job/${jobId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchJob();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`/job/${jobId}/files/${fileName}`);
      toast.success("Le document a été supprimé avec succès");
      fetchJob();
    } catch (error) {
      toast.error("La suppression du document a échoué");
      console.error("Error deleting file:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [job?.chat]); // Scroll to the bottom whenever the chat messages change

  const ListGroupItemWithRef = forwardRef((props, ref) => (
    <ListGroupItem {...props} ref={ref} />
  ));

  const formattedDate = job?.submitDate
    ? new Date(job.submitDate).toLocaleDateString()
    : null;

  const firstPhoto = job?.car?.photo || job?.car?.photos?.[0];
  const imageUrl = `http://localhost:8000/images/${firstPhoto}`;

  return (
    <Container className={"my-4"}>
      <Row>
        <Col xl="8">
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <div>{job?.client?.Nom}:</div>
            </CardHeader>

            <ListGroup flush>
              <ListGroupItem style={{ minHeight: "5rem" }}>
                {job?.jobDescription}
              </ListGroupItem>

              <ListGroupItemWithRef
                style={{ height: "30rem", overflowY: "auto" }}
                ref={chatContainerRef}
              >
                {job?.chat?.map((message, index) => (
                  <div key={index} className="message-container">
                    <div
                      className={
                        message?.sender === auth._id
                          ? "my-message"
                          : "other-message"
                      }
                      title={
                        message?.timestamp
                          ? formatDistanceToNow(new Date(message?.timestamp), {
                              locale: fr,
                            })
                          : "Invalid date"
                      }
                    >
                      {message.message}
                    </div>
                  </div>
                ))}
              </ListGroupItemWithRef>
              <Form>
                <FormGroup
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                  className="m-2"
                >
                  <Input
                    id="message-input"
                    name="message-input"
                    type="textarea"
                    value={newMessageText}
                    onChange={handleMessageChange}
                    placeholder="Type your message..."
                    disabled={job?.paymentStatus !== "completed"}
                  />
                  <Button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={job?.paymentStatus !== "completed"}
                  >
                    <i className="bi bi-send"></i>Envoyer
                  </Button>
                </FormGroup>
              </Form>
            </ListGroup>
          </Card>
        </Col>
        <Col xl="4">
          <Card className="mb-4">
            <Link to={`/cars/${job?.car?._id}`}>
              <img alt="Sample" src={imageUrl} style={{ width: "100%" }} />
            </Link>
            <CardBody>
              <CardTitle tag="h5">
                <Link to={`/cars/${job?.car?._id}`}> {job?.car?.titre}</Link>
              </CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {job?.car?.prix}
              </CardSubtitle>
              <CardText>{job?.car?.description}</CardText>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <CardTitle>Fichiers:</CardTitle>
              <CardBody>
                <ListGroup>
                  {documents.map((doc, index) => (
                    <ListGroupItem
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <a
                        href={`http://localhost:8000/documents/${doc}`}
                        download={doc}
                        title="Télécharger"
                        target="_blank"
                      >
                        {doc}
                      </a>
                      {auth._id === job?.expert && (
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(doc)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </ListGroupItem>
                  ))}
                </ListGroup>
                <CardText>
                  <FormGroup>
                    <Label for="exampleFile">Ajouter:</Label>
                    <Input
                      id="exampleFile"
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                    disabled={job?.paymentStatus !== "completed"}
                    />
                    <FormText>
                      Tous les fichiers nécessaires pour avoir un(e) client(e)
                      satisfait(e).
                    </FormText>
                    <br />
                    <Button color="success" onClick={handleUpload} 
                    disabled={job?.paymentStatus !== "completed"}>
                      télécharger
                    </Button>
                  </FormGroup>
                </CardText>
              </CardBody>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpertiseChat;
