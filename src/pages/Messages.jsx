import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Simple API (replace with your backend)
const api = {
  getUser: async () => {
    const res = await fetch('/api/me');
    return res.json();
  },

  getMessages: async () => {
    const res = await fetch('/api/messages');
    return res.json();
  },

  sendMessage: async (data) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Helper to group conversations
function getConversationKey(email1, email2) {
  return [email1, email2].sort().join('_');
}

export default function Messages() {
  const [activeChat, setActiveChat] = useState(null);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
  });

  // Get messages (auto refresh)
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: api.getMessages,
    refetchInterval: 5000,
  });

  // Filter only my messages
  const myMessages = messages.filter(
    (m) =>
      m.sender_email === user?.email ||
      m.receiver_email === user?.email
  );

  // Group into conversations
  const conversations = {};

  myMessages.forEach((msg) => {
    const key = getConversationKey(
      msg.sender_email,
      msg.receiver_email
    );

    if (!conversations[key]) {
      const other =
        msg.sender_email === user?.email
          ? msg.receiver_email
          : msg.sender_email;

      conversations[key] = {
        key,
        otherEmail: other,
        messages: [],
      };
    }

    conversations[key].messages.push(msg);
  });

  const chatList = Object.values(conversations);

  const activeMessages = activeChat
    ? conversations[activeChat]?.messages || []
    : [];

  // Send message
  const sendMutation = useMutation({
    mutationFn: api.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      setText('');
    },
  });

  const send = () => {
    if (!text.trim() || !activeChat) return;

    const convo = conversations[activeChat];

    sendMutation.mutate({
      sender_email: user.email,
      receiver_email: convo.otherEmail,
      content: text,
    });
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  // Chat view
  if (activeChat) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setActiveChat(null)}>← Back</button>

        <div style={{ marginTop: 20 }}>
          {activeMessages.map((msg) => {
            const isMe = msg.sender_email === user?.email;

            return (
              <div
                key={msg.id}
                style={{
                  textAlign: isMe ? 'right' : 'left',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: 10,
                    borderRadius: 10,
                    background: isMe ? '#4CAF50' : '#eee',
                    color: isMe ? '#fff' : '#000',
                  }}
                >
                  {msg.content}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    );
  }

  // Conversation list
  return (
    <div style={{ padding: 20 }}>
      <h2>Messages</h2>

      {chatList.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        chatList.map((chat) => {
          const last =
            chat.messages[chat.messages.length - 1];

          return (
            <div
              key={chat.key}
              onClick={() => setActiveChat(chat.key)}
              style={{
                borderBottom: '1px solid #ddd',
                padding: 10,
                cursor: 'pointer',
              }}
            >
              <strong>{chat.otherEmail}</strong>
              <p style={{ fontSize: 12 }}>{last.content}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
