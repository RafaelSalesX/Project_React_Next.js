import {
    AppBar,
    Avatar,
    Box,
    Button,
    styled,
    Toolbar,
    Typography
} from "@mui/material";
import {getAuth, signOut} from "firebase/auth";
import {useRouter} from "next/router";
import React, { useState } from 'react';
import DrawerComponent from "@/components/Drawer/DrawerComponent";

const StyledNavbar = styled('div')`
  flex-grow: 1;
`;

const Title = styled(Typography)`
  flex-grow: 1;
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const RightAlignedButton = styled(Button)`
  margin-left: auto;
`;


const Navbar = ({ name,avatarUrl }) => {
    const logout = () => {

        const auth = getAuth();
        signOut(auth);
        router.push("/");
    };
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const router = useRouter();
    return (
        <StyledNavbar>
            <AppBar position="static" sx={{backgroundColor: 'blue'}}>
                <Toolbar>
                    <Box sx={{display:'flex', alignItems: 'center',}}>
                        <Avatar alt={name} src={avatarUrl} />      <Title variant="p" >{name}</Title> {/* style={{color:"red"}}*/}
                        
                    </Box>
                    <RightAlignedButton color="inherit" onClick={handleDrawerToggle}>
                        Menu
                    </RightAlignedButton>
                </Toolbar>
                <DrawerComponent isDrawerOpen={isDrawerOpen} handleDrawerToggle={handleDrawerToggle}  logout={logout}/>
            </AppBar>

        </StyledNavbar>
    );
};

export default Navbar;

