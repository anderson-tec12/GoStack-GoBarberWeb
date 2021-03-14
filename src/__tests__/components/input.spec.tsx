import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'E-mail',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('input  component', () => {
  it('should be able to render input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const ContainerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(ContainerElement).toHaveStyle('border-color:#ff9000;');
      expect(ContainerElement).toHaveStyle('color:#ff9000;');
    }, {});

    fireEvent.blur(inputElement);

    await wait(
      () => {
        expect(ContainerElement).not.toHaveStyle('border-color:#ff9000;');
        expect(ContainerElement).not.toHaveStyle('color:#ff9000;');
      },
      { timeout: 5000 },
    );
  });
});
