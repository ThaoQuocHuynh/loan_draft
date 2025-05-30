"use client"

import { Background, Controls, MarkerType, MiniMap, Node, NodeMouseHandler, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { useMemo } from "react";
import { useWorkflow } from "./workflow-context";
import WorkflowNode from "./workflow-node";

const nodeTypes = {
  workflowStep: WorkflowNode,
}

export default function WorkflowCanvas() {
  const { steps, connections, selectStep } = useWorkflow()

  // Convert steps to ReactFlow nodes
  const initialNodes = useMemo(
    () =>
      steps.map((step, index) => ({
        id: step.id,
        type: "workflowStep",
        position: {
          x: step.id === "start" ? 250 : step.id === "end" ? 250 : 250 + index * 50,
          y: step.id === "start" ? 50 : step.id === "end" ? 500 : 150 + index * 100,
        },
        data: { ...step },
      })),
    [steps],
  )

  // Convert connections to ReactFlow edges
  const initialEdges = useMemo(
    () =>
      connections.map((connection) => ({
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      })),
    [connections],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes and edges when steps or connections change
  useMemo(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [steps, connections, initialNodes, initialEdges, setNodes, setEdges])

  const onNodeClick: NodeMouseHandler = (_, node: Node) => {
    selectStep(node.id)
  }

  const onPaneClick = () => {
    selectStep(null)
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
