import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const FlowChart = ({ data, dimensions, showMore }) => {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const duration = 750,
    rectW = 60,
    rectH = 20;

  useEffect(() => {
    // Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements

    const zoom = d3.behavior.zoom();
    const svg = svgEl
      .call(zoom.on('zoom', redraw))
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let i = 0;

    const tree = d3.layout.tree().nodeSize([70, 40]);
    const diagonal = d3.svg.diagonal().projection(function (d) {
      return [d.x + rectW / 2, d.y + rectH / 2];
    });

    //necessary so that zoom knows where to zoom and un zoom from
    zoom.translate([margin.left, margin.top]);

    const root = data;
    root.x0 = 0;
    root.y0 = height / 2;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    root.children.forEach(collapse);
    update(root);
    function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        d.y = d.depth * 180;
      });

      // Update the nodes…
      var node = svg.selectAll('g.node').data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + source.x0 + ',' + source.y0 + ')';
        })
        .on('click', click);

      nodeEnter
        .append('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .style('stroke', 'gray')
        .attr('stroke-width', 1)
        .style('fill', function (d) {
          return d._children ? 'lightsteelblue' : '#fff';
        });

      const div = nodeEnter
        .append('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH)
        //.attr('x', (-1 * rectWidth) / 2)
        .append('xhtml:div')
        .attr('id', 'nod_div');

      div
        .append('xhtml:input')
        .attr('id', 'node_input')
        .style('text-align', 'center')
        // .style('vertical-align', 'middle')
        // .style('white-space', 'nowrap')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('width', rectW + 'px')
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
        .attr('id', 'node_text')
        .style('text-align', 'center')
        // .style('vertical-align', 'middle')
        // .style('white-space', 'nowrap')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('width', rectW + 'px')
        .style('display', 'inline-block')
        .style('font-size', '12px')
        .style('font-family', 'Calibri')
        .text(function (d) {
          return d.name;
        })
        .attr('title', function (d) {
          return d.name;
        });

      // nodeEnter
      //   .append('text')
      //   .attr('x', rectW / 2)
      //   .attr('y', rectH / 2)
      //   .attr('dy', '.35em')
      //   .attr('text-anchor', 'middle')
      //   .text(function (d) {
      //     return d.name;
      //   });

      // Transition nodes to their new position.
      var nodeUpdate = node
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });

      nodeUpdate
        .select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .style('stroke', 'gray')
        .attr('stroke-width', 1)
        .style('fill', function (d) {
          return d._children ? 'lightsteelblue' : '#fff';
        });

      nodeUpdate.select('text').style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + source.x + ',' + source.y + ')';
        })
        .remove();

      nodeExit
        .select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .style('stroke', 'gray')
        .attr('stroke-width', 1);

      nodeExit.select('text');

      // Update the links…
      var link = svg.selectAll('path.link').data(links, function (d) {
        return d.target.id;
      });

      // Enter any new links at the parent's previous position.
      link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('x', rectW / 2)
        .attr('y', rectH / 2)
        .attr('d', function (d) {
          var o = {
            x: source.x0,
            y: source.y0,
          };
          return diagonal({
            source: o,
            target: o,
          });
        });

      // Transition links to their new position.
      link.transition().duration(duration).attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          var o = {
            x: source.x,
            y: source.y,
          };
          return diagonal({
            source: o,
            target: o,
          });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    //Redraw for zoom
    function redraw() {
      svg.attr(
        'transform',
        'translate(' +
          d3.event.translate +
          ')' +
          ' scale(' +
          d3.event.scale +
          ')'
      );
    }
  }, [data, height, width, margin.left, margin.top, margin.bottom]); // Redraw chart if data changes

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default FlowChart;
