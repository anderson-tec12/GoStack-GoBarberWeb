import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/ToastContext';

import getValidation from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Background, AnimationContainer, Content } from './styles';
import api from '../../services/apiClient';
import LogoImg from '../../assets/logo.svg';

interface ForgotPasswordFormData {
  email: string;
}
const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  // const history = useHistory();

  // const auth = useAuth();
  const toast = useToast();
  // console.log(auth);

  const { addToast } = toast;

  // console.log(user);
  const handlerSubmit = useCallback(
    async (data: ForgotPasswordFormData): Promise<void> => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        // validar um objeto inteiro
        const schema = Yup.object().shape({
          email: Yup.string().required('Email obrigatório'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('password/forgot', { email: data.email });

        addToast({
          type: 'success',
          title: 'Email de recuperação enviado',
          description:
            'Eviao um email para cofirma a recuperação de email, check seu emai',
        });
      } catch (err) {
        console.log(err);

        if (err instanceof Yup.ValidationError) {
          const erros = getValidation(err);
          formRef.current?.setErrors(erros);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handlerSubmit}>
            <h1>Recuperar Senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
