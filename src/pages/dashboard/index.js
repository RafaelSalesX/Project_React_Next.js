import {useIdToken} from "react-firebase-hooks/auth";
import {Box, Stack, Typography} from "@mui/material";
import {useRouter} from "next/router";
import MainLayout from "@/layouts/MainLayout";
import {auth, collection, db, getDocs} from "@/services/firabase.config";
import {useEffect, useState} from "react";
import MaterialChart from "@/components/Chart/ChartComponent";



const Index = (props) => {
    const [data, setData] = useState([]);
    const [user, loading, error] = useIdToken(auth);
    const router = useRouter();


    if (!loading && !user) {
        router.push("/");
        return ;
    }
    console.log(props.data)

    return (


                <Box mt={30} sx={{display:'flex', justifyContent:'center', height:300}}>
                    <Box sx={{ width:400, textAlign:'center'}} mr={20}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Quantidade de materiais (ESTOQUE)
                        </Typography>
                        <MaterialChart  type={'bat'} dadosMateriais={props.data}/>
                    </Box>
                    <Box sx={{ width:400, textAlign:'center'}}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Faturamento
                        </Typography>
                        <MaterialChart type={'fat'} dadosMateriais={props.datafat}/>
                    </Box>

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
    data.length ? data : data.push({quantidade:2, name:'Sem dados'})

    const snapshotFat = await getDocs(collection(db, 'faturamento'));
    const datafat   = snapshotFat.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    datafat.length ? datafat : datafat.push({mes:'Janeiro', valor:'R$ 0,0'})
    return {
        props: {
            data,
            datafat
        },
    };
}
