import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ChatDots,
  SendFill,
  CheckCircle,
  Clock,
  PersonCircle,
  ExclamationCircle,
} from "react-bootstrap-icons";
import toast from "react-hot-toast";

const AdminSupportChat = () => {
  const { token } = useSelector((state) => state.auth);

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAdminChats = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/support-chat/admin/chats`,
        {},
        config
      );

      if (res.data && res.data.success) {
        const fetchedChats = res.data.data.chats || [];
        setChats(fetchedChats);
        if (!selectedChatId && fetchedChats.length > 0) {
          setSelectedChatId(fetchedChats[0]._id);
        }
      }
    } catch (err) {
      console.error("Fetch admin chats error:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminChats(false);
    const interval = setInterval(() => {
      fetchAdminChats(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedChat = chats.find((c) => c._id === selectedChatId);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Send dispatcher reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat || sendingReply) return;

    const textToSend = replyText.trim();
    setReplyText("");

    try {
      setSendingReply(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/support-chat/send`,
        {
          sessionId: selectedChat.sessionId,
          text: textToSend,
        },
        config
      );

      if (res.data && res.data.success) {
        fetchAdminChats(true);
      }
    } catch (err) {
      console.error("Dispatcher send reply error:", err);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  // Mark status (e.g. Resolved / Open)
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/support-chat/admin/status`,
        {
          chatId: selectedChat._id,
          status: newStatus,
        },
        config
      );

      if (res.data && res.data.success) {
        toast.success(`Chat marked as ${newStatus}`);
        fetchAdminChats(true);
      }
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Failed to update status.");
    }
  };

  // Filter chats
  const filteredChats = chats.filter((c) => {
    if (filterStatus === "All") return true;
    return c.status === filterStatus;
  });

  const getBadgeVariant = (status) => {
    switch (status) {
      case "Open":
        return "danger";
      case "Waiting":
        return "warning";
      case "Resolved":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h4 className="fw-bold d-flex align-items-center gap-2 mb-1">
            <ChatDots className="text-primary" /> Support Chat & Dispatch Inbox
          </h4>
          <p className="text-muted small mb-0">
            Real-time customer live chat messages and dispatch assistance inbox.
          </p>
        </Col>
      </Row>

      <Row className="g-3" style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
        {/* Left List Column */}
        <Col md={4} lg={3} className="h-100 d-flex flex-column">
          <Card className="shadow-sm h-100 d-flex flex-column border-0">
            <Card.Header className="bg-white py-3 border-bottom">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold mb-0">Conversations</h6>
                <Badge bg="primary" pill>
                  {filteredChats.length}
                </Badge>
              </div>
              <Form.Select
                size="sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open (Needs Response)</option>
                <option value="Waiting">Waiting on Customer</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Card.Header>

            <Card.Body className="p-0 flex-grow-1 overflow-auto">
              {loading ? (
                <div className="text-center py-5 text-muted">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading inbox...
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-5 text-muted small px-3">
                  No conversations found for filter.
                </div>
              ) : (
                <ListGroup variant="flush">
                  {filteredChats.map((chat) => {
                    const lastMsg =
                      chat.messages && chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1]
                        : null;
                    const isSelected = chat._id === selectedChatId;

                    return (
                      <ListGroup.Item
                        key={chat._id}
                        action
                        active={isSelected}
                        onClick={() => setSelectedChatId(chat._id)}
                        className="py-3 px-3 border-bottom"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-truncate" style={{ maxWidth: "160px" }}>
                            {chat.customerName || "Guest Passenger"}
                          </span>
                          <Badge bg={getBadgeVariant(chat.status)}>
                            {chat.status}
                          </Badge>
                        </div>

                        {chat.customerEmail && (
                          <div className="small text-muted text-truncate mb-1">
                            {chat.customerEmail}
                          </div>
                        )}

                        {lastMsg && (
                          <div className="small text-truncate text-secondary">
                            <span className="fw-semibold">
                              {lastMsg.sender === "Dispatcher" ? "You: " : ""}
                            </span>
                            {lastMsg.text}
                          </div>
                        )}

                        <div className="text-end text-muted mt-1" style={{ fontSize: "11px" }}>
                          {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Active Chat Column */}
        <Col md={8} lg={9} className="h-100 d-flex flex-column">
          <Card className="shadow-sm h-100 d-flex flex-column border-0">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                      <PersonCircle className="text-primary" />
                      {selectedChat.customerName || "Guest Passenger"}
                    </h6>
                    <div className="small text-muted">
                      {selectedChat.customerEmail || "No email provided"}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {selectedChat.status !== "Resolved" ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleUpdateStatus("Resolved")}
                      >
                        <CheckCircle className="me-1" /> Mark Resolved
                      </Button>
                    ) : (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleUpdateStatus("Open")}
                      >
                        Re-Open Chat
                      </Button>
                    )}
                  </div>
                </Card.Header>

                {/* Messages Body */}
                <Card.Body className="p-3 flex-grow-1 overflow-auto bg-light d-flex flex-column gap-3">
                  {selectedChat.messages?.map((msg, index) => {
                    const isDisp = msg.sender === "Dispatcher";
                    return (
                      <div
                        key={index}
                        className={`d-flex flex-column ${
                          isDisp ? "align-items-end" : "align-items-start"
                        }`}
                      >
                        <div
                          className="px-3 py-2 rounded-3 shadow-sm"
                          style={{
                            maxWidth: "75%",
                            backgroundColor: isDisp ? "#0d6efd" : "#ffffff",
                            color: isDisp ? "#ffffff" : "#212529",
                            border: isDisp ? "none" : "1px solid #dee2e6",
                          }}
                        >
                          <div className="fw-bold mb-1" style={{ fontSize: "11px", opacity: 0.85 }}>
                            {msg.senderName || msg.sender}
                          </div>
                          <div style={{ fontSize: "14px", wordBreak: "break-word" }}>
                            {msg.text}
                          </div>
                        </div>
                        <div className="text-muted mt-1" style={{ fontSize: "11px" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Card.Body>

                {/* Reply Footer */}
                <Card.Footer className="bg-white p-3 border-top">
                  <Form onSubmit={handleSendReply} className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Type your response to the customer..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!replyText.trim() || sendingReply}
                      className="d-flex align-items-center gap-1"
                    >
                      <SendFill size={14} /> Send
                    </Button>
                  </Form>
                </Card.Footer>
              </>
            ) : (
              <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                Select a conversation from the left to view messages.
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminSupportChat;
