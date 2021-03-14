import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useField } from '@unform/core';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

// extendendo todas as props de input, o HTMLInputElement é gobal no react
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // sobrescrevendo oname exigindo que seja obrigatorio
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle,
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isfocused, setIsFocused] = useState(false);
  const [isFilled, setISfilled] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setISfilled(!!inputRef.current?.value);
  }, []);

  const handleInputFOcus = useCallback(() => {
    setIsFocused(true);
  }, []);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });

    handleInputBlur();
  }, [fieldName, registerField, handleInputBlur]);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isfocused={isfocused}
      isFilled={isFilled}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFOcus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Input;
