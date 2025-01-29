import Graph from "graphology";
import { useEffect, useRef, useState } from "react";
import Sigma, { Camera } from "sigma";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Visual() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<any>(null);

  const [sigmaState, setSigmaState] = useState<any>();

  async function onclickNodeHandler(id: string) {
    // seprate logic to handle click event for master node

    console.log("clicked", id);
    const response = await fetch(`http://localhost:3000/connections/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzkxYmQzZjNjOGViOTBlYTc3NTg0ZTYiLCJpYXQiOjE3MzgxNjkwMTR9.NsoyNkmdS48y46R_Faumao6FoB0W4Snkg69G8cgjLww",
      },
    });
    const data = await response.json();
    console.log(data.data);
    // update the graph state or not ?
    const graph = sigmaState.getGraph();
    // making new graph as new nodes were not updating on same graph

    // Refresh after removing nodes

    console.log("graph", graph);

    if (data) {
      data.data.nodes.forEach((node: any) => {
        console.log("node", node);
        if (!graph.hasNode(node.id)) {
          graph.addNode(node.id, {
            label: node.label,
            x: node.x,
            y: node.y,
            size: node.size,
            color: node.color,
            shape: "dot",
          });
        }
      });

      let nodeAttributes = null;
      //get all nodes

      const allNodes = graph.nodes();
      console.log("All Nodes:", allNodes);
      console.log(graph.hasNode(id));
      nodeAttributes = graph.getNodeAttributes(id);
      console.log("Node Attributes:", nodeAttributes);

      if (graph.hasNode(id)) {
        // Get the node attributes
        nodeAttributes = graph.getNodeAttributes(id);
        console.log("Node Attributes:", nodeAttributes);
      } else {
        console.log("Node not found");
      }

      // Adding edges
      if (nodeAttributes != null) {
        data.data.edges.forEach((edge: any) => {
          graph.addEdge(id, edge.target, { color: edge.color });
        });
      }
    }

    const edgesInfo: any = [];

    // Iterate over all edges
    graph.forEachEdge((edge: any, attributes: any) => {
      const source = graph.source(edge); // Get the source node ID
      const target = graph.target(edge); // Get the target node ID
      const edgeAttributes = graph.getEdgeAttributes(edge); // Get edge attributes

      // Push edge information to the array
      edgesInfo.push({
        id: edge,
        source: source,
        target: target,
        attributes: edgeAttributes,
      });
    });
    // Refresh the graph to apply changes
    // Log the information of all edges

    console.log("All Edges Information:", edgesInfo);
    if (graphRef.current != null) {
      sigmaState.kill();
      const sigmaInstance = new Sigma(graph, graphRef.current);
      setSigmaState(sigmaInstance);

      sigmaInstance.on("clickNode", (event: any) => {
        console.log("Node clicked:", event); // Log the clicked node for debugging
        const clickedNodeId = event?.node;
        console.log("clickedNodeId", clickedNodeId);
        onclickNodeHandler(clickedNodeId);

        if (!clickedNodeId) {
          console.error("No node clicked or invalid data structure");
          return;
        }
      });
      console.log("sigmaState", graph.size);
      console.log("order", graph.order);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://localhost:3000/connections?email=jp1@gmail.com",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzkxYmQzZjNjOGViOTBlYTc3NTg0ZTYiLCJpYXQiOjE3MzgxNjkwMTR9.NsoyNkmdS48y46R_Faumao6FoB0W4Snkg69G8cgjLww",
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      setGraphData(data.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (graphData != null) {
      const graph = new Graph();

      // Adding nodes

      graphData.nodes.forEach((node: any) => {
        graph.addNode(node.id, {
          label: node.label,
          x: node.x,
          y: node.y,
          size: node.size,
          color: node.color,
          shape: "dot",
        });
      });

      // Adding edges
      graphData.edges.forEach((edge: any) => {
        graph.addEdge(edge.source, edge.target, { color: edge.color });
      });

      // Ensure the graph is created correctly and set the state
      if (graphRef.current != null) {
        const sigmaInstance = new Sigma(graph, graphRef.current);

        const gr = sigmaInstance.getGraph();
        setSigmaState(sigmaInstance);

        // Initial filtering of edges based on neighbors count
        // gr.forEachEdge((edge) => {
        //   const source = gr.source(edge);
        //   const target = gr.target(edge);

        //   // Ensure the edge between the source node and the target node is visible
        //   if (
        //     source === target ||
        //     source === target ||
        //     gr.neighbors(source).length > 1 ||
        //     gr.neighbors(target).length > 1
        //   ) {
        //     gr.setEdgeAttribute(edge, "hidden", false); // Show edge if source or target has more than 1 neighbor
        //   } else {
        //     gr.setEdgeAttribute(edge, "hidden", true); // Hide edge if source and target have only 1 neighbor each
        //   }
        // });
        const Camera = sigmaInstance.getCamera();
        Camera.setState({ ratio: 1.5 });
        // Event listener for zoom or node interaction
        sigmaInstance.getCamera().on("updated", () => {
          const zoomRatio = sigmaInstance.getCamera().ratio;
          console.log("Zoom Ratio:", zoomRatio); // Log the zoom ratio for debugging

          // Camera.setState({ ratio: 1.5, x: 0, y: 0, angle: 0 });
          // Update visibility based on zoom ratio
          //   gr.forEachEdge((edge) => {
          //     const source = gr.source(edge);
          //     const target = gr.target(edge);

          //     if (zoomRatio < 0.5) {
          //       if (
          //         gr.neighbors(source).length <= 1 ||
          //         gr.neighbors(target).length <= 1
          //       ) {
          //         gr.setEdgeAttribute(edge, "hidden", false); // Show edge when zoomed in
          //       } else {
          //         gr.setEdgeAttribute(edge, "hidden", true); // Hide other edges when zoomed out
          //       }
          //     } else {
          //       // Show more connections when zoomed out
          //       if (
          //         gr.neighbors(source).length <= 1 ||
          //         gr.neighbors(target).length <= 1
          //       ) {
          //         gr.setEdgeAttribute(edge, "hidden", false); // Show edge
          //       } else {
          //         gr.setEdgeAttribute(edge, "hidden", true); // Hide edge
          //       }
          //     }
          //   });
          // });
        });
        // Event listener for node click to show related edges
        sigmaInstance.on("clickNode", (event: any) => {
          console.log("Node clicked:", event); // Log the clicked node for debugging
          const clickedNodeId = event?.node;
          console.log("clickedNodeId", clickedNodeId);
          onclickNodeHandler(clickedNodeId);

          if (!clickedNodeId) {
            console.error("No node clicked or invalid data structure");
            return;
          }
        });

        return () => {
          // Refresh the graph
          sigmaInstance.kill(); // Clean up to avoid duplicate instances
        };
      }
    }
  }, [graphData]);

  return (
    <>
      <Header />

      <div className=" bg-gray-300  w- h-screen" ref={graphRef} />
    </>
  );
}
