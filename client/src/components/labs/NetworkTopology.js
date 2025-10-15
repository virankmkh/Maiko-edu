import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const NetworkTopology = ({ 
  devices, 
  selectedDevice, 
  onDeviceSelect, 
  getDeviceIcon 
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate nodes and edges from devices
  const generateTopology = useCallback(() => {
    if (!devices) return { nodes: [], edges: [] };

    const deviceNodes = Object.entries(devices).map(([deviceId, device], index) => {
      const position = calculateNodePosition(index, Object.keys(devices).length);
      
      return {
        id: deviceId,
        type: 'deviceNode',
        position,
        data: {
          label: deviceId,
          deviceType: device.type,
          device: device,
          isSelected: selectedDevice === deviceId,
          onSelect: () => onDeviceSelect(deviceId)
        },
        style: {
          background: selectedDevice === deviceId ? '#3B82F6' : '#F3F4F6',
          color: selectedDevice === deviceId ? '#FFFFFF' : '#374151',
          border: selectedDevice === deviceId ? '2px solid #1D4ED8' : '1px solid #D1D5DB',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '120px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        },
      };
    });

    // Generate connections between devices
    const deviceEdges = [];
    const deviceList = Object.entries(devices);
    
    for (let i = 0; i < deviceList.length; i++) {
      for (let j = i + 1; j < deviceList.length; j++) {
        const [deviceId1, device1] = deviceList[i];
        const [deviceId2, device2] = deviceList[j];
        
        // Simple connection logic - connect routers to switches, switches to servers
        if (shouldConnect(device1.type, device2.type)) {
          deviceEdges.push({
            id: `${deviceId1}-${deviceId2}`,
            source: deviceId1,
            target: deviceId2,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#6B7280',
            },
            style: {
              stroke: '#6B7280',
              strokeWidth: 2,
            },
          });
        }
      }
    }

    return { nodes: deviceNodes, edges: deviceEdges };
  }, [devices, selectedDevice, onDeviceSelect]);

  // Calculate node position in a grid layout
  const calculateNodePosition = (index, totalDevices) => {
    const cols = Math.ceil(Math.sqrt(totalDevices));
    const rows = Math.ceil(totalDevices / cols);
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const spacing = 200;
    const startX = -((cols - 1) * spacing) / 2;
    const startY = -((rows - 1) * spacing) / 2;
    
    return {
      x: startX + col * spacing,
      y: startY + row * spacing
    };
  };

  // Determine if two devices should be connected
  const shouldConnect = (type1, type2) => {
    const type1Lower = type1?.toLowerCase() || '';
    const type2Lower = type2?.toLowerCase() || '';
    
    // Router to Switch
    if ((type1Lower.includes('router') || type1Lower.includes('ios')) && 
        (type2Lower.includes('switch') || type2Lower.includes('iosv'))) {
      return true;
    }
    
    // Switch to Server
    if ((type1Lower.includes('switch') || type1Lower.includes('iosv')) && 
        (type2Lower.includes('server'))) {
      return true;
    }
    
    // Router to Router (for complex topologies)
    if ((type1Lower.includes('router') || type1Lower.includes('ios')) && 
        (type2Lower.includes('router') || type2Lower.includes('ios'))) {
      return Math.random() > 0.5; // Random connection for demo
    }
    
    return false;
  };

  // Update nodes and edges when devices or selection changes
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateTopology();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [generateTopology, setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Custom node component
  const DeviceNode = ({ data }) => {
    const IconComponent = getDeviceIcon(data.deviceType);
    
    return (
      <div
        className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          data.isSelected
            ? 'bg-blue-500 text-white border-blue-600 shadow-lg'
            : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
        }`}
        onClick={data.onSelect}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-2xl">
            {IconComponent}
          </div>
          <div className="text-sm font-medium">
            {data.label}
          </div>
          <div className="text-xs opacity-75">
            {data.deviceType || 'Device'}
          </div>
          {data.device?.host && (
            <div className="text-xs opacity-60">
              {data.device.host}:{data.device.port}
            </div>
          )}
        </div>
      </div>
    );
  };

  const nodeTypes = useMemo(() => ({
    deviceNode: DeviceNode,
  }), [getDeviceIcon]);

  if (!devices || Object.keys(devices).length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🔧</div>
          <p>No devices available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data?.isSelected) return '#3B82F6';
            return '#9CA3AF';
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background color="#E5E7EB" gap={20} />
      </ReactFlow>
    </div>
  );
};

export default NetworkTopology;

