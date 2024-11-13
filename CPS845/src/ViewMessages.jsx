import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import TemplatePage from "./TemplatePage";
import "./main.css";

function ViewMessages() {
  const { courseId, sender } = useParams(); // Get courseId and sender from URL params
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  // Get the logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Fetch the sender's email from the messages data
  useEffect(() => {
    const fetchSenderEmail = () => {
      // Look for a message sent by the sender and retrieve the senderEmail
      const messageFromSender = messages.find((msg) => msg.sentBy === sender);
      if (messageFromSender) {
        setSenderEmail(messageFromSender.senderEmail);
      }
    };

    fetchSenderEmail();
  }, [messages, sender]);

  // Fetch all messages exchanged between the logged-in user and the sender
  useEffect(() => {
    const fetchConversation = async () => {
      if (!loggedInUser || !courseId || !sender) return;

      const { data, error } = await supabase
        .from("CHAT")
        .select("messageId, courseId, userId, sentBy, senderEmail, subject, message, seen, timestamp")
        .eq("courseId", courseId)
        .or(`sentBy.eq.${sender},senderEmail.eq.${loggedInUser.email}`)
        .order("timestamp", { ascending: true });

      if (error) {
        setFetchError("Could not fetch messages");
        console.error(error);
        setMessages([]);
      } else {
        setMessages(data);
        markMessagesAsSeen(data);
      }
    };

    fetchConversation();
  }, [loggedInUser, courseId, sender]);

  // Mark all unseen messages as seen when the recipient views them
  const markMessagesAsSeen = async (messages) => {
    if (!loggedInUser) return;

    // Filter messages where the logged-in user is the recipient and the message is unseen
    const unseenMessageIds = messages
      .filter((msg) => !msg.seen && msg.userId === loggedInUser.id)
      .map((msg) => msg.messageId);

    if (unseenMessageIds.length === 0) return;

    const { error } = await supabase
      .from("CHAT")
      .update({ seen: true })
      .in("messageId", unseenMessageIds);

    if (error) {
      console.error("Could not update message status to seen:", error);
    }
  };

  // Navigate to the SendMessage form with autofilled values
  const handleReply = () => {
    // Use the senderEmail as the recipientEmail for the reply
    navigate("/sendMessage", {
      state: {
        courseId,
        recipientEmail: senderEmail,
        subject: `RE: ${messages.length > 0 ? messages[messages.length - 1].subject : ""}`,
      },
    });
  };

  return (
    <TemplatePage>
      <div className="view-messages-page">
        <h1>Conversation with {sender}</h1>
        {fetchError && <p className="error">{fetchError}</p>}
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.messageId} className={`message ${message.seen ? "seen" : "unseen"}`}>
              <p className="message-sender">
                <strong>{message.sentBy === loggedInUser.fullName ? "You" : message.sentBy}:</strong>
              </p>
              <p className="message-subject">{message.subject}</p>
              <p className="message-text">{message.message}</p>
              <span className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="reply-button" onClick={handleReply}>
          Reply
        </button>
      </div>
    </TemplatePage>
  );
}

export default ViewMessages;
