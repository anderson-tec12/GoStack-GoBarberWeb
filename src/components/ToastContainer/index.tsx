import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';
import { Container } from './styles';
import { ToastMessages } from '../../hooks/ToastContext';

interface ToastContainerProps {
  messages: ToastMessages[];
}
const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: '0.2' },
      enter: { right: '0%', opacity: '1' },
      leave: { right: '-120%', opacity: '0.1' },
    },
  );
  // const handlerRemoveToast = useCallback((id: string) => removeToast(id), []);
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} message={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
