import { useIdToken } from "react-firebase-hooks/auth";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

import {auth, collection, db, getDocs, addDoc, onSnapshot, deleteDoc,doc, updateDoc  } from "@/services/firabase.config";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputMask from "react-input-mask";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
    valor: yup.string().required('O Valor é obrigatório'),
    mes: yup.string().required('O Mês é obrigatório'),
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
        const listener = onSnapshot(collection(db, 'faturamento'), (snapshot) => {
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
        return;
    }

    const adicionarDocumento = async (dados) => {
        try {
            const docRef = await addDoc(collection(db, 'faturamento'), dados);
            console.log('Documento adicionado com ID:', docRef.id);
        } catch (error) {
            console.error('Erro ao adicionar documento:', error);
        }
    };

    const editarUmDocumento = async (dados) => {
        const docRef = await updateDoc(doc(db, 'faturamento', dados.id), dados);
    };

    const onSubmit = (data) => {
        if (data.id) {
            editarUmDocumento(data).then((result) => {
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
        deleteDoc(doc(db, "faturamento", item.id));
    };

    return (
        <Box sx={{ padding: '30px' }}>
            <Accordion sx={{ marginBottom: 5 }}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Cadastrar Faturamento Mensal</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
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
                                        mask="R$ 99999,99"
                                        {...register('valor')}
                                    >
                                        {(input) =>
                                            <TextField
                                                {...input}
                                                label="Valor"
                                                variant="outlined"
                                                size={'small'}
                                                error={!!errors.valor}
                                                helperText={errors.valor ? errors.valor.message : ''}
                                            />
                                        }
                                    </InputMask>
                                )}
                            />

                            <Controller
                                control={control}
                                name="mes"
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Mês"
                                        size={'small'}
                                        error={!!errors.mes}
                                        helperText={errors.mes?.message}
                                    />
                                )}
                            />

                            <Button type={'submit'} variant="contained">Enviar</Button>
                        </Stack>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={true}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Listar Faturamento Mensal</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ width: '100%' }}>
                    <List sx={{ width: '100%', maxWidth: 1000 }}>
                        {dadosFirestore.map((it) => (
                            <ListItem key={it.id} secondaryAction={
                                <Stack direction="row">
                                    <IconButton aria-label="comment" onClick={() => { edit(it) }}>
                                        <Image alt={'edit'} width={24} height={24} src={"https://img.icons8.com/?size=512&id=71201&format=png"} />
                                    </IconButton>
                                    <IconButton aria-label="comment" onClick={() => { remove(it) }}>
                                        <Image alt={'lixo'} width={24} height={24} src={"https://img.icons8.com/?size=512&id=67884&format=png"} />
                                    </IconButton>
                                </Stack>
                            }>
                                <ListItemText primary={`Valor:`} secondary={it.valor} sx={{ width: 400, marginRight: 5 }} />
                                <ListItemText primary={`Mês:`} secondary={it.mes} sx={{ width: 400, marginRight: 5 }} />
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default Index;
