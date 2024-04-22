type TFileInfo = {
  uploadFile: File | null;
  path: String | null;
};

function handleFile({ uploadFile, path }: TFileInfo) {
  const formData = new FormData();
  if (!uploadFile) return;
  if (uploadFile instanceof File) {
    formData.append("csvFile", uploadFile);
  }
  const json = JSON.stringify({
    workspaceId: 1,
    applicationName: "graphizer-global",
    filePath: "/work/Graphizer-Global/upload",
  });
  const blob = new Blob([json], {
    type: "application/json",
  });

  formData.append("fileReqDto", blob);
  return formData;
}

export default handleFile;
