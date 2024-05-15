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
  FormGroup,
  Input,
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

const ExpertiseChat = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const { auth } = useAuth();
  const chatContainerRef = useRef(null);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/job/${jobId}`);
      setJob(res?.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleMessageChange = (e) => {
    setNewMessageText(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      await axios.post(`/job/${jobId}/chat`, {
        sender: auth._id,
        message: newMessageText,
      });
      setNewMessageText(""); // Clear the message input
      fetchJob(); // Refresh the chat
      const lastMessage = chatContainerRef.current?.lastElementChild;
      lastMessage?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const ListGroupItemWithRef = forwardRef((props, ref) => (
    <ListGroupItem {...props} ref={ref} />
  ));

  // useEffect(() => {
  //   // Scroll to the bottom of the chat container whenever the ref is updated
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //     console.log("Scroll to bottom on ref update");
  //   }
  // }, [chatContainerRef.current]);

  const formattedDate = job?.submitDate
    ? new Date("2024-04-17T14:42:05.382Z").toLocaleDateString()
    : null;


console.log(job?.car)

  const firstPhoto = job?.car.photo || job?.car.photos[0];
  // Construire l'URL de l'image en utilisant la nouvelle structure
  const imageUrl = `http://localhost:8000/images/${firstPhoto}`;
  return (
    <Container className={"my-4"}>
      <Row>
        <Col xl="8">
          <Card>
            <CardHeader className="d-flex justify-content-between ">
              <div>{job?.client.Nom}:</div>
              {/* {formatDistanceToNow(formattedDate, { locale: fr })} */}
            </CardHeader>
            
            <ListGroup flush>
              <ListGroupItem style={{ minHeight: "5rem" }}>
                {job?.jobDescription}
              </ListGroupItem>

              <ListGroupItemWithRef
                style={{ height: "30rem", overflowY: "auto" }}
                ref={chatContainerRef}
              >
                {job?.chat.map((message, index) => (
                  <div key={index} className="message-container">
                    <div
                      className={
                        message?.sender === auth._id
                          ? "my-message"
                          : "other-message"
                      }
                      title={formatDistanceToNow(message?.timestamp, {
                        locale: fr,
                      })}
                    >
                      {/* <strong>{message.sender}: </strong> */}
                      {message.message}
                    </div>
                  </div>
                ))}
              </ListGroupItemWithRef>

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
                />
                <Button className="send-button" onClick={handleSendMessage}>
                  <i className="bi bi-send"></i>Send
                </Button>
              </FormGroup>
            </ListGroup>
            {/* </CardBody> */}
          </Card>
        </Col>
        <Col xl="4">
          <Card className="mb-4">
          <Link to={`/cars/${job?.car._id}`} >
            <img
              alt="Sample"
              src={imageUrl}
              style={{ width: "100%" }}
            /></Link>
            <CardBody>
              <CardTitle tag="h5">{job?.car.titre}</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {job?.car.prix}
              </CardSubtitle>
              <CardText>{job?.car.description}</CardText>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <CardTitle> Files:</CardTitle>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpertiseChat;
