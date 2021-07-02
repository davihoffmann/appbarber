import React, { ReactElement, useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Provider } from '../Dashboard/types';
import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    Content,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
    CreateAppointmentButton,
    CreateAppointmentBottonText,
} from './styles';

interface RouteParams {
    providerId: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

export default function CreateAppointment(): ReactElement {
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();
    const route = useRoute();
    const routeParams = route.params as RouteParams;

    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);
    const [providers, setProviders] = useState<Provider[]>([]);

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

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

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);

            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('appointments', {
                provider_id: selectedProvider,
                date,
            });

            navigate('AppointmentCreated', { date: date.getTime() });
        } catch (err) {
            Alert.alert(
                'Erro ao criar agendamento!',
                'Ocorreu um erro ao tentar criar o agendamento, tente novamente!'
            );
        }
    }, [navigate, selectedDate, selectedHour, selectedProvider]);

    const morningAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                };
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour >= 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                };
            });
    }, [availability]);

    return (
        <Container>
            <Header>
                <BackButton onPress={naviteBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>Cabeleireiros</HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <Content>
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

                <Schedule>
                    <Title>Escolha um Horário</Title>

                    <Section>
                        <SectionTitle>Manhã</SectionTitle>

                        <SectionContent>
                            {morningAvailability.map(({ hourFormatted, hour, available }) => (
                                <Hour
                                    enabled={available}
                                    available={available}
                                    selected={hour === selectedHour}
                                    key={hourFormatted}
                                    onPress={() => handleSelectHour(hour)}
                                >
                                    <HourText selected={hour === selectedHour}>{hourFormatted}</HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>

                    <Section>
                        <SectionTitle>Tarde</SectionTitle>

                        <SectionContent>
                            {afternoonAvailability.map(({ hourFormatted, hour, available }) => (
                                <Hour
                                    enabled={available}
                                    available={available}
                                    selected={hour === selectedHour}
                                    key={hourFormatted}
                                    onPress={() => handleSelectHour(hour)}
                                >
                                    <HourText selected={hour === selectedHour}>{hourFormatted}</HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                </Schedule>

                <CreateAppointmentButton onPress={handleCreateAppointment}>
                    <CreateAppointmentBottonText>Agendar</CreateAppointmentBottonText>
                </CreateAppointmentButton>
            </Content>
        </Container>
    );
}
