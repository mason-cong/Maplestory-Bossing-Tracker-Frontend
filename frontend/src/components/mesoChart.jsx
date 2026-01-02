import Chart from "chart.js/auto";
import { Pie } from 'react-chartjs-2';

export default function MesoChart({
    userCharacters
}) {

    if (!userCharacters || userCharacters.length === 0) {
        return <div className="text-black justify-center">No characters to display</div>;
    }

    const charactersWithMesos = userCharacters.filter(char => char.weeklyMesos > 0);

    if (charactersWithMesos.length === 0) {
        return <div className="text-black text-center justify-center">No weekly mesos data available</div>;
    }

    const generateColors = (count) => {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#E7E9ED', '#8B5CF6',
            '#EC4899', '#10B981', '#F59E0B', '#6366F1'
        ];

        // If more characters than colors, generate additional colors
        while (colors.length < count) {
            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            colors.push(randomColor);
        }

        return colors.slice(0, count);
    };

    const labels = charactersWithMesos.map(character => character.characterName)
    const dataPoints = charactersWithMesos.map(character => character.characterMeso)

    const data = {
        labels,
        datasets: [{
            label: 'Weekly Mesos',
            data: dataPoints,
            backgroundColor: generateColors(userCharacters.length)
        }]
    }

    const totalMesos = charactersWithMesos.reduce((sum, char) => sum + char.characterMeso, 0);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 12
                    },
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const mesos = context.parsed;
                        const percentage = ((mesos / totalMesos) * 100).toFixed(1);
                        const formattedMesos = mesos.toLocaleString();
                        return `${context.label}: ${formattedMesos} mesos (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div>
            <Pie data={data}
            options={options} />
        </div>
    );

};