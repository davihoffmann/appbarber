import React, { ReactElement, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';

import { useAuth } from '../../hooks/auth';

import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar } from './styles';

export default function Dashboard(): ReactElement {
    const { user } = useAuth();
    const { navigate } = useNavigation();

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, [navigate]);

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
        </Container>
    );
}
