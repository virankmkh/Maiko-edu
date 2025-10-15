# Network Device Licensing Guide

## ⚠️ IMPORTANT LEGAL NOTICE

**You MUST have valid licenses for all commercial network device images used in your EVE-NG labs. Using unlicensed commercial images is illegal and can result in severe legal consequences.**

## 📋 Required Licenses by Vendor

### 1. Cisco Systems

#### Required License: Cisco Smart Net Total Care
- **Cost**: $1,000 - $5,000+ per year (depending on support level)
- **Coverage**: All Cisco IOS, IOS-XE, IOS-XR, NX-OS images
- **Benefits**: 
  - Access to Cisco Software Center
  - Technical support
  - Software updates
  - Legal use of images

#### How to Obtain:
1. **Contact Cisco Sales**: Call 1-800-553-6387
2. **Online Portal**: Visit [Cisco Software Center](https://software.cisco.com/)
3. **Partner Program**: Work with Cisco partners for better pricing
4. **Educational Discounts**: Available for accredited institutions

#### Required Information:
- Company information
- Intended use case (education/training)
- Number of concurrent users
- Support requirements

### 2. Juniper Networks

#### Required License: Juniper Care Plus
- **Cost**: $1,500 - $4,000+ per year
- **Coverage**: All Junos and Junos Evolved images
- **Benefits**:
  - Access to Juniper Support Portal
  - Software downloads
  - Technical support
  - Legal compliance

#### How to Obtain:
1. **Contact Juniper Sales**: Call 1-888-JUNIPER
2. **Online Portal**: Visit [Juniper Support Portal](https://support.juniper.net/)
3. **Partner Program**: Work with Juniper partners
4. **Educational Programs**: Special pricing for educational institutions

### 3. Open Source Alternatives (No License Required)

#### FRRouting (FRR)
- **License**: GPL v2 (Free)
- **Use Case**: Routing protocols, BGP, OSPF, IS-IS
- **Download**: [GitHub Releases](https://github.com/FRRouting/frr/releases)
- **Documentation**: [FRR Documentation](https://docs.frrouting.org/)

#### VyOS
- **License**: GPL v2 (Free)
- **Use Case**: Router and firewall functionality
- **Download**: [VyOS Releases](https://github.com/vyos/vyos-rolling/releases)
- **Documentation**: [VyOS Documentation](https://docs.vyos.io/)

#### OpenWrt
- **License**: GPL v2 (Free)
- **Use Case**: Router and switch functionality
- **Download**: [OpenWrt Downloads](https://downloads.openwrt.org/)
- **Documentation**: [OpenWrt Documentation](https://openwrt.org/docs/)

## 💰 Cost Breakdown

### Small Lab (5-10 concurrent users)
- **Cisco License**: $1,000 - $2,000/year
- **Juniper License**: $1,500 - $2,500/year
- **Open Source**: $0/year
- **Total**: $0 - $2,500/year

### Medium Lab (20-50 concurrent users)
- **Cisco License**: $2,000 - $4,000/year
- **Juniper License**: $2,500 - $4,000/year
- **Open Source**: $0/year
- **Total**: $0 - $4,000/year

### Large Lab (50+ concurrent users)
- **Cisco License**: $4,000 - $10,000+/year
- **Juniper License**: $4,000 - $8,000+/year
- **Open Source**: $0/year
- **Total**: $0 - $10,000+/year

## 🎓 Educational Discounts

### Cisco Educational Programs
- **Cisco Networking Academy**: Free for accredited institutions
- **Cisco Learning Credits**: Discounted training materials
- **Cisco DevNet**: Free developer resources
- **Contact**: [Cisco Education](https://www.cisco.com/c/en/us/training-events/training-certifications/education.html)

### Juniper Educational Programs
- **Juniper Academic Alliance**: Free for educational institutions
- **Juniper Learning Portal**: Free online training
- **Contact**: [Juniper Education](https://www.juniper.net/us/en/training/certification/academic-alliance.html)

## 🔧 Implementation Steps

### Step 1: Choose Your Approach

#### Option A: Commercial Licenses (Recommended for Production)
1. **Assess Requirements**: Determine which devices you need
2. **Contact Vendors**: Get quotes from Cisco and Juniper
3. **Purchase Licenses**: Sign contracts and pay fees
4. **Download Images**: Access vendor software centers
5. **Upload to EVE-NG**: Install images on your server

#### Option B: Open Source Only (Cost-Effective)
1. **Download Images**: Get FRR, VyOS, OpenWrt images
2. **Configure EVE-NG**: Set up open source images
3. **Create Labs**: Build labs using open source devices
4. **Document Limitations**: Note any missing features

#### Option C: Hybrid Approach (Balanced)
1. **Core Labs**: Use open source for basic labs
2. **Advanced Labs**: Use commercial images for advanced topics
3. **Cost Control**: Minimize commercial license costs
4. **Feature Coverage**: Ensure all learning objectives are met

### Step 2: Image Management

#### Commercial Images
```bash
# Example: Uploading Cisco IOS image to EVE-NG
# 1. Download from Cisco Software Center
# 2. Upload to EVE-NG server
scp c7200-adventerprisek9-mz.152-4.M12a.bin root@eve-ng-server:/opt/unetlab/addons/iol/bin/

# 3. Set proper permissions
chmod +x /opt/unetlab/addons/iol/bin/c7200-adventerprisek9-mz.152-4.M12a.bin
```

#### Open Source Images
```bash
# Example: Setting up FRR image
# 1. Download FRR image
wget https://github.com/FRRouting/frr/releases/download/frr-8.5.1/frr-8.5.1.tar.gz

# 2. Extract and configure
tar -xzf frr-8.5.1.tar.gz
cd frr-8.5.1

# 3. Build and install
./configure --enable-vtysh
make
make install
```

### Step 3: Compliance Documentation

#### Required Documentation
1. **License Agreements**: Keep copies of all license contracts
2. **Usage Logs**: Track which images are used when
3. **User Agreements**: Ensure students understand licensing
4. **Audit Trail**: Maintain records for compliance

#### Sample Compliance Checklist
- [ ] All commercial images have valid licenses
- [ ] License agreements are signed and stored
- [ ] Usage is within license terms
- [ ] Regular compliance audits are conducted
- [ ] Students are informed about licensing
- [ ] Images are properly secured

## 🚨 Legal Considerations

### Compliance Requirements
1. **License Terms**: Read and understand all license agreements
2. **Usage Limits**: Stay within concurrent user limits
3. **Geographic Restrictions**: Some licenses have geographic limits
4. **Educational Use**: Ensure licenses cover educational use
5. **Audit Rights**: Vendors may audit your usage

### Risk Mitigation
1. **Legal Review**: Have contracts reviewed by legal counsel
2. **Insurance**: Consider professional liability insurance
3. **Documentation**: Keep detailed usage records
4. **Monitoring**: Track license usage automatically
5. **Backup Plans**: Have alternatives if licenses expire

## 📊 Monitoring and Compliance

### Automated Monitoring
```javascript
// Example: License usage monitoring
const licenseMonitoring = {
  trackImageUsage: (imageName, userId) => {
    // Log image usage
    console.log(`Image ${imageName} used by user ${userId}`);
    
    // Check license limits
    if (currentUsage > licenseLimit) {
      alert('License limit exceeded');
    }
  },
  
  generateComplianceReport: () => {
    // Generate monthly compliance report
    return {
      totalUsage: getTotalUsage(),
      licenseStatus: checkLicenseStatus(),
      violations: getViolations()
    };
  }
};
```

### Compliance Dashboard
- **Real-time Usage**: Monitor current license usage
- **License Status**: Track expiration dates
- **Violation Alerts**: Get notified of potential issues
- **Usage Reports**: Generate compliance reports

## 🎯 Recommendations

### For Educational Institutions
1. **Start with Open Source**: Use FRR, VyOS, OpenWrt for basic labs
2. **Selective Commercial Use**: Only license specific devices for advanced labs
3. **Educational Discounts**: Take advantage of educational pricing
4. **Partner with Vendors**: Work with vendors for better deals

### For Corporate Training
1. **Full Commercial Licenses**: Use commercial images for production-like labs
2. **Compliance Focus**: Ensure full legal compliance
3. **Professional Support**: Get vendor support for complex issues
4. **Regular Audits**: Conduct regular compliance audits

### For Small Organizations
1. **Open Source First**: Start with free alternatives
2. **Gradual Upgrade**: Add commercial licenses as needed
3. **Cost Control**: Monitor and control licensing costs
4. **Community Support**: Use community resources for support

## 📞 Support Contacts

### Cisco Support
- **Sales**: 1-800-553-6387
- **Support**: 1-800-553-2447
- **Education**: [Cisco Education](https://www.cisco.com/c/en/us/training-events/training-certifications/education.html)

### Juniper Support
- **Sales**: 1-888-JUNIPER
- **Support**: 1-888-JUNIPER
- **Education**: [Juniper Education](https://www.juniper.net/us/en/training/certification/academic-alliance.html)

### Open Source Support
- **FRR**: [GitHub Issues](https://github.com/FRRouting/frr/issues)
- **VyOS**: [VyOS Community](https://forum.vyos.io/)
- **OpenWrt**: [OpenWrt Forum](https://forum.openwrt.org/)

## 📝 Next Steps

1. **Assess Your Needs**: Determine which devices you need
2. **Calculate Costs**: Estimate licensing costs
3. **Contact Vendors**: Get quotes and negotiate terms
4. **Start with Open Source**: Begin with free alternatives
5. **Plan Migration**: Gradually add commercial images
6. **Implement Monitoring**: Set up compliance tracking
7. **Train Staff**: Ensure team understands licensing
8. **Regular Reviews**: Conduct periodic compliance audits

Remember: **Compliance is not optional. Always ensure you have proper licenses for all commercial network device images.**

