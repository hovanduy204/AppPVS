const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to ensure Android Gradle Plugin version 8.6.0+ is used
 * This is required for androidx.core:core:1.16.0 and compileSdkVersion 35
 */
const withAgpVersion = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const buildGradlePath = path.join(projectRoot, 'build.gradle');
      
      console.log(`[withAgpVersion] Plugin started`);
      console.log(`[withAgpVersion] Android project root: ${projectRoot}`);
      console.log(`[withAgpVersion] Checking build.gradle at: ${buildGradlePath}`);
      
      // Try to find build.gradle in multiple locations
      let actualPath = buildGradlePath;
      if (!fs.existsSync(actualPath)) {
        // Try alternative paths
        const alternatives = [
          path.join(projectRoot, '..', 'android', 'build.gradle'),
          path.join(process.cwd(), 'android', 'build.gradle'),
        ];
        
        for (const altPath of alternatives) {
          if (fs.existsSync(altPath)) {
            actualPath = altPath;
            console.log(`[withAgpVersion] Found build.gradle at alternative path: ${actualPath}`);
            break;
          }
        }
      }
      
      if (fs.existsSync(actualPath)) {
        let buildGradleContent = fs.readFileSync(actualPath, 'utf8');
        const originalContent = buildGradleContent;
        
        // Check current AGP version
        const agpMatch = buildGradleContent.match(/com\.android\.tools\.build:gradle:([0-9.]+)/);
        if (agpMatch) {
          const currentVersion = agpMatch[1];
          console.log(`[withAgpVersion] Current AGP version: ${currentVersion}`);
          
          const versionParts = currentVersion.split('.').map(Number);
          const major = versionParts[0] || 0;
          const minor = versionParts[1] || 0;
          
          // If version is less than 8.6.0, update it
          if (major < 8 || (major === 8 && minor < 6)) {
            console.log(`[withAgpVersion] Updating AGP from ${currentVersion} to 8.6.0`);
            
            // Update AGP version to 8.6.0
            buildGradleContent = buildGradleContent.replace(
              /(com\.android\.tools\.build:gradle:)([0-9.]+)/g,
              (match, prefix, version) => {
                return `${prefix}8.6.0`;
              }
            );
            
            fs.writeFileSync(actualPath, buildGradleContent, 'utf8');
            console.log(`[withAgpVersion] ✓ Successfully updated AGP version to 8.6.0`);
            
            // Verify the update
            const verifyMatch = buildGradleContent.match(/com\.android\.tools\.build:gradle:([0-9.]+)/);
            if (verifyMatch) {
              console.log(`[withAgpVersion] ✓ Verified: AGP version is now ${verifyMatch[1]}`);
            }
          } else {
            console.log(`[withAgpVersion] ✓ AGP version ${currentVersion} is already 8.6.0 or higher`);
          }
        } else {
          console.log(`[withAgpVersion] WARNING: Could not find AGP version in build.gradle`);
        }
      } else {
        console.log(`[withAgpVersion] ERROR: build.gradle not found at ${actualPath}`);
        console.log(`[withAgpVersion] Project root exists: ${fs.existsSync(projectRoot)}`);
        if (fs.existsSync(projectRoot)) {
          const files = fs.readdirSync(projectRoot);
          console.log(`[withAgpVersion] Files in project root: ${files.join(', ')}`);
        }
      }
      
      return config;
    },
  ]);
};

module.exports = withAgpVersion;

