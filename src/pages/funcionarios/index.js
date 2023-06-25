import { useIdToken } from "react-firebase-hooks/auth";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

import {auth, collection, db, getDocs, addDoc, onSnapshot, deleteDoc,doc, updateDoc  } from "@/services/firabase.config";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FieldInput from "@/components/Input/InputComponent";
import InputMask from "react-input-mask";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
    nome: yup.string().required('O Nome é obrigatório'),
    cargo: yup.string().required('O Cargo é obrigatório'),
    email: yup.string().email('Email inválido').required('O Email é obrigatório'),
    telefone: yup.string().required('O Telefone é obrigatório'),
    endereco: yup.string().required('O Endereço é obrigatório'),
});

const Index = () => {
    const [user, loading, error] = useIdToken(auth);
    const [dadosFirestore, setDadosFirestore] = useState([]);

    const router = useRouter();
    const { reset, control, setValue, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        shouldUnregister: false,
    });

    useEffect(() => {
        const listener = onSnapshot(collection(db, 'funcionarios'), (snapshot) => {
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
        return null;
    }

    const adicionarDocumento = async (dados) => {
        try {
            const docRef = await addDoc(collection(db, 'funcionarios'), dados);
            console.log('Documento adicionado com ID:', docRef.id);
        } catch (error) {
            console.error('Erro ao adicionar documento:', error);
        }
    };

    const editarumDocumento = async (dados) => {
        const docRef = await updateDoc(doc(db, 'funcionarios', dados.id), dados);
    };

    const onSubmit = (data) => {
        if (data.id) {
            editarumDocumento(data).then((result) => {
                reset();
            }).catch((error) => {
                console.log(error)
            });
        } else {
            adicionarDocumento(data).then((result) => {
                reset();
            }).catch((error) => {
                console.log(error)
            });
        }
    };

    const edit = (item) => {
        Object.entries(item).forEach(([fieldName, value]) => {
            setValue(fieldName, value, { shouldTouch: true });
        });
    };

    const remove = (item) => {
        deleteDoc(doc(db, "funcionarios", item.id))
    };

    return (
        <Box sx={{ padding: '30px' }} >
            <Accordion sx={{ marginBottom: 5 }} >
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Cadastrar Novo Funcionário</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
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
                                name="cargo"
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Cargo"
                                        size={'small'}
                                        error={!!errors.cargo}
                                        helperText={errors.cargo?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="email"
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        size={'small'}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="telefone"
                                defaultValue=""
                                render={({ field }) => (
                                    <InputMask
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        maskChar=''
                                        mask="(99) 99999-9999"
                                        {...register('telefone')}
                                    >
                                        {(input) => (
                                            <TextField
                                                {...input}
                                                label="Telefone"
                                                variant="outlined"
                                                size={'small'}
                                                error={!!errors.telefone}
                                                helperText={errors.telefone ? errors.telefone.message : ''}
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                            <Controller
                                control={control}
                                name="endereco"
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Endereço"
                                        size={'small'}
                                        error={!!errors.endereco}
                                        helperText={errors.endereco?.message}
                                    />
                                )}
                            />
                            <Button type={'submit'} variant="contained">Enviar</Button>
                        </Stack>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion  expanded={true}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Listar Funcionários</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%' }}>
                    <List sx={{ width: '100%', maxWidth: 1000 }}>
                        {dadosFirestore.map((it) => (
                            <ListItem key={it.id} secondaryAction={
                                <Stack direction="row">
                                    <IconButton aria-label="comment" onClick={()=>{edit(it)}}>
                                        <Image  alt={'edit'}  width={24}
                                                height={24} src={"https://img.icons8.com/?size=512&id=71201&format=png"}/>
                                    </IconButton>
                                    <IconButton aria-label="comment" onClick={()=>{remove(it)}}>
                                        <Image  alt={'lixo'}  width={24}
                                                height={24} src={"https://img.icons8.com/?size=512&id=67884&format=png"}/>
                                    </IconButton>
                                </Stack>
                            }>
                                <ListItemText primary={`Nome:`} secondary={it.nome} sx={{ width: 400, marginRight: 5 }} />
                                <ListItemText primary={`Cargo:`} secondary={it.cargo} sx={{ width: 400, marginRight: 5 }} />
                                <ListItemText primary={`Email:`} secondary={it.email} sx={{ width: 400, marginRight: 5 }} />
                                <ListItemText primary={`Telefone:`} secondary={it.telefone} sx={{ width: 400, marginRight: 5 }} />
                                <ListItemText primary={`Endereço:`} secondary={it.endereco} sx={{ width: 400, marginRight: 5 }} />
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default Index;

export async function getServerSideProps() {
    const snapshot = await getDocs(collection(db, 'employees'));
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return {
        props: {
            data,
        },
    };
}
