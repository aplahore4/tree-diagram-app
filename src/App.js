import { useCallback, useEffect, useState } from 'react';
import FlowChart from './charts/FlowChart';

const dataset = {
  name: 'Root',
  id: Date.now().toString(36) + '0',
};

function getCurrentDimension() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
}
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

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        'https://react-39886-default-rtdb.asia-southeast1.firebasedatabase.app/treeMap.json'
      );
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMoreData = async (d) => {
    // debugger;
    const result = await fetchData();
    const modifyValue = result.map((child, index) => {
      //return { name: `level_${d.depth + 1}_${index + 1}-Child_1` };
      return {
        id: Date.now().toString(36) + index,
        name: child.activity_name,
      };
    });
    const newData = deepObjectSearchAndModify(data, d, modifyValue);
    setData({ ...newData });
  };

  const getSearchData = async (d) => {
    // debugger;
    const result = await fetchData();
    const newData = {
      ...data,
      children: result.map((child, index) => {
        //return { name: `level_${d.depth + 1}_${index + 1}-Child_1` };
        return {
          id: Date.now().toString(36) + index,
          name: child.activity_name,
        };
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
