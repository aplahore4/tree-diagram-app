import FlowChart from './charts/FlowChart';
import flowChartData from './data';

const dimensions = {
  width: 960,
  height: 800,
  margin: { top: 20, right: 120, bottom: 20, left: 350 },
};

function App() {
  return (
    <div className='App'>
      <FlowChart dimensions={dimensions} data={flowChartData} />
    </div>
  );
}

export default App;
