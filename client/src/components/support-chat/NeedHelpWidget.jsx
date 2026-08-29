import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ChatDotsFill,
  X,
  SendFill,
  ClockFill,
  CheckCircleFill,
  Headset,
  ExclamationCircleFill,
} from "react-bootstrap-icons";
import "./NeedHelpWidget.css";

const NeedHelpWidget = () => {
  const { user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isSupportAvailable, setIsSupportAvailable] = useState(true);
  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loadingSession, setLoadingSession] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  // After Hours Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Session ID stored in localStorage for guest persistence
  const getSessionId = () => {
    let sid = localStorage.getItem("bueno_support_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      localStorage.setItem("bueno_support_session_id", sid);
    }
    return sid;
  };

  // Helper to check support hours in America/New_York timezone
  const checkSupportAvailabilityET = () => {
    const nyDateString = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    const nyDate = new Date(nyDateString);
    const hours = nyDate.getHours();
    const minutes = nyDate.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const startInMinutes = 4 * 60 + 30; // 4:30 AM = 270 mins
    const endInMinutes = 21 * 60 + 30; // 9:30 PM = 1290 mins

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  };

  // Sync user info into form & session
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch or initialize session
  const fetchSession = async () => {
    const isAvailable = checkSupportAvailabilityET();
    setIsSupportAvailable(isAvailable);

    if (!isAvailable) return;

    try {
      setLoadingSession(true);
      const sid = getSessionId();
      const payload = {
        sessionId: sid,
        customerName: user?.name || formData.name || "Guest Passenger",
        customerEmail: user?.email || formData.email || "",
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/support-chat/session`,
        payload
      );

      if (res.data && res.data.success) {
        setChatSession(res.data.data.chat);
        setMessages(res.data.data.chat.messages || []);
      }
    } catch (err) {
      console.error("Support chat session error:", err);
    } finally {
      setLoadingSession(false);
    }
  };

  // Poll for messages when chat window is open during support hours
  useEffect(() => {
    if (isOpen && isSupportAvailable) {
      fetchSession();
      pollIntervalRef.current = setInterval(() => {
        fetchSession();
      }, 3000);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, isSupportAvailable]);

  // Toggle open
  const handleToggle = () => {
    const available = checkSupportAvailabilityET();
    setIsSupportAvailable(available);
    setIsOpen(!isOpen);
    setFormError("");
  };

  // Send Live Chat message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sendingMsg) return;

    const textToSend = inputText.trim();
    setInputText("");

    // Optimistic UI push
    const tempMsg = {
      sender: "Customer",
      senderName: user?.name || formData.name || "Customer",
      text: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      setSendingMsg(true);
      const sid = getSessionId();
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/support-chat/send`,
        {
          sessionId: sid,
          text: textToSend,
          customerName: user?.name || formData.name,
          customerEmail: user?.email || formData.email,
        }
      );

      if (res.data && res.data.success) {
        setChatSession(res.data.data.chat);
        setMessages(res.data.data.chat.messages || []);
      }
    } catch (err) {
      console.error("Failed to send support message:", err);
    } finally {
      setSendingMsg(false);
    }
  };

  // Submit After-Hours Request Form
  const handleAfterHoursSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter your Name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Please enter a valid Email address.");
      return;
    }
    if (!formData.reason.trim()) {
      setFormError("Please provide a reason for your contact.");
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/support-chat/after-hours`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          reason: formData.reason.trim(),
        }
      );

      if (res.data && res.data.success) {
        setFormSubmitted(true);
      } else {
        setFormError(res.data?.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error("After-hours submit error:", err);
      const msg =
        err.response?.data?.message ||
        "Something went wrong submitting your request. Please try again.";
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="need-help-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="need-help-trigger-btn"
          onClick={handleToggle}
          aria-label="Need Help?"
        >
          <ChatDotsFill size={18} />
          <span>Need Help?</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="need-help-window">
          {/* Header */}
          <div className="need-help-header">
            <div>
              <h6 className="need-help-header-title">Bueno Transit Support</h6>
              <div className="need-help-header-subtitle">
                <span
                  className={`need-help-status-dot ${
                    isSupportAvailable ? "online" : "offline"
                  }`}
                />
                {isSupportAvailable ? "Dispatcher Available" : "After-Hours Support"}
              </div>
            </div>
            <button
              className="need-help-close-btn"
              onClick={handleToggle}
              aria-label="Close Help Window"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="need-help-body">
            {isSupportAvailable ? (
              /* LIVE CHAT VIEW */
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-msg-bubble ${
                      msg.sender === "Customer" ? "customer" : "dispatcher"
                    }`}
                  >
                    <div className="chat-msg-sender">
                      {msg.senderName || msg.sender}
                    </div>
                    <div>{msg.text}</div>
                    <div className="chat-msg-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              /* AFTER-HOURS FORM VIEW */
              <div className="after-hours-card">
                {!formSubmitted ? (
                  <>
                    <div className="after-hours-banner">
                      <ClockFill className="me-2" />
                      Dispatch is currently unavailable. Live chat hours are daily 4:30 AM – 9:30 PM ET. Send us a request and our dispatch team will follow up.
                    </div>

                    {formError && (
                      <div className="alert alert-danger py-2 small mb-3">
                        <ExclamationCircleFill className="me-1" />
                        {formError}
                      </div>
                    )}

                    <form onSubmit={handleAfterHoursSubmit}>
                      <div className="mb-2">
                        <label className="form-label small fw-bold mb-1">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small fw-bold mb-1">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold mb-1">
                          Reason for Contact / How Can We Help?{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="3"
                          placeholder="Please describe your question or issue..."
                          value={formData.reason}
                          onChange={(e) =>
                            setFormData({ ...formData, reason: e.target.value })
                          }
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-sm w-100 fw-bold"
                        disabled={formSubmitting}
                      >
                        {formSubmitting ? "Sending to Dispatch..." : "Send to Dispatch"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="after-hours-success-banner">
                    <CheckCircleFill size={32} className="text-success mb-2" />
                    <h6 className="fw-bold mb-1">Request Sent!</h6>
                    <p className="small mb-0">
                      Your request has been sent to Dispatch. Our team will review it as soon as possible.
                    </p>
                    <button
                      className="btn btn-outline-secondary btn-sm mt-3"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ ...formData, reason: "" });
                      }}
                    >
                      Submit Another Request
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Input (Only shown during Support Hours) */}
          {isSupportAvailable && (
            <form className="need-help-footer" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="need-help-input"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="need-help-send-btn"
                disabled={!inputText.trim() || sendingMsg}
                aria-label="Send Message"
              >
                <SendFill size={14} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default NeedHelpWidget;
