import { useEffect, useState } from 'react';
import FlowChart from './charts/FlowChart';
import flowChartData from './data';

function getCurrentDimension() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    margin: { top: 0, right: 0, bottom: 0, left: window.innerWidth / 2 },
  };
}

function App() {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);
  return (
    <div className='App'>
      <FlowChart dimensions={screenSize} data={flowChartData} />
    </div>
  );
}

export default App;
