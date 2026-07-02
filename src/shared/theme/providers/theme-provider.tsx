import { useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { ThemeContext } from '../context';
import { darkTheme, lightTheme } from '../themes';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const colorScheme = useColorScheme();

    const theme = useMemo(
        () => (colorScheme === 'dark' ? darkTheme : lightTheme),
        [colorScheme],
    );

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
