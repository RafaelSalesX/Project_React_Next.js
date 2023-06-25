import {Typography} from "@mui/material";

const TextBasicComponent = ({children} ) => {

    return (
        <Typography variant={'h4'}>
            {children}
        </Typography>
    )

}

export default TextBasicComponent;