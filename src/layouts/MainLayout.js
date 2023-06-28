// Login Page
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

const MainLayout = ({ children }) => {
    return (
            <Container   sx={{
                paddingTop: '24px',
                display: 'flex',
                  flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                // height: '100vh',
                 background:'#FFF'
            }}>
                {children}
            </Container>
    );
};

export default MainLayout;
