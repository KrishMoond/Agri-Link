import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../src/configs/auth"; // Import your firebase config
import { onAuthStateChanged } from "firebase/auth"; // For auth state

interface ChatAreaProps {
  chatId: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chatId }) => {
  const [currentUser, setCurrentUser] = useState<any>(null); // Firebase auth user
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    // Fetch current user
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "chats", chatId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data().messages || []);
        }
      }
    );
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !currentUser) return;
    const messageData = {
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "chats", chatId, "messages"), messageData);
    setNewMessage("");
  };

  return (
    <div className="w-3/4 h-screen bg-white p-4">
      <div className="chat-messages overflow-y-scroll h-4/5 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded ${
              message.senderId === currentUser?.uid
                ? "bg-blue-100 self-end"
                : "bg-gray-100"
            }`}
          >
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-4/5 p-2 border border-gray-300 rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
