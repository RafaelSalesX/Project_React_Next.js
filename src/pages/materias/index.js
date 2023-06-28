import {useIdToken} from "react-firebase-hooks/auth";
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box, Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText, Stack, TextField,
    Typography
} from "@mui/material";
import {useRouter} from "next/router";
import {auth, collection, db, getDocs, addDoc, onSnapshot, deleteDoc,doc, updateDoc  } from "@/services/firabase.config";

import Image from "next/image";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup"; // Biblioteca de validação 
import FieldInput from "@/components/Input/InputComponent";
import InputMask from "react-input-mask";
import {useEffect, useState} from "react";





const schema = yup.object().shape({
    nome: yup.string().required('O Nome é obrigatório'),
    //Ajuda do Stackoverflow: https://stackoverflow.com/questions/64739505/yup-transforming-a-string-to-a-currency
    valor: yup.string().required('O Valor é obrigatório'),
    quantidade: yup.number().required('A Quantidade é obrigatória')
        .typeError('Quantidade deve ser um número'),
    marca: yup.string().required('A Marca é obrigatório'),
    peso: yup.string().required('O Peso é obrigatório'),
});



const Index = (props) => {
    const [user, loading, error] = useIdToken(auth);
    const [dadosFirestore, setDadosFirestore] = useState([]);


    const router = useRouter();
    const { reset,control,setValue ,register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        shouldUnregister: false
    });

    useEffect(() => {
        const listener = onSnapshot(collection(db, 'materiais'), (snapshot) => {
            const dados = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDadosFirestore(dados);
        });

        return () => {
            listener();
        };
    }, []);
    if (!loading && !user) {
        router.push("/");
        return ;
    }


    const adicionarDocumento = async (dados) => {
        try {
            const docRef = await addDoc(collection(db, 'materiais'), dados);
            console.log('Documento adicionado com ID:', docRef.id);
        } catch (error) {
            console.error('Erro ao adicionar documento:', error);
        }
    };

    const editarumDocumento = async (dados) => {
            const docRef = await updateDoc(doc(db, 'materiais',dados.id), dados);
    };
    const onSubmit = (data) => {
        if(data.id){
            editarumDocumento(data).then((result) => {
                reset();
            }).catch((error) => {
                console.log(error)
            });
        }else{
            adicionarDocumento(data).then((result) => {
                reset();
            }).catch((error) => {
                console.log(error)
            });
        }



    };

    const edit = (item) =>{
        Object.entries(item).forEach(([fieldName, value]) => {
            setValue(fieldName, value, { shouldTouch: true });
        });
    }

    const remove = (item) => {
        deleteDoc(doc(db, "materiais", item.id))
    }




    return (

        <Box sx={{padding:'30px'}} >

            <Accordion sx={{marginBottom:5}} >
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Cadastrar Novo Material</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                    <Stack direction="row" spacing={2} sx={{alignItems: 'center',}}>

                        <Controller
                            control={control}
                            name="nome"
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nome"
                                    size={'small'}
                                    error={!!errors.nome}
                                    helperText={errors.nome?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="valor"
                            defaultValue=""
                            render={({ field }) => (
                                <InputMask
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    maskChar=''
                                    mask="R$ 999,99"
                                    {...register('valor')}
                                >
                                    {(input) =>
                                    {
                                     return   <TextField
                                            {...input}
                                            label="Valor"
                                            variant="outlined"
                                            size={'small'}
                                            error={!!errors.valor}
                                            helperText={errors.valor ? errors.valor.message : ''}

                                        />
                                    }}
                                </InputMask>
                            )}
                        />

                        <Controller
                            control={control}
                            name="quantidade"
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Quantidade"
                                    size={'small'}
                                    error={!!errors.quantidade}
                                    helperText={errors.quantidade?.message}
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name="marca"
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Marca"
                                    size={'small'}
                                    error={!!errors.marca}
                                    helperText={errors.marca?.message}
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name="peso"
                            defaultValue=""
                            render={({ field }) => (
                                <InputMask
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    maskChar=''
                                    mask="Kg 9999999"
                                    {...register('peso')}
                                >
                                    {(input) =>
                                    {
                                        return   <TextField
                                            {...input}
                                            label="Peso"
                                            variant="outlined"
                                            size={'small'}
                                            error={!!errors.peso}
                                            helperText={errors.peso ? errors.peso.message : ''}

                                        />
                                    }}
                                </InputMask>
                            )}
                        />

                        <Button type={'submit'} variant="contained">Enviar</Button>
                    </Stack>

                    </Box>

                </AccordionDetails>
            </Accordion>
            <Accordion  expanded={true}>
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Listar Materiais </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%'}}>
                    <List sx={{ width: '100%', maxWidth: 1000}}>

                        {dadosFirestore.map((it) => {
                            return(
                                <ListItem
                                    key={it.id}
                                    // disableGutters

                                    secondaryAction={
                                        <Stack direction="row" >
                                            <IconButton aria-label="comment" onClick={()=>{edit(it)}}>
                                                <Image  alt={'edit'}  width={24}
                                                          height={24} src={"https://img.icons8.com/?size=512&id=71201&format=png"}/>
                                            </IconButton>
                                            <IconButton aria-label="comment" onClick={()=>{remove(it)}}>
                                                <Image  alt={'lixo'}  width={24}
                                                          height={24} src={"https://img.icons8.com/?size=512&id=67884&format=png"}/>
                                            </IconButton>
                                        </Stack>

                                    }
                                >
                                    <ListItemText primary={`Materiais:`}  secondary={it.nome} sx={{ width:400,marginRight:5}}/>
                                    <ListItemText primary={`Valor:`}  secondary={it.valor} sx={{ width:400,marginRight:5}}/>
                                    <ListItemText primary={`Quantidade:`}  secondary={`${it.quantidade}`} sx={{ width:400,marginRight:5}}/>
                                    <ListItemText primary={`Marca:`}  secondary={it.marca} sx={{ width:400,marginRight:5}}/>
                                    <ListItemText primary={`Peso:`}  secondary={it.peso} sx={{ width:400,marginRight:5}}/>
                                </ListItem>
                            )
                        })
                        }

                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default Index;

export async function getServerSideProps() {
    // Fetch data from Firebase
    const snapshot = await getDocs(collection(db, 'materiais'));
    const data   = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return {
        props: {
            data,
        },
    };
}
