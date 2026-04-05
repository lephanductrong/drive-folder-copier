function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Google Drive Folder Copier')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function extractIdFromUrl(url) {
  if (!url) return null;
  // Match standard Drive IDs
  var idMatch = url.match(/[-\w]{25,}/);
  return idMatch ? idMatch[0] : null;
}

function logToSheet(sourceUrl) {
  try {
    var sheet = SpreadsheetApp.openById('1krXhn2PBWwT1U4wq3t1HbDb9ZmImjlGJLM6U33bSezU').getSheets()[0];
    var email = Session.getActiveUser().getEmail();
    var timestamp = new Date();
    sheet.appendRow([timestamp, email, sourceUrl]);
    return { success: true };
  } catch (e) {
    // If the user doesn't have permission to write to this sheet, we don't want to break the whole app unless it's strictly required
    return { success: false, error: e.toString() };
  }
}

function getFolderContentsInfo(folderId) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var folders = folder.getFolders();
    
    var fileList = [];
    while (files.hasNext()) {
      var file = files.next();
      fileList.push({
        id: file.getId(),
        name: file.getName()
      });
    }
    
    var folderList = [];
    while (folders.hasNext()) {
      var subFolder = folders.next();
      folderList.push({
        id: subFolder.getId(),
        name: subFolder.getName()
      });
    }
    
    return { success: true, files: fileList, folders: folderList, name: folder.getName() };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function createTargetFolder(folderName, destParentId) {
  try {
    var parentFolder;
    if (destParentId) {
      parentFolder = DriveApp.getFolderById(destParentId);
    } else {
      parentFolder = DriveApp.getRootFolder();
    }
    var newFolder = parentFolder.createFolder(folderName);
    return { success: true, id: newFolder.getId() };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function copyFilesBatch(batch) {
  var results = [];
  for (var i = 0; i < batch.length; i++) {
    try {
      var item = batch[i];
      var file = DriveApp.getFileById(item.fileId);
      var destFolder = DriveApp.getFolderById(item.targetFolderId);
      file.makeCopy(file.getName(), destFolder);
      results.push({ fileId: item.fileId, success: true });
    } catch (e) {
      results.push({ fileId: item.fileId, success: false, error: e.toString() });
    }
  }
  return { success: true, results: results };
}
