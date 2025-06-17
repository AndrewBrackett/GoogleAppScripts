const FOLDER_ID = '***************Your Folder Id*******************'; // Replace with your actual root folder ID
const PROPS = PropertiesService.getScriptProperties();

/**
 * Main function to check for modified or newly created files in a Google Drive folder
 * and its subfolders since the last script run.
 * If such files are found, it calls moveAllFilesToGCS().
 */
function checkForModifiedFilesRecursive() {
  // Retrieve the last check timestamp. If not found, use Epoch (January 1, 1970)
  const lastCheckStr = PROPS.getProperty('LAST_CHECK');
  const lastCheck = lastCheckStr ? new Date(lastCheckStr) : new Date(0); // Use 0 for Epoch if no previous timestamp

  Logger.log(`====================================================`);
  Logger.log(`🚀 Starting file modification check...`);
  Logger.log(`   LAST_CHECK property from PROPS: ${lastCheckStr || 'Not found (first run)'}`);
  Logger.log(`   Interpreted lastCheck Date: ${lastCheck.toISOString()} (UTC)`);
  Logger.log(`====================================================`);

  const rootFolder = DriveApp.getFolderById(FOLDER_ID);
  let filesDetectedCount = 0; // Use a simple counter to indicate if files were found

  // Start the recursive search
  filesDetectedCount = findUpdatedFilesInFolder_(rootFolder, lastCheck);

  // Update timestamp for the next run immediately after the search completes
  PROPS.setProperty('LAST_CHECK', new Date().toISOString());
  Logger.log(`✅ LAST_CHECK timestamp updated to: ${new Date().toISOString()} (UTC) for next run.`);

  if (filesDetectedCount > 0) {
    Logger.log(`\n🎉 ${filesDetectedCount} new or modified files detected!`);
    Logger.log("\n➡️ Attempting to execute moveAllFilesToGCS()...");
    // Call your moveAllFilesToGCS function, which exists as a separate script.
    // Ensure this function does not require specific arguments if you're not passing them.
    moveAllFilesToGCS();
  } else {
    Logger.log("\n✅ No new or modified files found since last check.");
  }

  Logger.log(`====================================================`);
  Logger.log(`🏁 File modification check complete.`);
  Logger.log(`====================================================`);
}

/**
 * Recursively searches a folder and its subfolders for files modified or created
 * since a given timestamp. Returns the count of files found.
 * @param {GoogleAppsScript.Drive.Folder} folder The current folder to check.
 * @param {Date} lastCheck The timestamp to compare file modification/creation dates against.
 * @returns {number} The total count of new or modified files found in this folder and its subfolders.
 */
function findUpdatedFilesInFolder_(folder, lastCheck) {
  let currentFolderFilesCount = 0;
  Logger.log(`\n📂 Entering folder: "${folder.getName()}" (ID: ${folder.getId()})`);

  // Check files in the current folder
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const lastUpdated = file.getLastUpdated();

    Logger.log(`   - Checking file: "${file.getName()}" (ID: ${file.getId()})`);
    Logger.log(`     File last updated: ${lastUpdated.toISOString()} (UTC)`);
    Logger.log(`     Comparing to lastCheck: ${lastCheck.toISOString()} (UTC)`);

    if (lastUpdated > lastCheck) {
      // File is either new or modified since the last check
      Logger.log(`   *** DETECTED: "${file.getName()}" (Updated: ${lastUpdated.toISOString()}) is NEWER!`);
      currentFolderFilesCount++;
    } else {
      Logger.log(`     SKIPPED: "${file.getName()}" (Updated: ${lastUpdated.toISOString()}) - Not newer than last check.`);
    }
  }

  // Recursively check subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const subfolder = subfolders.next();
    currentFolderFilesCount += findUpdatedFilesInFolder_(subfolder, lastCheck); // Accumulate count from subfolders
  }

  Logger.log(`   (Folder "${folder.getName()}" finished. Files found in this branch: ${currentFolderFilesCount})`);
  return currentFolderFilesCount;
}
