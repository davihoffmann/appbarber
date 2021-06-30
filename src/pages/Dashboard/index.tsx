import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { Provider } from './types';
import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar, ProvidersList } from './styles';

export default function Dashboard(): ReactElement {
    const { user, signOut } = useAuth();
    const { navigate } = useNavigation();

    const [providers, setProviders] = useState<Provider[]>([]);

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile = useCallback(() => {
        // navigate('Profile');
        signOut();
    }, [signOut]);

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
                renderItem={({ item }) => <UserName>{item.id}</UserName>}
            />
        </Container>
    );
}
