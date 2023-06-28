import React from 'react';
import {Bar, Doughnut} from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);
const MaterialChart = ({ dadosMateriais,type }) => {
    // Extrair os nomes e quantidades de materiais
    if(type == 'fat'){
    console.log(dadosMateriais)
        const nomes = dadosMateriais.map((fat) => fat.mes);
        const quantidades = dadosMateriais.map((fat) => fat.valor.replace("R$", "").replace(",", ""));

        // Configurações do gráfico
        const data = {
            labels: nomes,
            datasets: [
                {
                    label: 'Faturamento',
                    data: quantidades,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8B008B', '#00BFFF'],
                    borderWidth: 1,
                },
            ],
        };

        // Opções de exibição do gráfico
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    },
                },
            },
        };
        return <Bar data={data} options={options} />;
    }else{
    const nomes = dadosMateriais.map((material) => material.nome);
    const quantidades = dadosMateriais.map((material) => material.quantidade);

    // Configurações do gráfico
    const data = {
        labels: nomes,
        datasets: [
            {
                label: 'Quantidade',
                data: quantidades,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8B008B', '#00BFFF'],
                borderWidth: 1,
            },
        ],
    };

    // Opções de exibição do gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
      };
        return <Bar data={data} options={options} />;
    }


};

export default MaterialChart;
