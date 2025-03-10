import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const KNNGraphVisualizer = ({ data, k = 5, zoom = 1 }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [debugInfo, setDebugInfo] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add resize handler to make the visualization responsive
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Increase the height proportionally or set a larger fixed height
        setDimensions({
          width: width,
          height: Math.min(window.innerHeight * 0.9, 800) // 90% of viewport height or max 800px
        });
      }
    };

    // Initial dimensions
    updateDimensions();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!data || !data.length || dimensions.width === 0) {
      setDebugInfo({ error: "No data available or container not sized yet" });
      return;
    }

    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const width = dimensions.width;
    const height = dimensions.height;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create a container group for zooming
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 5])  // Allow zoom from 0.1x to 5x
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setDebugInfo(prev => ({
          ...prev,
          currentZoom: event.transform.k.toFixed(2),
          translateX: event.transform.x.toFixed(0),
          translateY: event.transform.y.toFixed(0)
        }));
      });

    // Apply zoom behavior to SVG
    svg.call(zoomBehavior);
    
    // Set initial zoom level from props
    svg.call(zoomBehavior.transform, 
      d3.zoomIdentity
        .translate(margin.left, margin.top)
        .scale(zoom));

    // Remove the node limit
    const limitedData = data; // Use all data points
    
    setDebugInfo({
      totalDataPoints: data.length,
      displayingDataPoints: limitedData.length,
      k: k,
      zoom: zoom
    });

    // Create nodes for each data point in our dataset
    const nodes = limitedData.map((item, index) => ({
      id: index,
      name: `Node ${index}`,
      originalId: item[0] // Store the original ID for reference
    }));

    // Create links based on KNN rankings
    const links = [];
    limitedData.forEach((rankings, sourceIndex) => {
      // Skip if rankings is not an array or doesn't have enough elements
      if (!Array.isArray(rankings) || rankings.length <= 1) return;
      
      // Connect to k nearest neighbors (or fewer if not enough rankings)
      for (let i = 1; i <= Math.min(k, rankings.length - 1); i++) {
        // Find the target node index in our dataset
        const targetOriginalId = rankings[i];
        const targetIndex = limitedData.findIndex(item => item[0] === targetOriginalId);
        
        // Only create the link if the target is in our dataset
        if (targetIndex !== -1) {
          links.push({
            source: sourceIndex,
            target: targetIndex,
            value: 1 / (i + 1) // Strength based on rank
          });
        }
      }
    });

    // Add debug info
    setDebugInfo(prev => ({
      ...prev,
      nodesCreated: nodes.length,
      linksCreated: links.length
    }));

    // Set up force simulation with increased clustering parameters
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100)) // Even shorter distance for tighter clusters
      .force("charge", d3.forceManyBody().strength(-2000)) // Much stronger repulsion
      .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2).strength(0.4)) // Increased centering force
      .force("collision", d3.forceCollide().radius(35)) // Increased collision radius
      .stop(); // Stop the simulation immediately

    // Run the simulation for a fixed number of iterations
    simulation.tick(200); // Increased number of ticks for better settling

    // Draw links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 3) // Thicker lines
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6);

    // Draw nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g");

    node.append("circle")
      .attr("r", 10)
      .attr("fill", "#69b3a2")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("mouseover", (event, d) => {
        setHoveredNode(d);
      })
      .on("mouseout", () => {
        setHoveredNode(null);
      });

    node.append("text")
      .text(d => d.name)
      .attr("x", 12)
      .attr("y", 3);

    // Add titles for nodes
    node.append("title")
      .text(d => `Node ${d.id} (Original ID: ${d.originalId})`);

    // Set initial positions
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [data, k, zoom, dimensions]);

  // Format the image filename with padded zeros
  const getImagePath = (nodeId) => {
    if (!nodeId && nodeId !== 0) return null;
    // Pad the ID to 4 digits, adding 1 to fix the offset issue
    const adjustedId = nodeId + 1;
    const paddedId = String(adjustedId).padStart(4, '0');
    return `/jpg/image_${paddedId}.jpg`;
  };

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div
      className="knn-graph-container"
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '10px',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? '0' : 'auto',
        left: isFullscreen ? '0' : 'auto',
        zIndex: isFullscreen ? 1000 : 'auto',
        backgroundColor: isFullscreen ? 'white' : 'transparent',
      }}
    >
      <h2>KNN Graph Visualization (k={k})</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden', position: 'relative', height: '100%' }}>
        <svg ref={svgRef}></svg>
        
        {/* Image preview on hover */}
        {hoveredNode && (
          <div 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'white',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
          >
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
              Node {hoveredNode.id} (Original ID: {hoveredNode.originalId})
            </p>
            <img 
              src={getImagePath(hoveredNode.originalId)} 
              alt={`Image ${hoveredNode.originalId}`}
              style={{ maxWidth: '200px', maxHeight: '200px', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png'; // Fallback image
                e.target.alt = 'Image not found';
              }}
            />
          </div>
        )}

        {/* Fullscreen toggle */}
        <button onClick={toggleFullscreen} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)'
        }}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
};

export default KNNGraphVisualizer;