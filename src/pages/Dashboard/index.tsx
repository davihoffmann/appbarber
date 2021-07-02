import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { Provider } from './types';
import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersListTitle,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderName,
    ProviderMeta,
    ProviderMetaText,
} from './styles';

export default function Dashboard(): ReactElement {
    const { user } = useAuth();
    const { navigate } = useNavigation();

    const [providers, setProviders] = useState<Provider[]>([]);

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, [navigate]);

    const navigateToCreateAppointment = useCallback(
        (providerId: string) => {
            navigate('CreateAppointment', { providerId });
        },
        [navigate]
    );

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem Vindo, {'\n'}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>
            </Header>

            <ProvidersList
                data={providers}
                keyExtractor={item => item.id}
                ListHeaderComponent={<ProvidersListTitle>Cabeleireiros</ProvidersListTitle>}
                renderItem={({ item: provider }) => (
                    <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
                        <ProviderAvatar source={{ uri: provider.avatar_url }} />
                        <ProviderInfo>
                            <ProviderName>{provider.name}</ProviderName>
                            <ProviderMeta>
                                <Icon name="calendar" size={14} color="#ff9000" />
                                <ProviderMetaText>Segunda a Sexta</ProviderMetaText>
                            </ProviderMeta>
                            <ProviderMeta>
                                <Icon name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h às 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    );
}
