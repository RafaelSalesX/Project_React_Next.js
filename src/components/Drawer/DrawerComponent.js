import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled,Box} from "@mui/material";
import React, {useState} from "react";
import {getAuth, signOut} from "firebase/auth";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LogoutIcon from '@mui/icons-material/Logout';
import {useRouter} from "next/router";
import Image from "next/image";
const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 250px;
  }
`;
const DrawerComponent = ({ isDrawerOpen,handleDrawerToggle ,logout}) => {
    const router = useRouter();
   return ( <StyledDrawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
       <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <List sx={{marginTop:'10px'}}>

            <ListItem disablePadding>
                <ListItemButton onClick={()=>{router.push('/dashboard')}}>
                    <ListItemIcon>
                        <Image  alt={'edit'}  width={24}
                                height={24} src={"https://img.icons8.com/?size=512&id=xtnIDXkBb0sK&format=png"}/>
                    </ListItemIcon>
                    <ListItemText primary={'Dashboard'} />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={()=>{router.push('/materias')}}>
                    <ListItemIcon>
                        {/*<AccountCircleIcon />*/}
                        <Image  alt={'edit'}  width={24}
                                height={24} src={"https://img.icons8.com/?size=512&id=3NL2GCVl1AeK&format=png"}/>
                    </ListItemIcon>
                    <ListItemText primary={'Material'} />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={()=>{router.push('/funcionarios')}}>
                    <ListItemIcon>
                        <Image  alt={'edit'}  width={24}
                                height={24} src={"https://img.icons8.com/?size=512&id=23264&format=png"}/>
                    </ListItemIcon>
                    <ListItemText primary={'Funcionarios'} />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={()=>{router.push('/fornecedor')}}>
                    <ListItemIcon>
                        <Image  alt={'edit'}  width={24}
                                height={24} src={"https://img.icons8.com/?size=512&id=11228&format=png"}/>
                    </ListItemIcon>
                    <ListItemText primary={'Fornecedor'} />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={()=>{router.push('/faturamento')}}>
                    <ListItemIcon>
                        <Image  alt={'edit'}  width={24}
                                height={24} src={"https://img.icons8.com/?size=512&id=vkXwMDxM_kUM&format=png"}/>
                    </ListItemIcon>
                    <ListItemText primary={'Faturamento'} />
                </ListItemButton>
            </ListItem>

        </List>
           <List>
               <ListItemButton style={{ marginTop: 'auto' }} onClick={()=>{logout()}}>
                   <ListItemIcon>
                       {/*<LogoutIcon />*/}
                   </ListItemIcon>
                   <ListItemText primary="Logout" />
               </ListItemButton>
           </List>
       </Box>
    </StyledDrawer>)

}

export default DrawerComponent;