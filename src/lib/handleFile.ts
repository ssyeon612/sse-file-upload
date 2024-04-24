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
  
  // 파일 request 경로만 추출
  const newPath = path?.replace(`/${uploadFile["name"]}`, "");

  const json = JSON.stringify({
    workspaceId: 1,
    applicationName: "graphizer-global",
    filePath: newPath,
  });
  const blob = new Blob([json], {
    type: "application/json",
  });

  formData.append("fileReqDto", blob);
  return formData;
}

export default handleFile;
