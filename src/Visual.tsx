import Graph from "graphology";
import {  useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import Header from "./components/Header";
import Filter from "./components/Filter";
import Wrapper from "./components/Wrapper";
import { connectionUrl } from "./utils/connectionUrl";

interface GraphData {
  nodes: Array<{ id: string; label: string; }>;
  edges: Array<{ source: string; target: string; }>;
}


export default function Visual() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>();

  const [sigmaState, setSigmaState] = useState<any>();
  const [filter, setFilter] = useState< { Name: string, Email: string}>({ Name: "", Email: "" });
  
  // async function onclickNodeHandler(id: string) {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/v1/connection/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch connections');
  //     }

  //     const { data: { edges, nodes } } = await response.json();
  //     console.log(edges);
  //     if (sigmaState) {
  //       const graph = sigmaState.getGraph();
        
  //       // Add new nodes
  //       nodes.forEach((node: any) => {
  //         if (!graph.hasNode(node.id) && node.label !== "Me") {
  //           graph.addNode(node.id, {
  //             label: node.label,
  //             x: Math.random() * 10,
  //             y: Math.random() * 10,
  //             size: node.size || 10,
  //             color: node.color || "#E57373",
  //             shape: "circle",
  //           });
  //         }
  //       });

  //       // Add new edges
  //       edges.forEach((edge: any) => {
  //         // Check both directions for the edge
  //         const edgeExists = 
  //           graph.hasEdge(edge.source, edge.target) || 
  //           graph.hasEdge(edge.target, edge.source);
          
  //         if (!edgeExists) {
  //           graph.addEdge(edge.source, edge.target, {
  //             type: "line",
  //             label: edge.label,
  //             size: edge.size || 2,
  //             color: edge.color || "#999"
  //           });
  //         }
  //       });

 

  //     }


  //   } catch (error) {
  //     console.error('Error fetching node connections:', error);
  //   }
  // }


  async function onclickNodeHandler(id: string) {
    console.log(id);
    try {
      const response = await fetch(`${connectionUrl}/api/v1/connection/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch connections');
      }

      const { data: { edges, nodes } } = await response.json();

      setGraphData((prevData: GraphData | undefined) => {
        if (!prevData) {
          return {
            edges: edges,
            nodes: nodes
          };
        }

        // Create Sets for faster lookup
        const existingEdgeSet = new Set(
          prevData.edges.map((e: any) => `${e.source}-${e.target}`)
        );

        const existingNodeSet = new Set(
          prevData.nodes.map((n: any) => n.id)
        );

        // Filter new edges and nodes
        const newEdges = edges.filter((edge: any) => {
          const forwardKey = `${edge.source}-${edge.target}`;
          const reverseKey = `${edge.target}-${edge.source}`;
          return !existingEdgeSet.has(forwardKey) && !existingEdgeSet.has(reverseKey);
        });

        const newNodes = nodes.filter((node: any) => 
          node.label !== "Me" && !existingNodeSet.has(node.id)
        );

        return {
          edges: [...prevData.edges, ...newEdges],
          nodes: [...prevData.nodes, ...newNodes]
        };
      });

      

    } catch (error) {
      console.error('Error fetching node connections:', error);
    }
  }



    async function fetchData() {
      console.log(localStorage.getItem("token"));
        const response = await fetch(`${connectionUrl}/api/v1/search?name=` + filter.Name + "&email=" + filter.Email, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data.data);
      setGraphData(data.data);
    }
  

  
  useEffect(() => {
    async function fetchData() {
      console.log(localStorage.getItem("token"));
          const response = await fetch(`${connectionUrl}/api/v1/connections`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      
      setGraphData(data.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (sigmaState) {
        setSigmaState(null);
        
        sigmaState.kill();
        
      }
    };
  }, []);

  useEffect(() => {
    if (!graphData || !graphRef.current) return;

    try {
      const graph = new Graph();

      // Add nodes
      graphData.nodes.forEach((node: any) => {
        if (!graph.hasNode(node.id)) {
          graph.addNode(node.id, {
            label: node.label,
            x: Math.random() * 10,  // Randomize position
            y: Math.random() * 10,
            size: node.size || 10,
            color: node.color || "#E57373",
            shape: "circle",
          });
        }
      });

      // Add edges
      graphData.edges.forEach((edge: any) => {
        if (!graph.hasEdge(edge.source, edge.target)) {
          graph.addEdge(edge.source, edge.target, {
            type: "line",
            label: edge.label,
            size: edge.size || 2,
            color: edge.color || "#999"
          });
        }
      });

      const sigmaInstance = new Sigma(graph, graphRef.current, {
        renderEdgeLabels: true,
      });

      setSigmaState(sigmaInstance);

      // Event listeners
      sigmaInstance.on("clickNode", (event: any) => {
        const clickedNodeId = event?.node;
        if (clickedNodeId) {
          onclickNodeHandler(clickedNodeId);
        }
     
      });
      
      // sigmaInstance.on("enterNode", (event: any) => {
      //   console.log("enterNode event triggered:", event);
      //   const hoveredNodeId = event?.node;
      //   if (hoveredNodeId && sigmaInstance) {
      //     console.log("hoveredNodeId:", hoveredNodeId);
      //     setHoveredNode(hoveredNodeId);
      //   }
      //   sigmaInstance.refresh();
      // });

          
      // sigmaInstance.on("leaveNode", (event: any) => {
      //   console.log("leaving node event triggered:", event);
      //   const hoveredNodeId = event?.node;
      //   if (hoveredNodeId && sigmaInstance) {
      //     console.log("hoveredNodeId:", hoveredNodeId);
      //     setHoveredNode(null);
      //   }
      //   sigmaInstance.refresh();
      // });

    
      
      return () => {
        console.log("killing sigma instance");
        sigmaInstance.kill();
      };
    } catch (error) {
      console.error("Error creating graph:", error);
    }
  }, [graphData]);

 

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {localStorage.getItem("token") ? (
        <div className="flex flex-col md:flex-row flex-1">
          <div className="w-full md:w-64 lg:w-72 bg-white shadow-md z-10">
            <Filter setFilter={setFilter} />
          </div>
          
          <div className="flex-1 relative bg-gray-100">
            <div 
              ref={graphRef} 
              className="w-full h-[calc(100vh-64px)] md:h-screen"
            />
          </div>
        </div>
      ) : (
        <Wrapper />
      )}
    </div>
  );
}
