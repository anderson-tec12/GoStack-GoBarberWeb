import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/apiClient';
import { useToast } from '../../hooks/ToastContext';

import getValidation from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Background, Content, AnimationContainer } from './styles';

import LogoImg from '../../assets/logo.svg';

interface SingUpFormData {
  name: string;
  email: string;
  password: string;
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handlerSubmit = useCallback(
    async (data: SingUpFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});
        //validar um objeto inteiro
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email obrigatório'),
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          title: 'Cadastro realizado com sucesso',
          type: 'success',
          description: 'Você já pode fazer seu logon',
        });

        history.push('/');
      } catch (err) {
        console.log(err);

        if (err instanceof Yup.ValidationError) {
          const erros = getValidation(err);
          formRef.current?.setErrors(erros);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao realizar cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        });
      }
      console.log(data);
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background></Background>
      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          <Form
            ref={formRef}
            initialData={{
              name: 'Anderson',
              email: 'anderson.tec12@gmail.com',
            }}
            onSubmit={handlerSubmit}
          >
            <h1>Faça seu cadastro</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
