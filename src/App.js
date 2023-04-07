import { useEffect, useState } from 'react';
import FlowChart from './charts/FlowChart';

const dataset = {
  name: 'Root',
};

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

function deepObjectSearchAndModify(obj, searchValue, modifyValue) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      deepObjectSearchAndModify(obj[key], searchValue, modifyValue);
    } else if (obj[key] === searchValue) {
      obj['children'] = modifyValue;
    }
  }
  return obj;
}

function App() {
  //////////////////////////////////////////////
  const [data, setData] = useState(null);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  useEffect(() => {
    setData(dataset);
  }, []);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);

  const getMoreData = (d) => {
    debugger;
    const modifyValue = [1, 2, 3].map((child, index) => {
      //return { name: `level_${d.depth + 1}_${index + 1}-Child_1` };
      return { name: Date.now().toString(36) + index };
    });
    const newData = deepObjectSearchAndModify(data, d, modifyValue);
    setData({ ...newData });
  };

  const getSearchData = (d) => {
    debugger;
    const newData = {
      ...data,
      children: [1, 2, 3].map((child, index) => {
        //return { name: `level_${d.depth + 1}_${index + 1}-Child_1` };
        return { name: Date.now().toString(36) + index };
      }),
    };
    setData(newData);
  };

  if (data === null) return <></>;

  return (
    <div className='App'>
      <FlowChart
        dimensions={screenSize}
        data={data}
        getMoreData={getMoreData}
        getSearchData={getSearchData}
      />
    </div>
  );
}

export default App;
