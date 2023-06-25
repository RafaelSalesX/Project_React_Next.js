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
    contato: yup.string().required('O Contato é obrigatório'),
    email: yup.string().email('Email inválido').required('O Email é obrigatório'),
    telefone: yup.string().required('O Telefone é obrigatório'),
    endereco: yup.string().required('O Endereço é obrigatório'),
    cidade: yup.string().required('A Cidade é obrigatória'),
});

const Index = (props) => {
    const [user, loading, error] = useIdToken(auth);
    const [dadosFirestore, setDadosFirestore] = useState([]);

    const router = useRouter();
    const { reset, control, setValue, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        shouldUnregister: false,
    });

    useEffect(() => {
        const listener = onSnapshot(collection(db, 'fornecedores'), (snapshot) => {
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
            const docRef = await addDoc(collection(db, 'fornecedores'), dados);
            console.log('Documento adicionado com ID:', docRef.id);
            reset();
        } catch (error) {
            console.error('Erro ao adicionar documento:', error);
        }
    };

    const editarUmDocumento = async (dados) => {
        try {
            await updateDoc(doc(db, 'fornecedores', dados.id), dados);
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = (data) => {
        if (data.id) {
            editarUmDocumento(data);
        } else {
            adicionarDocumento(data);
        }
    };

    const edit = (item) => {
        Object.entries(item).forEach(([fieldName, value]) => {
            setValue(fieldName, value, { shouldTouch: true });
        });
    };

    const remove = (item) => {
        deleteDoc(doc(db, "fornecedores", item.id));
    };

    return (
        <Box sx={{ padding: '30px' }}>
            <Accordion sx={{ marginBottom: 5 }}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Cadastrar Novo Fornecedor</Typography>
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
                                        size="small"
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="contato"
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Contato"
                                        size="small"
                                        error={!!errors.contato}
                                        helperText={errors.contato?.message}
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
                                        size="small"
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
                                        maskChar=""
                                        mask="(99) 99999-9999"
                                        {...register('telefone')}
                                    >
                                        {(input) => (
                                            <TextField
                                                {...input}
                                                label="Telefone"
                                                variant="outlined"
                                                size="small"
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
                                        size="small"
                                        error={!!errors.endereco}
                                        helperText={errors.endereco?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="cidade"
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Cidade"
                                        size="small"
                                        error={!!errors.cidade}
                                        helperText={errors.cidade?.message}
                                    />
                                )}
                            />

                            <Button type="submit" variant="contained">Enviar</Button>
                        </Stack>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={true}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Listar Fornecedores</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%' }}>
                    <List sx={{ width: '100%', maxWidth: 1400 }}>
                        {dadosFirestore.map((item) => (
                            <ListItem key={item.id} secondaryAction={
                                <Stack direction="row">
                                    <IconButton aria-label="comment" onClick={()=>{edit(item)}}>
                                        <Image  alt={'edit'}  width={24}
                                                height={24} src={"https://img.icons8.com/?size=512&id=71201&format=png"}/>
                                    </IconButton>
                                    <IconButton aria-label="comment" onClick={()=>{remove(item)}}>
                                        <Image  alt={'lixo'}  width={24}
                                                height={24} src={"https://img.icons8.com/?size=512&id=67884&format=png"}/>
                                    </IconButton>
                                </Stack>
                            }>
                                <ListItemText primary={`Nome`} secondary={item.nome} />
                                <ListItemText primary={`Email`} secondary={item.email} />
                                <ListItemText primary={`Contato`} secondary={item.contato} />
                                <ListItemText primary={`Telefone`} secondary={item.telefone} />
                                <ListItemText primary={`Endereço`} secondary={item.endereco} />
                                <ListItemText primary={`Cidade`} secondary={item.cidade} />
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
    const snapshot = await getDocs(collection(db, 'fornecedores'));
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
