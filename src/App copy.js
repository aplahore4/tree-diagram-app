import { useState } from 'react';
import FlowChart from './charts/FlowChart';
import flowChartData from './data';

const dimensions = {
  width: 800,
  height: 960,
  margin: { top: 20, right: 120, bottom: 20, left: 120 },
};

const root = { name: 'search stuff', parent: null };

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

const flatData_initial = apiResponse.map((d) => {
  return { name: d.activity_name, parent: root.name, ...d };
});

flatData_initial.push(root);

const constructData = (data) => {
  const dataMap = data.reduce(function (map, node) {
    map[node.name] = node;
    return map;
  }, {});

  let treeData = [];
  data.forEach(function (node) {
    // add to parent
    var parent = dataMap[node.parent];
    if (parent) {
      // create child array if it doesn't exist
      (parent.children || (parent.children = []))
        // add node to child array
        .push(node);
    } else {
      // parent is null or missing
      treeData.push(node);
    }
  });
  debugger;
  return treeData;
};
//let treeData = constructData(flatData_initial);
var convertedChartData = [
  {
    name: 'search stuff',
    parent: 'null',
    children: [
      {
        name: 'Go-Karting',
        parent: 'search stuff',
        children: [
          {
            name: 'Virtual Reality Games',
            parent: 'Go-Karting',
          },
          {
            name: 'Pottery Making',
            parent: 'Go-Karting',
          },
        ],
      },
      {
        name: 'Virtual Reality',
        parent: 'search stuff',
        children: [
          {
            name: 'Virtual Reality',
            parent: 'Go-Karting',
          },
          {
            name: 'Virtual Reality',
            parent: 'Go-Karting',
          },
        ],
      },
    ],
  },
];
function App() {
  const [chartData, setChartData] = useState(treeData);
  const [flatData, setflatData] = useState(
    JSON.parse(JSON.stringify(flatData_initial))
  );

  const showMoreHandler = (selected) => {
    debugger;
    console.log('chartData->', chartData);
    console.log('treeData->', treeData);
    console.log('flatData', flatData);
    const moreData = apiResponse.map((d) => {
      return { name: d.activity_name, parent: selected.name, ...d };
    });
    const oldData = flatData.map((d) => {
      return {
        activity_name: d.activity_name,
        short_description: d.short_description,
        location: d.location,
        search_keywords: d.search_keywords,
        name: d.name,
        parent: d.parent,
      };
    });
    const newFlatData = [...moreData, ...oldData];
    setflatData(newFlatData);
    setChartData(constructData(newFlatData));
  };
  return (
    <div className='App'>
      <FlowChart
        dimensions={dimensions}
        data={flowChartData}
        showMore={showMoreHandler}
      />
    </div>
  );
}

export default App;
