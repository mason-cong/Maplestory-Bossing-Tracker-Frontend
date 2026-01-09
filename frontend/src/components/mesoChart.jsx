import Chart from "chart.js/auto";
import { Pie } from 'react-chartjs-2';

export default function MesoChart({
    userCharacters
}) {
    if (!userCharacters || userCharacters.length === 0) {
        return <div className="text-black justify-center">No characters to display</div>;
    }

    const charactersWithMesos = userCharacters.filter(char => char.characterMeso > 0);

    const totalMesos = charactersWithMesos.reduce((sum, char) => sum + char.characterMeso, 0);

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

    const labels = charactersWithMesos.map(character => character.characterName + ": " + character.characterClass);
    const dataPoints = charactersWithMesos.map(character => character.characterMeso);

    const data = {
        labels,
        datasets: [{
            label: 'Weekly Mesos',
            data: dataPoints,
            backgroundColor: generateColors(userCharacters.length)
        }]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const mesos = context.parsed;
                        const percentage = ((mesos / totalMesos) * 100).toFixed(1);
                        const formattedMesos = mesos.toLocaleString();
                        return `Weekly Mesos: ${formattedMesos} mesos (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      {/* Pie Chart */}
      <div className="w-80 h-80 flex-shrink-0">
        <Pie data={data} options={options} />
      </div>

      {/* Custom Legend and Total */}
      <div className="flex flex-col gap-4">
        {/* Total Mesos Display */}
        <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Weekly Mesos</h3>
          <p className="text-3xl font-bold text-orange-600">
            {totalMesos.toLocaleString()}
          </p>
        </div>

        {/* Custom Legend List */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Characters</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {charactersWithMesos.map((char, index) => {
              const percentage = ((char.characterMeso / totalMesos) * 100).toFixed(1);
              const backgroundColor = data.datasets[0].backgroundColor[index];
              
              return (
                <div key={char.id} className="flex items-center gap-3">
                  {/* Color Box */}
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor }}
                  ></div>
                  
                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {char.characterName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {char.characterMeso.toLocaleString()} ({percentage}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
