import React, { useRef, useEffect } from 'react';
import { select, zoom, tree, hierarchy, linkVertical } from 'd3';

const FlowChart = ({ dimensions, getMoreData }) => {
  const data = {
    name: 'A',
    children: [
      {
        name: 'B',
        children: [{ name: 'D' }, { name: 'E' }],
      },
      { name: 'C' },
    ],
  };
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const duration = 750,
    rectW = 190,
    rectH = 150;

  useEffect(() => {
    // Create root container where we will append all other chart elements
    const svgEl = select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements

    const moreHandler = (d) => {
      getMoreData(d);
    };

    const searchHandler = () => {
      alert('searchHandler');
    };

    const zoomBehavior = zoom();
    const svg = svgEl
      .call(zoomBehavior.on('zoom', redraw))
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // zoom.translate([margin.left, margin.top]);

    const treemapLayout = tree()
      .nodeSize([rectW, rectH])
      .size([width, height / 2]);

    const root = hierarchy(data);

    treemapLayout(root);

    const link = svg
      .selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr(
        'd',
        linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    const node = svg
      .selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', '1.5px');

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.children ? -6 : 6))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => d.data.name);

    //Redraw for zoom
    function redraw(event) {
      const translate = event.transform.x + ',' + event.transform.y;
      const scale = event.transform.k;
      svg.attr(
        'transform',
        'translate(' + translate + ') scale(' + scale + ')'
      );
    }
  }, [data, height, width, margin.left, margin.top, margin.bottom]); // Redraw chart if data changes

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default FlowChart;
