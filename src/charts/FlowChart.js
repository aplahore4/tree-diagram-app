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
    rectH = 100;

  useEffect(() => {
    // Create root container where we will append all other chart elements
    const svgEl = select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements

    const moreHandler = (d) => {
      alert('moreHandler');
    };

    const searchHandler = () => {
      alert('searchHandler');
    };

    const zoomBehavior = zoom();

    const svg = svgEl
      .call(zoomBehavior.on('zoom', redraw))
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeMapLayout = tree()
      .nodeSize([rectW, rectH])
      .size([width, height - rectH]);

    const root = hierarchy(data);

    const link_Vertical = linkVertical()
      .x((d) => {
        return d.x + rectW / 2;
      })
      .y((d) => {
        return d.y;
      });

    treeMapLayout(root);

    const parent_node_data = root.descendants().filter((node) => {
      return node.depth === 0;
    });
    const node_data = root.descendants().filter((node) => {
      return node.depth > 0;
    });

    const link = svg
      .selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', link_Vertical);

    const node = svg
      .selectAll('.node')
      .data(node_data)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return `translate(${d.x},${d.y})`;
      });

    const foreignObjectElement = node
      .append('foreignObject')
      .attr('width', rectW)
      .attr('height', rectH)
      .append('xhtml:div')
      .attr('class', 'nod_div')
      .style('border', '1px solid gray')
      .style('background', 'white');

    foreignObjectElement
      .append('xhtml:div')
      .text(function (d) {
        return d.data.name;
      })
      .style('margin', '10px');

    foreignObjectElement
      .append('xhtml:span')
      .text('more')
      .style('margin', 'margin:0 0 10px 10px')
      .style('border', '1px solid red')
      .style('cursor', 'pointer')
      .on('click', moreHandler);

    const parent_node = svg
      .selectAll('.parent_node')
      .data(parent_node_data)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return `translate(${d.x},${d.y})`;
      });

    const parent_foreignObjectElement = parent_node
      .append('foreignObject')
      .attr('width', rectW)
      .attr('height', rectH)
      .append('xhtml:div')
      .attr('class', 'nod_div')
      .style('border', '1px solid gray')
      .style('background', 'white');

    parent_foreignObjectElement
      .append('xhtml:input')
      .attr('type', 'text')
      .style('margin', '10px');

    parent_foreignObjectElement
      .append('xhtml:span')
      .text('search')
      .style('margin', 'margin:0 0 10px 10px')
      .style('border', '1px solid red')
      .style('cursor', 'pointer')
      .on('click', searchHandler);

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
