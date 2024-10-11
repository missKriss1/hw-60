import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import ItemMessage from '../../copmonents/itemMessage/ItemMessage.tsx';
import { useEffect, useState } from 'react';
import { IMessage } from '../../types';

const MessageBlock = () => {
  const [message, setMessage] = useState<IMessage[]>([]);

  const url = 'http://146.185.154.90:8000/messages';

  const getMessage = async () => {
    const response = await fetch(url);
    console.log(response);

    if (response.ok) {
      const posts: IMessage[] = await response.json();
      posts.reverse();
      setMessage(posts);
      let lastTimeMesg = posts[0].datetime;

      const interval = setInterval(async () => {

        const newMessages = await fetch(`${url}?datetime=${lastTimeMesg}`);

        if (newMessages.ok) {
          const getNewMessage: IMessage[] = await newMessages.json();

          if(getNewMessage.length > 0){
            lastTimeMesg = getNewMessage[0].datetime;
            setMessage(prevState => [...prevState, ...newMessages]);
          }

        }

      }, 2000);
      return () => clearInterval(interval);
    }
  }

  const addNewMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new URLSearchParams();
    data.set('message', 'Hello!');
    data.set('author', 'John Doe');
    const response = await fetch(url, {
      method: 'post',
      body: data,
    });
  }

  useEffect(() => {
    void getMessage();
  }, [])

  return (
    <>
      <Container>
        <Form className="mt-4" onSubmit={addNewMessage}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Author</Form.Label>
            <Form.Control type="name" placeholder="Name"/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>New message</Form.Label>
            <Form.Control as="textarea" rows={3}/>
          </Form.Group>
          <Button variant="primary" type="submit">Add</Button>
        </Form>
        <hr/>
        <>
          {message.map((message) => (
            <ItemMessage
              key={message.id}
              message={message}
            />
          ))}
        </>
      </Container>
    </>

  );
};

export default MessageBlock;