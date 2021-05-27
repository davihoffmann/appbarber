import React from 'react';

import { InputProps } from './types';
import { Container, TextInput, Icon } from './styles';

const Input: React.FC<InputProps> = ({ name, icon, ...rest }) => (
    <Container>
        <Icon name={icon} size={20} color="#666360" />
        <TextInput {...rest} placeholderTextColor="#666360" keyboardAppearance="dark" />
    </Container>
);

export default Input;
