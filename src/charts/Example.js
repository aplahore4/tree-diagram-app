import { select, linkVertical, tree, hierarchy } from 'd3';
import React, { useEffect, useRef } from 'react';

function Example() {
  const svgRef = useRef(null);

  useEffect(() => {
    // Define the tree data structure
    const data = {
      name: 'Root',
      children: [
        {
          name: 'Child 1',
          children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }],
        },
        { name: 'Child 2' },
      ],
    };

    // Use D3 to create a new tree layout
    const treeLayout = tree()
      .size([400, 300]) // Set the size of the tree layout
      .nodeSize([50, 50]); // Set the size of each tree node

    // Use the tree layout to generate a tree structure from the data
    const treeData = hierarchy(data);

    // Use D3 to select the SVG element
    const svg = select(svgRef.current);

    // Use D3 to create a new group element for the tree links
    const linkGroup = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr(
        'd',
        linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    // Use D3 to create a new group element for the tree nodes
    const nodeGroup = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // Use D3 to append a circle element to each node group
    nodeGroup
      .append('circle')
      .attr('r', 10)
      .style('fill', 'white')
      .style('stroke', 'black');

    // Use D3 to append a text element to each node group
    nodeGroup
      .append('text')
      .text((d) => d.data.name)
      .style('font-size', '12px')
      .style('text-anchor', 'middle')
      .attr('y', 4);
  }, []);

  return <svg ref={svgRef} width='100' height='100' />;
}

export default Example;
