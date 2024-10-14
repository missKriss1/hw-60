import { IMessage } from '../../types';
import * as React from 'react';
import { format } from 'date-fns';

interface IItemMessage {
  message: IMessage;
}

const ItemMessage: React.FC <IItemMessage> = ({message}) => {
  const currentDate = format(new Date(message.datetime), 'MMMM do yyyy, h:mm:ss a')
  return (
    <div>
      <div className="row">
        <h3 className="col-1">Name:</h3>
        <strong className="col-1 mt-2">{message.author}</strong>
      </div>
        <strong>Message:</strong>
        <p>{message.message}</p>
      <div className="row">
        <p className="col-1">Time:</p>
        <p className="col-3 mt-2">{currentDate}</p>
      </div>
      <hr/>
    </div>
  );
};

export default ItemMessage;