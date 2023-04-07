import React, { useRef, useEffect } from 'react';
import { select, zoom, tree, hierarchy, linkVertical, cluster } from 'd3';

const FlowChart = ({ data, dimensions, getMoreData, getSearchData }) => {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const duration = 750,
    rectW = 100,
    rectH = 100;

  useEffect(() => {
    // Create root container where we will append all other chart elements
    const svgEl = select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements

    const moreHandler = (d) => {
      getMoreData(d);
    };

    const searchHandler = (d) => {
      getSearchData(d);
    };

    const zoomBehavior = zoom();

    const svg = svgEl
      .call(zoomBehavior.on('zoom', redraw))
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeMapLayout = tree()
      .nodeSize([rectW, rectH])
      .size([width, height - rectH])
      .separation(function separation(a, b) {
        return 1 / 100000000;
      });

    const root = hierarchy(data);

    const link_Vertical = linkVertical()
      .x((d) => {
        return d.x;
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
        return `translate(${d.x - rectW / 2},${d.y})`;
      });

    const foreignObjectElement = node
      .append('foreignObject')
      .attr('width', rectW)
      .attr('height', rectH)
      .append('xhtml:div')
      .attr('class', 'nod_div')
      .style('border', '1px solid #800080')
      .style('background', 'white')
      .style('font-size', '12px')
      .style('font-family', 'Calibri');

    foreignObjectElement
      .append('xhtml:div')
      .text(function (d) {
        return d.data.name;
      })
      .style('margin', '0px');

    foreignObjectElement
      .append('xhtml:span')
      .text('Show More')
      .style('padding', '1px')
      // .style('float', 'right')
      .style('border', '1px solid #800080')
      .style('cursor', 'pointer')
      .attr('data', function (d) {
        return d.data.id;
        // return JSON.stringify({ ...d.data, depth: d.depth });
      })
      .on('click', function () {
        moreHandler(select(this).attr('data'));
        // moreHandler(JSON.parse(select(this).attr('data')));
      });

    const parent_node = svg
      .selectAll('.parent_node')
      .data(parent_node_data)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return `translate(${d.x - rectW / 2},${d.y})`;
      });

    const parent_foreignObjectElement = parent_node
      .append('foreignObject')
      .attr('width', rectW)
      .attr('height', rectH)
      .append('xhtml:div')
      .attr('class', 'nod_div')
      .style('border', '1px solid #800080')
      .style('background', 'white')
      .style('font-size', '12px')
      .style('font-family', 'Calibri');

    parent_foreignObjectElement
      .append('xhtml:input')
      .attr('type', 'text')
      .attr('placeholder', 'Search stuffs')
      .style('width', '80px')
      .style('margin', '5px')
      .style('padding', '2px')
      .style('font-size', '12px')
      .style('font-family', 'Calibri');

    parent_foreignObjectElement
      .append('xhtml:span')
      .text('Search')
      .style('margin', '0 0 5px 5px')
      .style('padding', '1px')
      .style('border', '1px solid #800080')
      .style('cursor', 'pointer')
      .attr('data', function (d) {
        return d.data.id;
        // return JSON.stringify({ ...d.data, depth: d.depth });
      })
      .on('click', function () {
        searchHandler(select(this).attr('data'));
        //searchHandler(JSON.parse(select(this).attr('data')));
      });

    //Redraw for zoom
    function redraw(event) {
      const translate = event.transform.x + ',' + event.transform.y;
      const scale = event.transform.k;
      svg.attr(
        'transform',
        'translate(' + translate + ') scale(' + scale + ')'
      );
    }
  }, [
    data,
    height,
    width,
    margin.left,
    margin.top,
    margin.bottom,
    getMoreData,
    getSearchData,
  ]); // Redraw chart if data changes

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default FlowChart;
