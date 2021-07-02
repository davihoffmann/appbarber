import React, { ReactElement, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Container, Title, Description, OkButton, OkButtonText } from './styles';

export default function AppointmentCreated(): ReactElement {
    const { reset } = useNavigation();

    const handleOkPressed = useCallback(() => {
        reset({
            routes: [
                {
                    name: 'Dashboard',
                },
            ],
            index: 0,
        });
    }, [reset]);

    return (
        <Container>
            <Icon name="check" size={80} color="#04d361" />

            <Title>Agendamento Concluido</Title>

            <Description>terça, dia 14 de março de 2020 às 12:00</Description>

            <OkButton onPress={handleOkPressed}>
                <OkButtonText>ok</OkButtonText>
            </OkButton>
        </Container>
    );
}
