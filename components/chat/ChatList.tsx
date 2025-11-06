import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../src/configs/auth"; // Import your firebase config and auth
import { onAuthStateChanged } from "firebase/auth"; // For auth state

const ChatSidebar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null); // Firebase auth user
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

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
    if (currentUser) {
      const fetchChats = async () => {
        const q = query(
          collection(db, "userChats"),
          where("users", "array-contains", currentUser.uid)
        );
        onSnapshot(q, (snapshot) => {
          const chatList: any[] = [];
          snapshot.forEach((doc) => {
            chatList.push({ id: doc.id, ...doc.data() });
          });
          setChats(chatList);
        });
      };
      fetchChats();
    }
  }, [currentUser]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="w-1/4 h-screen bg-gray-100 p-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={search}
        onChange={handleSearch}
      />
      <div className="chat-list">
        {chats
          .filter((chat) =>
            chat.otherUserName
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((chat) => (
            <div key={chat.id} className="p-4 border-b border-gray-300">
              <div>{chat.otherUserName}</div>
              <div className="text-sm text-gray-500">{chat.lastMessage}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
