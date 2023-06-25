
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import {Box, Divider, Grid, Typography} from "@mui/material";
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldInput from "../components/Input/InputComponent.js"
import {auth} from "@/services/firabase.config";




const schema = yup.object().shape({
    email: yup.string().required('O E-mail é obrigatório').email('E-mail inválido'),
    senha: yup.string()
        .required('Senha é obrigatória')
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            'A senha deve conter pelo menos uma letra e um número'
        ),
});



const Home = () => {
    const provider = new GoogleAuthProvider();
    const [user, loading] = useAuthState(auth);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter();


    if (user) {
        router.push("/dashboard");
        return <div>Loading...</div>;
    }

    const signIn = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result.user);
    };

    const onSubmit = (data) => {
        console.log(data);
        signInWithEmailAndPassword(auth, data.email, data.senha).then((userCredential) => {}).catch((error) => {
            console.log(error)
        });
    };


    return (
        <MainLayout>
            <Grid container   sx={{
                width:450,
                height:500,
                display: 'flex',
                padding: '40px',

                alignItems: 'center',
            }}>
                <Grid item xl={7} xs={12}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign:'center',
                            borderImageSlice: 1,
                            borderRadius: '10px',
                            height: '200px',
                            width: '400px',
                        }}
                    >
                        <Typography variant={'p'} sx={{fontSize:'30px',fontWeight:300, marginBottom:'20px'}}>
                            Seja bem vindo!
                        </Typography>

                        {/* ------ Input E-mail -----*/}
                        <FieldInput
                        label={'E-mail'}
                        register={register('email')}
                        errors={errors.email}
                        message={errors.email?.message}
                        />
                        <Divider sx={{marginTop:'24px', border:0}} />

                        {/* ------ Input Senha -----*/}
                        <FieldInput
                            label={'Senha'}
                            register={register('senha')}
                            errors={errors.senha}
                            message={errors.senha?.message}
                        />


                        <Button type={'submit'} variant="outlined" sx={{marginTop:"30px", borderRadius:2, color:'#000',  borderColor: '#000'}}>
                            Entrar
                        </Button>

                        <Typography variant={'p'} sx={{fontSize:'17px',fontWeight:300, marginTop:'10px'}}>
                              Conta Teste: teste@gmail.com // Senha: 1234567A
                        </Typography>


                        <Divider sx={{marginBottom:'24px',  borderRadius:2,marginTop:'20px', border:0, height:'1px', background: "#000"}}  />

                        <Button onClick={()=>{
                            signIn()
                        }}  variant="contained" sx={{ backgroundColor: '#000'}} fullWidth>
                            Entrar com o Google
                        </Button>
                    </Box>
                </Grid>
            </Grid >
        </MainLayout>
    );
};

export default Home;