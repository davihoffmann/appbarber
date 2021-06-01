import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { InputProps } from './types';
import { Container, TextInput, Icon } from './styles';

interface InputValueReference {
    value: string;
}

const Input: React.FC<InputProps> = ({ name, icon, ...rest }) => {
    const { registerField, defaultValue = '', fieldName, error } = useField(name);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
        });
    }, [fieldName, registerField]);

    return (
        <Container>
            <Icon name={icon} size={20} color="#666360" />
            <TextInput
                {...rest}
                placeholderTextColor="#666360"
                keyboardAppearance="dark"
                defaultValue={defaultValue}
                onChangeText={value => {
                    inputValueRef.current.value = value;
                }}
            />
        </Container>
    );
};

export default Input;
