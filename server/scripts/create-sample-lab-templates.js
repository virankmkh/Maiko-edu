const { LabTemplate, Course } = require('../models');

const sampleLabTemplates = [
  {
    name: "Basic Router Configuration",
    description: "Learn fundamental router configuration including interfaces, routing protocols, and basic security.",
    courseId: 1, // Assuming course ID 1 exists
    eveTemplateId: "basic-router-lab",
    topology: {
      name: "Basic Router Lab",
      devices: {
        "R1": {
          type: "router",
          model: "c7200",
          interfaces: ["FastEthernet0/0", "FastEthernet0/1"],
          position: { x: 100, y: 100 }
        },
        "R2": {
          type: "router", 
          model: "c7200",
          interfaces: ["FastEthernet0/0", "FastEthernet0/1"],
          position: { x: 300, y: 100 }
        },
        "PC1": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 50, y: 200 }
        },
        "PC2": {
          type: "pc",
          model: "linux", 
          interfaces: ["eth0"],
          position: { x: 350, y: 200 }
        }
      },
      connections: [
        { from: "R1", fromPort: "FastEthernet0/0", to: "R2", toPort: "FastEthernet0/0" },
        { from: "R1", fromPort: "FastEthernet0/1", to: "PC1", toPort: "eth0" },
        { from: "R2", fromPort: "FastEthernet0/1", to: "PC2", toPort: "eth0" }
      ]
    },
    devices: {
      "R1": {
        type: "router",
        model: "c7200",
        host: "192.168.1.10",
        port: 3001,
        username: "admin",
        password: "admin",
        console: "telnet"
      },
      "R2": {
        type: "router",
        model: "c7200", 
        host: "192.168.1.10",
        port: 3002,
        username: "admin",
        password: "admin",
        console: "telnet"
      },
      "PC1": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10", 
        port: 3003,
        username: "root",
        password: "root",
        console: "ssh"
      },
      "PC2": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3004, 
        username: "root",
        password: "root",
        console: "ssh"
      }
    },
    difficulty: "beginner",
    estimatedDuration: 60,
    maxConcurrentUsers: 20,
    prerequisites: [
      "Basic understanding of IP addressing",
      "Familiarity with command line interface"
    ],
    learningObjectives: [
      "Configure router interfaces with IP addresses",
      "Set up static routing between routers",
      "Test connectivity using ping and traceroute",
      "Configure basic router security features",
      "Understand the role of default gateways"
    ],
    instructions: `
# Basic Router Configuration Lab

## Lab Overview
In this lab, you will configure two Cisco routers to establish connectivity between two networks. You will learn how to configure interfaces, set up routing, and test connectivity.

## Lab Topology
- R1 and R2 are connected via FastEthernet0/0 interfaces
- R1 connects to PC1 via FastEthernet0/1
- R2 connects to PC2 via FastEthernet0/1

## Lab Objectives
1. Configure IP addresses on router interfaces
2. Set up static routing
3. Test end-to-end connectivity
4. Configure basic security

## Step-by-Step Instructions

### Step 1: Configure R1
1. Connect to R1 console
2. Enter global configuration mode: \`configure terminal\`
3. Configure interface FastEthernet0/0:
   \`\`\`
   interface FastEthernet0/0
   ip address 192.168.12.1 255.255.255.0
   no shutdown
   \`\`\`
4. Configure interface FastEthernet0/1:
   \`\`\`
   interface FastEthernet0/1
   ip address 192.168.1.1 255.255.255.0
   no shutdown
   \`\`\`
5. Configure static route to R2's network:
   \`\`\`
   ip route 192.168.2.0 255.255.255.0 192.168.12.2
   \`\`\`

### Step 2: Configure R2
1. Connect to R2 console
2. Enter global configuration mode: \`configure terminal\`
3. Configure interface FastEthernet0/0:
   \`\`\`
   interface FastEthernet0/0
   ip address 192.168.12.2 255.255.255.0
   no shutdown
   \`\`\`
4. Configure interface FastEthernet0/1:
   \`\`\`
   interface FastEthernet0/1
   ip address 192.168.2.1 255.255.255.0
   no shutdown
   \`\`\`
5. Configure static route to R1's network:
   \`\`\`
   ip route 192.168.1.0 255.255.255.0 192.168.12.1
   \`\`\`

### Step 3: Configure PCs
1. Configure PC1:
   \`\`\`
   ip 192.168.1.10 192.168.1.1
   \`\`\`
2. Configure PC2:
   \`\`\`
   ip 192.168.2.10 192.168.2.1
   \`\`\`

### Step 4: Test Connectivity
1. From PC1, ping PC2: \`ping 192.168.2.10\`
2. From PC2, ping PC1: \`ping 192.168.1.10\`
3. Use traceroute to verify the path: \`traceroute 192.168.2.10\`

## Verification Commands
- \`show ip interface brief\` - Check interface status
- \`show ip route\` - Verify routing table
- \`ping\` - Test connectivity
- \`traceroute\` - Trace packet path

## Troubleshooting
- Check interface status with \`show ip interface brief\`
- Verify routing table with \`show ip route\`
- Check for typos in IP addresses
- Ensure interfaces are not administratively down
    `,
    resourceRequirements: {
      cpu: 2,
      ram: 4,
      storage: 8
    }
  },
  {
    name: "VLAN Configuration Lab",
    description: "Learn VLAN concepts and configuration on Cisco switches including trunking and inter-VLAN routing.",
    courseId: 1,
    eveTemplateId: "vlan-lab",
    topology: {
      name: "VLAN Lab",
      devices: {
        "SW1": {
          type: "switch",
          model: "c2960",
          interfaces: ["FastEthernet0/1", "FastEthernet0/2", "FastEthernet0/3", "FastEthernet0/4"],
          position: { x: 200, y: 100 }
        },
        "R1": {
          type: "router",
          model: "c7200",
          interfaces: ["FastEthernet0/0", "FastEthernet0/1"],
          position: { x: 200, y: 250 }
        },
        "PC1": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 100, y: 50 }
        },
        "PC2": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 300, y: 50 }
        },
        "PC3": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 100, y: 150 }
        },
        "PC4": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 300, y: 150 }
        }
      },
      connections: [
        { from: "SW1", fromPort: "FastEthernet0/1", to: "PC1", toPort: "eth0" },
        { from: "SW1", fromPort: "FastEthernet0/2", to: "PC2", toPort: "eth0" },
        { from: "SW1", fromPort: "FastEthernet0/3", to: "PC3", toPort: "eth0" },
        { from: "SW1", fromPort: "FastEthernet0/4", to: "PC4", toPort: "eth0" },
        { from: "SW1", fromPort: "FastEthernet0/24", to: "R1", toPort: "FastEthernet0/0" }
      ]
    },
    devices: {
      "SW1": {
        type: "switch",
        model: "c2960",
        host: "192.168.1.10",
        port: 3005,
        username: "admin",
        password: "admin",
        console: "telnet"
      },
      "R1": {
        type: "router",
        model: "c7200",
        host: "192.168.1.10",
        port: 3006,
        username: "admin", 
        password: "admin",
        console: "telnet"
      },
      "PC1": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3007,
        username: "root",
        password: "root",
        console: "ssh"
      },
      "PC2": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3008,
        username: "root",
        password: "root",
        console: "ssh"
      },
      "PC3": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3009,
        username: "root",
        password: "root",
        console: "ssh"
      },
      "PC4": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3010,
        username: "root",
        password: "root",
        console: "ssh"
      }
    },
    difficulty: "intermediate",
    estimatedDuration: 90,
    maxConcurrentUsers: 15,
    prerequisites: [
      "Basic understanding of switching concepts",
      "Knowledge of IP addressing and subnetting",
      "Familiarity with Cisco IOS commands"
    ],
    learningObjectives: [
      "Create and configure VLANs on a switch",
      "Assign switch ports to VLANs",
      "Configure trunk links between switches and routers",
      "Set up inter-VLAN routing using router-on-a-stick",
      "Test connectivity between different VLANs",
      "Understand VLAN tagging and untagging"
    ],
    instructions: `
# VLAN Configuration Lab

## Lab Overview
In this lab, you will configure VLANs on a Cisco switch and set up inter-VLAN routing using a router-on-a-stick configuration.

## Lab Topology
- SW1: Cisco 2960 switch with 4 PCs connected
- R1: Cisco 7200 router for inter-VLAN routing
- PC1, PC2: VLAN 10 (Sales)
- PC3, PC4: VLAN 20 (Engineering)

## Lab Objectives
1. Create VLANs 10 and 20 on the switch
2. Assign appropriate ports to VLANs
3. Configure trunk link between switch and router
4. Set up sub-interfaces on router for inter-VLAN routing
5. Test connectivity between VLANs

## Step-by-Step Instructions

### Step 1: Configure VLANs on SW1
1. Connect to SW1 console
2. Enter global configuration mode: \`configure terminal\`
3. Create VLANs:
   \`\`\`
   vlan 10
   name Sales
   vlan 20
   name Engineering
   \`\`\`
4. Configure access ports for VLAN 10:
   \`\`\`
   interface FastEthernet0/1
   switchport mode access
   switchport access vlan 10
   no shutdown
   
   interface FastEthernet0/2
   switchport mode access
   switchport access vlan 10
   no shutdown
   \`\`\`
5. Configure access ports for VLAN 20:
   \`\`\`
   interface FastEthernet0/3
   switchport mode access
   switchport access vlan 20
   no shutdown
   
   interface FastEthernet0/4
   switchport mode access
   switchport access vlan 20
   no shutdown
   \`\`\`
6. Configure trunk port to router:
   \`\`\`
   interface FastEthernet0/24
   switchport mode trunk
   switchport trunk allowed vlan 10,20
   no shutdown
   \`\`\`

### Step 2: Configure Inter-VLAN Routing on R1
1. Connect to R1 console
2. Enter global configuration mode: \`configure terminal\`
3. Configure sub-interface for VLAN 10:
   \`\`\`
   interface FastEthernet0/0.10
   encapsulation dot1Q 10
   ip address 192.168.10.1 255.255.255.0
   \`\`\`
4. Configure sub-interface for VLAN 20:
   \`\`\`
   interface FastEthernet0/0.20
   encapsulation dot1Q 20
   ip address 192.168.20.1 255.255.255.0
   \`\`\`
5. Enable the main interface:
   \`\`\`
   interface FastEthernet0/0
   no shutdown
   \`\`\`

### Step 3: Configure PCs
1. Configure PC1 (VLAN 10):
   \`\`\`
   ip 192.168.10.10 192.168.10.1
   \`\`\`
2. Configure PC2 (VLAN 10):
   \`\`\`
   ip 192.168.10.20 192.168.10.1
   \`\`\`
3. Configure PC3 (VLAN 20):
   \`\`\`
   ip 192.168.20.10 192.168.20.1
   \`\`\`
4. Configure PC4 (VLAN 20):
   \`\`\`
   ip 192.168.20.20 192.168.20.1
   \`\`\`

### Step 4: Test Connectivity
1. Test within VLAN 10: PC1 ping PC2
2. Test within VLAN 20: PC3 ping PC4
3. Test between VLANs: PC1 ping PC3
4. Test between VLANs: PC2 ping PC4

## Verification Commands
- \`show vlan brief\` - Check VLAN configuration
- \`show interfaces trunk\` - Verify trunk configuration
- \`show ip route\` - Check routing table
- \`ping\` - Test connectivity

## Troubleshooting
- Check VLAN assignment with \`show vlan brief\`
- Verify trunk configuration with \`show interfaces trunk\`
- Check sub-interface configuration on router
- Ensure PCs are in correct VLANs
    `,
    resourceRequirements: {
      cpu: 3,
      ram: 6,
      storage: 12
    }
  },
  {
    name: "OSPF Routing Lab",
    description: "Configure OSPF routing protocol in a multi-router network with area design and route redistribution.",
    courseId: 1,
    eveTemplateId: "ospf-lab",
    topology: {
      name: "OSPF Lab",
      devices: {
        "R1": {
          type: "router",
          model: "c7200",
          interfaces: ["FastEthernet0/0", "FastEthernet0/1"],
          position: { x: 100, y: 100 }
        },
        "R2": {
          type: "router",
          model: "c7200", 
          interfaces: ["FastEthernet0/0", "FastEthernet0/1", "FastEthernet0/2"],
          position: { x: 300, y: 100 }
        },
        "R3": {
          type: "router",
          model: "c7200",
          interfaces: ["FastEthernet0/0", "FastEthernet0/1"],
          position: { x: 500, y: 100 }
        },
        "PC1": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 50, y: 200 }
        },
        "PC2": {
          type: "pc",
          model: "linux",
          interfaces: ["eth0"],
          position: { x: 550, y: 200 }
        }
      },
      connections: [
        { from: "R1", fromPort: "FastEthernet0/0", to: "R2", toPort: "FastEthernet0/0" },
        { from: "R2", fromPort: "FastEthernet0/1", to: "R3", toPort: "FastEthernet0/0" },
        { from: "R1", fromPort: "FastEthernet0/1", to: "PC1", toPort: "eth0" },
        { from: "R3", fromPort: "FastEthernet0/1", to: "PC2", toPort: "eth0" }
      ]
    },
    devices: {
      "R1": {
        type: "router",
        model: "c7200",
        host: "192.168.1.10",
        port: 3011,
        username: "admin",
        password: "admin",
        console: "telnet"
      },
      "R2": {
        type: "router",
        model: "c7200",
        host: "192.168.1.10",
        port: 3012,
        username: "admin",
        password: "admin",
        console: "telnet"
      },
      "R3": {
        type: "router",
        model: "c7200",
        host: "192.168.1.10",
        port: 3013,
        username: "admin",
        password: "admin",
        console: "telnet"
      },
      "PC1": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3014,
        username: "root",
        password: "root",
        console: "ssh"
      },
      "PC2": {
        type: "pc",
        model: "linux",
        host: "192.168.1.10",
        port: 3015,
        username: "root",
        password: "root",
        console: "ssh"
      }
    },
    difficulty: "advanced",
    estimatedDuration: 120,
    maxConcurrentUsers: 10,
    prerequisites: [
      "Understanding of routing concepts",
      "Knowledge of OSPF protocol",
      "Experience with Cisco IOS configuration",
      "Understanding of network areas and LSAs"
    ],
    learningObjectives: [
      "Configure OSPF routing protocol on multiple routers",
      "Understand OSPF area design and configuration",
      "Configure OSPF authentication",
      "Implement route summarization",
      "Troubleshoot OSPF neighbor relationships",
      "Analyze OSPF database and routing table"
    ],
    instructions: `
# OSPF Routing Lab

## Lab Overview
In this lab, you will configure OSPF routing protocol across three routers with different areas and learn advanced OSPF features.

## Lab Topology
- R1: Area 0 (Backbone) - connects to PC1
- R2: Area 0 and Area 1 (ABR) - backbone router
- R3: Area 1 - connects to PC2
- All routers connected in a linear topology

## Lab Objectives
1. Configure OSPF on all routers
2. Set up different OSPF areas
3. Configure OSPF authentication
4. Implement route summarization
5. Test end-to-end connectivity
6. Analyze OSPF database

## Step-by-Step Instructions

### Step 1: Configure Basic OSPF on R1
1. Connect to R1 console
2. Configure interfaces:
   \`\`\`
   interface FastEthernet0/0
   ip address 10.1.12.1 255.255.255.0
   no shutdown
   
   interface FastEthernet0/1
   ip address 192.168.1.1 255.255.255.0
   no shutdown
   \`\`\`
3. Configure OSPF:
   \`\`\`
   router ospf 1
   router-id 1.1.1.1
   network 10.1.12.0 0.0.0.255 area 0
   network 192.168.1.0 0.0.0.255 area 0
   \`\`\`

### Step 2: Configure OSPF on R2 (ABR)
1. Connect to R2 console
2. Configure interfaces:
   \`\`\`
   interface FastEthernet0/0
   ip address 10.1.12.2 255.255.255.0
   no shutdown
   
   interface FastEthernet0/1
   ip address 10.2.23.2 255.255.255.0
   no shutdown
   \`\`\`
3. Configure OSPF:
   \`\`\`
   router ospf 1
   router-id 2.2.2.2
   network 10.1.12.0 0.0.0.255 area 0
   network 10.2.23.0 0.0.0.255 area 1
   \`\`\`

### Step 3: Configure OSPF on R3
1. Connect to R3 console
2. Configure interfaces:
   \`\`\`
   interface FastEthernet0/0
   ip address 10.2.23.3 255.255.255.0
   no shutdown
   
   interface FastEthernet0/1
   ip address 192.168.2.1 255.255.255.0
   no shutdown
   \`\`\`
3. Configure OSPF:
   \`\`\`
   router ospf 1
   router-id 3.3.3.3
   network 10.2.23.0 0.0.0.255 area 1
   network 192.168.2.0 0.0.0.255 area 1
   \`\`\`

### Step 4: Configure PCs
1. Configure PC1:
   \`\`\`
   ip 192.168.1.10 192.168.1.1
   \`\`\`
2. Configure PC2:
   \`\`\`
   ip 192.168.2.10 192.168.2.1
   \`\`\`

### Step 5: Verify OSPF Configuration
1. Check OSPF neighbors:
   \`\`\`
   show ip ospf neighbor
   \`\`\`
2. Check OSPF database:
   \`\`\`
   show ip ospf database
   \`\`\`
3. Check routing table:
   \`\`\`
   show ip route ospf
   \`\`\`

### Step 6: Test Connectivity
1. From PC1, ping PC2: \`ping 192.168.2.10\`
2. Use traceroute to verify path: \`traceroute 192.168.2.10\`

## Advanced Configuration (Optional)

### OSPF Authentication
1. Configure MD5 authentication on R1:
   \`\`\`
   interface FastEthernet0/0
   ip ospf authentication message-digest
   ip ospf message-digest-key 1 md5 cisco123
   \`\`\`
2. Repeat on R2 and R3

### Route Summarization
1. Configure area range on R2:
   \`\`\`
   router ospf 1
   area 1 range 192.168.2.0 255.255.255.0
   \`\`\`

## Verification Commands
- \`show ip ospf neighbor\` - Check neighbor relationships
- \`show ip ospf database\` - View OSPF database
- \`show ip route ospf\` - Check OSPF routes
- \`show ip ospf interface\` - Check OSPF interface status

## Troubleshooting
- Check interface status and IP addresses
- Verify OSPF configuration with \`show running-config\`
- Check for authentication mismatches
- Ensure all interfaces are in correct areas
- Verify router IDs are unique
    `,
    resourceRequirements: {
      cpu: 4,
      ram: 8,
      storage: 16
    }
  }
];

async function createSampleLabTemplates() {
  try {
    console.log('Creating sample lab templates...');
    
    for (const templateData of sampleLabTemplates) {
      // Check if course exists
      const course = await Course.findByPk(templateData.courseId);
      if (!course) {
        console.log(`Course with ID ${templateData.courseId} not found. Skipping template: ${templateData.name}`);
        continue;
      }

      // Check if template already exists
      const existingTemplate = await LabTemplate.findOne({
        where: { eveTemplateId: templateData.eveTemplateId }
      });

      if (existingTemplate) {
        console.log(`Template ${templateData.name} already exists. Skipping...`);
        continue;
      }

      // Create template
      const template = await LabTemplate.create(templateData);
      console.log(`✅ Created template: ${template.name} (ID: ${template.id})`);
    }

    console.log('Sample lab templates created successfully!');
  } catch (error) {
    console.error('Error creating sample lab templates:', error);
  }
}

// Run the script if called directly
if (require.main === module) {
  createSampleLabTemplates()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSampleLabTemplates, sampleLabTemplates };

