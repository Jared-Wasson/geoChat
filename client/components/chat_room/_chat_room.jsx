import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';

import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';
import { Paper } from '../common/paper';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  console.log(id);
  const [messages, sendMessage] = useMessages(chatRoom);

  useEffect(async () => {
    const { user } = await api.get('/users/me');
    setUser(user);
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, []);

  if (loading) return 'Loading...';

  return (
    <div className="backgroundstyle width">
      <div className="line-5"></div>
      <h2 className="header2">Messages</h2>
      <div className="line-5"></div>
      <div className="news-local">
        <textarea type="text" value={contents} onChange={(e) => setContents(e.target.value)} className="glowing-border input" placeholder="Message..."/>
        <button className='button1 button news-local' onClick={() => {sendMessage(contents, user); setContents('')}}>Send Message</button>
      </div>
      <div className="scroll">
      <div>
        {messages.map((message) => (
          <div className="news-worlds" key={message.id}>
            <Paper>
            <h3 className="h3">{message.userName}</h3>
            {message.contents}
            </Paper>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

