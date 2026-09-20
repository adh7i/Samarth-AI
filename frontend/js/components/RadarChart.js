/**
 * StatSamarth AI - RadarChart Component (Chart.js)
 */

window.RadarChart = function RadarChart({ competencies, userScores }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const labels = competencies.map(c => c.name.length > 20 ? c.name.substring(0, 18) + '…' : c.name);
    const currentData = competencies.map(c => userScores[c.id] || 1);
    const requiredData = competencies.map(c => c.required);

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Current Assessed Level',
            data: currentData,
            backgroundColor: 'rgba(59, 130, 246, 0.35)',
            borderColor: '#3B82F6',
            borderWidth: 2.5,
            pointBackgroundColor: '#3B82F6',
          },
          {
            label: 'Required FRAC Benchmark',
            data: requiredData,
            backgroundColor: 'rgba(15, 23, 42, 0.08)',
            borderColor: '#0F172A',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointBackgroundColor: '#0F172A',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, color: '#64748B', backdropColor: 'transparent' },
            grid: { color: '#E2E8F0' },
            pointLabels: { color: '#0F172A', font: { size: 10, weight: '600' } }
          }
        },
        plugins: {
          legend: { position: 'top', labels: { color: '#0F172A', font: { size: 11, weight: 'bold' } } }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [competencies, userScores]);

  return (
    <div className="h-[360px] relative w-full flex items-center justify-center">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
