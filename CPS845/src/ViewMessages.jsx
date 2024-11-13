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
  const [senderEmail, setSenderEmail] = useState("");
  const [senderId, setSenderId] = useState(null);

  // Get the logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Fetch the sender's user ID and email using FIRST_NAME and LAST_NAME
  const fetchSenderInfo = async () => {
    if (!sender) return;

    const [firstName, lastName] = sender.split(" ");

    const { data, error } = await supabase
      .from("USERS")
      .select("id, EMAIL")
      .eq("FIRST_NAME", firstName)
      .eq("LAST_NAME", lastName)
      .single();

    if (error) {
      console.error("Could not fetch sender information:", error);
    } else {
      setSenderId(data.id);
      setSenderEmail(data.EMAIL);
    }
  };

  // Fetch the sender's information when the sender changes
  useEffect(() => {
    fetchSenderInfo();
  }, [sender]);

  // Fetch all messages exchanged between the logged-in user and the sender
  useEffect(() => {
    const fetchConversation = async () => {
      if (!loggedInUser || !courseId || !senderId) return;

      const { data, error } = await supabase
        .from("CHAT")
        .select("messageId, courseId, userId, sentBy, senderEmail, subject, message, seen, timestamp")
        .eq("courseId", courseId)
        .or(
          `and(userId.eq.${loggedInUser.id},senderEmail.eq.${senderEmail}),and(userId.eq.${senderId},senderEmail.eq.${loggedInUser.email})`
        )
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
  }, [loggedInUser, courseId, senderId, senderEmail]);

  // Mark all unseen messages as seen when the recipient views them
  const markMessagesAsSeen = async (messages) => {
    if (!loggedInUser) return;

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
