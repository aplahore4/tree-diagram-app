import { useEffect, useState } from 'react';
import FlowChart from './charts/FlowChart';
import flowChartData from './data';
import Example from './charts/Example';

function getCurrentDimension() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
}
const apiResponse = [
  {
    activity_name: 'Go-Karting',
    short_description:
      'Grab your friends, buckle up and race around the track as you battle it out to see who takes the checkered flag!',
    location: 'Landon',
    search_keywords: 'Go-Karting, Racing, Thrill',
  },
  {
    activity_name: 'Virtual Reality Games',
    short_description:
      'Experience the newest virtual reality games and explore a new world, from the comfort of your own home!',
    location: 'Landon',
    search_keywords: 'Virtual Reality, VR Games, Immersive Experience',
  },
  {
    activity_name: 'Pottery Making',
    short_description:
      'Unleash your creativity and learn the ancient art of pottery making. Create your own unique pottery pieces and take them home as souvenirs.',
    location: 'Landon',
    search_keywords: 'Pottery Making, DIY, Arts & Crafts',
  },
];

const children = apiResponse.map((d) => {
  return { name: d.activity_name, ...d };
});

const chartAPIData = {
  name: 'root',
  children: children,
};

function findNode(data, key, value, newPropertyKey, newPropertyValue) {
  if (data[key] === value) {
    data[newPropertyKey] = JSON.parse(JSON.stringify(newPropertyValue));
  } else if (data.children) {
    for (var i = 0; i < data.children.length; i++) {
      findNode(data.children[i], key, value, newPropertyKey, newPropertyValue);
    }
  }
  return data;
}

function App() {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [chartData, setChartData] = useState(chartAPIData);
  // const [orgChartData, setOrgChartData] = useState();

  const getMoreData = (d) => {
    debugger;
    console.log('chartData', chartData);
    // console.log('orgChartData', orgChartData);
    const newData = findNode(chartData, 'name', d.name, 'children', children);
    // setOrgChartData(JSON.parse(JSON.stringify(orgChartData)));
    setChartData({ ...newData });
  };

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    // setOrgChartData(JSON.parse(JSON.stringify(chartAPIData)));
  }, []);

  return (
    <div className='App'>
      {/* <Example /> */}
      <FlowChart
        dimensions={screenSize}
        data={JSON.parse(JSON.stringify(chartData))}
        getMoreData={getMoreData}
      />
    </div>
  );
}

export default App;
