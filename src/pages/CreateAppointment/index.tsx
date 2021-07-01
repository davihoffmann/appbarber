import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import { Provider } from '../Dashboard/types';
import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
} from './styles';

interface RouteParams {
    providerId: string;
}

export default function CreateAppointment(): ReactElement {
    const { user } = useAuth();
    const { goBack } = useNavigation();
    const route = useRoute();
    const routeParams = route.params as RouteParams;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);
    const [providers, setProviders] = useState<Provider[]>([]);

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const naviteBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(state => !state);
    }, []);

    const handleDateChange = useCallback((event: any, date: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (date) {
            setSelectedDate(date);
        }
    }, []);

    return (
        <Container>
            <Header>
                <BackButton onPress={naviteBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>Cabeleireiros</HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <ProvidersListContainer>
                <ProvidersList
                    data={providers}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={provider => provider.id}
                    renderItem={({ item: provider }) => (
                        <ProviderContainer
                            selected={provider.id === selectedProvider}
                            onPress={() => handleSelectProvider(provider.id)}
                        >
                            <ProviderAvatar source={{ uri: provider.avatar_url }} />
                            <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
                        </ProviderContainer>
                    )}
                />
            </ProvidersListContainer>

            <Calendar>
                <Title>Escolha a Data</Title>

                <OpenDatePickerButton onPress={handleToggleDatePicker}>
                    <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
                </OpenDatePickerButton>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        themeVariant="dark"
                        onChange={handleDateChange}
                    />
                )}
            </Calendar>
        </Container>
    );
}
