import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const FlowChart = ({ data, dimensions, getMoreData }) => {
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const duration = 750,
    rectW = 190,
    rectH = 150;

  useEffect(() => {
    // Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements

    const moreHandler = (d) => {
      getMoreData(d);
    };

    const searchHandler = () => {
      alert('searchHandler');
    };

    const zoom = d3.behavior.zoom();
    const svg = svgEl
      .call(zoom.on('zoom', redraw))
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let i = 0;

    const tree = d3.layout.tree().nodeSize([rectW + 5, rectH]);
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

    //root.children.forEach(collapse);
    update(root);
    function update(source) {
      // Compute the new tree layout.
      const nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        d.y = d.depth * 180;
      });

      // Update the nodes…
      const node = svg.selectAll('g.node').data(
        nodes.filter((node) => {
          return node.depth > 0;
        }),
        function (d) {
          return d.id || (d.id = ++i);
        }
      );

      const parent_node = svg.selectAll('g.node').data(
        nodes.filter((node) => {
          return node.depth === 0;
        }),
        function (d) {
          return d.id || (d.id = ++i);
        }
      );

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + (+d.y + rectH / 2) + ')';
        });

      const parent_nodeEnter = parent_node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + +d.y + ')';
        });

      const foreignObjectElement = nodeEnter
        .append('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH)
        .append('xhtml:div')
        .attr('class', 'nod_div')
        //.style('width', rectW - 1 + 'px')
        //.style('height', rectH - 1 + 'px')
        .style('border', '1px solid gray');
      // .html(function (d) {
      //   if (d._children) {
      //     return `
      //       <p>
      //         ${d.name}
      //         </p>
      //         <input
      //           type='button'
      //           style='margin:0 0 10px 10px'
      //           value='more'
      //         />`;
      //   } else {
      //     return `
      //     <div>
      //       <input type='text' style='margin:10px' />
      //       <div style='margin:0 0 10px 10px;border:1px solid red' onclick='${moreHandler}'>search</div>
      //     </div>`;
      //   }
      // });

      const parent_foreignObjectElement = parent_nodeEnter
        .append('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH)
        .append('xhtml:div')
        .attr('class', 'nod_div')
        .style('border', '1px solid gray');

      foreignObjectElement
        .append('xhtml:div')
        .text(function (d) {
          return d.name;
        })
        .style('margin', '10px');

      foreignObjectElement
        .append('xhtml:span')
        .text('more')
        .style('margin', 'margin:0 0 10px 10px')
        .style('border', '1px solid red')
        .on('click', moreHandler);

      parent_foreignObjectElement
        .append('xhtml:input')
        .attr('type', 'text')
        .style('margin', '10px');

      parent_foreignObjectElement
        .append('xhtml:span')
        .text('search')
        .style('margin', 'margin:0 0 10px 10px')
        .style('border', '1px solid red')
        .on('click', searchHandler);

      // Transition nodes to their new position.
      const nodeUpdate = node
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + (+d.y + rectH / 2) + ')';
        });

      // Transition nodes to their new position.
      const parent_nodeUpdate = parent_node
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + +d.y + ')';
        });

      nodeUpdate
        .select('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH);

      parent_nodeUpdate
        .select('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + (+d.y + rectH / 2) + ')';
        })
        .remove();

      // Transition exiting nodes to the parent's new position.
      const parent_nodeExit = parent_node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + +d.y + ')';
        })
        .remove();

      nodeExit
        .select('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH);

      parent_nodeExit
        .select('foreignObject')
        .attr('width', rectW)
        .attr('height', rectH);

      // Update the links…
      const link = svg.selectAll('path.link').data(links, function (d) {
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
          const o = {
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
          const o = {
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
