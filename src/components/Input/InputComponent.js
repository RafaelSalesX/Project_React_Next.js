import {TextField} from "@mui/material";

const FieldInput = ( {errors, label, register, message} ) => {

    return (
        <TextField
            InputProps={{
                style: {
                    borderRadius: "15px",
                }
            }}
            label={label}
            {...register}
            error={!!errors}
            helperText={message}
        />
    )

}

export default FieldInput;