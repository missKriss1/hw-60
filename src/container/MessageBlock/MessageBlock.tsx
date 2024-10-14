import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import ItemMessage from '../../copmonents/itemMessage/ItemMessage.tsx';
import { useEffect, useState } from 'react';
import { IMessage } from '../../types';


const MessageBlock = () => {
  const [message, setMessage] = useState<IMessage[]>([]);
  const [author, setAuthor] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');

  const url = 'http://146.185.154.90:8000/messages';

  const getMessage = async () => {
    const response = await fetch(url);
    console.log(response);

    if (response.ok) {
      const posts = await response.json();
      posts.reverse();
      setMessage(posts);
      let lastTimeMesg = posts[0].datetime;

      const interval = setInterval(async () => {

        const newMessages = await fetch(`${url}?datetime=${lastTimeMesg}`);

        if (newMessages.ok) {
          const getNewMessages = await newMessages.json();

          if(getNewMessages.length > 0){
            lastTimeMesg = getNewMessages[0].datetime;
            setMessage(prevState => [...getNewMessages, ...prevState ]);
          }

        }

      }, 2000);
      return () => clearInterval(interval);
    }
  }

  console.log(message)

  const addNewMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(author.trim().length === 0 || newMessage.trim().length === 0) {
      alert('Please enter a new message');
    }else {
      const data = new URLSearchParams();
      console.log(data);
      data.set('message', newMessage);
      data.set('author', author);
      const responseData = await fetch(url, {
        method: 'post',
        body: data,
      });
      console.log(responseData);

      if (responseData.ok) {
        setNewMessage('')
        setAuthor('')
      }

    }
  }

  useEffect(() => {
    void getMessage();
  }, [url])

  return (
    <>
      <Container>
        <Form className="mt-4" onSubmit={addNewMessage}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Author</Form.Label>
            <Form.Control type="name" placeholder="Name" value={author} onChange={(e) => setAuthor(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>New message</Form.Label>
            <Form.Control as="textarea" rows={3} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit">Add</Button>
        </Form>
        <hr/>
        <>
          {message.map((message) => (
            <ItemMessage
              key={message._id}
              message={message}
            />
          ))}
        </>
      </Container>
    </>

  );
};

export default MessageBlock;