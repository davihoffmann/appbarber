import React, { ReactElement, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';

import { Container, Header, BackButton, HeaderTitle, UserAvatar } from './styles';

interface RouteParams {
    providerId: string;
}

export default function CreateAppointment(): ReactElement {
    const { user } = useAuth();
    const { goBack } = useNavigation();
    const route = useRoute();
    const { providerId } = route.params as RouteParams;

    const naviteBack = useCallback(() => {
        goBack();
    }, [goBack]);

    return (
        <Container>
            <Header>
                <BackButton onPress={naviteBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>Cabeleireiros</HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>
        </Container>
    );
}
