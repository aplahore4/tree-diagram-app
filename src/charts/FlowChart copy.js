import React, { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';

const FlowChart = ({ data, dimensions, showMore }) => {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const rectWidth = 80;
  const rectHeight = 40;

  const showMoreHandler = useCallback(
    (d) => {
      showMore(d);
    },
    [showMore]
  );

  useEffect(() => {
    // Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements
    const svg = svgEl
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let i = 0;

    const tree = d3.layout.tree().size([height, width]);

    const diagonal = d3.svg.diagonal().projection(function (d) {
      return [d.x, d.y];
      //return [d.x + rectWidth / 2, d.y + rectHeight / 2];
    });

    const root = data[0];

    // Compute the new tree layout.
    const nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 100;
    });

    // Declare the nodes¦
    const node = svg.selectAll('g.node').data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Enter the nodes.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    nodeEnter
      .append('rect')
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .attr('x', (-1 * rectWidth) / 2)
      .style('stroke', 'gray')
      .style('fill', '#fff');

    const div = nodeEnter
      .append('foreignObject')
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .attr('x', (-1 * rectWidth) / 2)
      .append('xhtml:div');

    div
      .append('xhtml:span')
      .style('text-align', 'center')
      // .style('vertical-align', 'middle')
      .style('white-space', 'nowrap')
      .style('overflow', 'hidden')
      .style('text-overflow', 'ellipsis')
      .style('width', rectWidth + 'px')
      .style('display', 'inline-block')
      .style('font-size', '12px')
      .style('font-family', 'Calibri')
      .text(function (d) {
        return d.name;
      })
      .attr('title', function (d) {
        return d.name;
      });

    div
      .append('xhtml:span')
      .style('text-align', 'center')
      // .style('vertical-align', 'middle')
      // .style('white-space', 'nowrap')
      .style('overflow', 'hidden')
      .style('text-overflow', 'ellipsis')
      .style('width', rectWidth + 'px')
      .style('display', 'inline-block')
      .style('font-size', '12px')
      .style('font-family', 'Calibri')
      .text('show more')
      .style('cursor', 'pointer')
      .on('click', showMoreHandler);

    // Declare the links¦
    const link = svg.selectAll('path.link').data(links, function (d) {
      return d.target.id;
    });

    // Enter the links.
    //link.enter().insert('path', 'g').attr('class', 'link').attr('d', diagonal);
    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('x', rectWidth / 2)
      .attr('y', rectHeight / 2)
      .attr('d', diagonal);
  }, [
    data,
    height,
    width,
    margin.left,
    margin.top,
    margin.bottom,
    showMoreHandler,
  ]); // Redraw chart if data changes

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default FlowChart;
