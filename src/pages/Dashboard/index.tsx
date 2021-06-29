import React, { ReactElement } from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../../hooks/auth';

export default function Dashboard(): ReactElement {
    const { signOut } = useAuth();

    function handleSignOut(): void {
        signOut();
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
            <Button title="Sair" onPress={handleSignOut} />
        </View>
    );
}
