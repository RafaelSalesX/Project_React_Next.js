import { ThemeProvider, CssBaseline } from '@mui/material';
import  theme  from '../styles/theme';
import {useIdToken} from "react-firebase-hooks/auth";
import {auth} from "@/services/firabase.config";
import Navbar from "@/components/NavBar/NavbarComponet";





export default function MyApp({ Component, pageProps }) {
    const [user, loading, error] = useIdToken(auth);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            { user ?<Navbar name={user.displayName} avatarUrl={user.photoURL}/> : ''}
            <Component {...pageProps} />
        </ThemeProvider>
    );
}