import { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
    name: string;
    icon: string;
    containerStyle?: Record<string, unknown>;
}
