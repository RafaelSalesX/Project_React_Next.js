
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
                // background:'#f1f1f1'
            }}>
                {children}
            </Container>
    );
};

export default MainLayout;
