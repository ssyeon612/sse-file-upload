import "./App.css";
import { useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import parseData from "./lib/parseData";
import handleFile from "./lib/handleFile";

import ConfettiComponent from "./components/Confetti";
import Memo from "./components/Memo";

export interface IFileDto {
  id?: string;
  totalByte?: number;
  downloadedByte?: number;
  progress?: number;
  filePath?: string | null;
}

// const uploadURL = "/api/admin-cms/v1/file/upload2";
const uploadURL = "/api/admin-cms/v1/file/upload3";
const cancelURL = "/api/admin-cms/v1/file/upload2-cancle";

function App() {
  const [fileDto, setFileDto] = useState<IFileDto>({});
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<String | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [byte, setByte] = useState<number>(0);
  const [totalByte, setTotalByte] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const buttonWrap = useRef<HTMLDivElement>(null);
  const uploadBtn = useRef<HTMLButtonElement>(null);
  const cancelBtn = useRef<HTMLButtonElement>(null);

  // 파일 업로드
  const fileUpload = async () => {
    const payload = handleFile({ uploadFile: file, path: filePath });
    buttonWrap.current?.classList.add("on");

    await fetchEventSource(uploadURL, {
      method: "POST",
      headers: { Accept: "text/event-stream" },
      body: payload,
      onmessage(event) {
        const data: IFileDto = parseData(event.data);
        setFileDto(data);

        const downloadedByte = data["downloadedByte"];
        const totalByte = data["totalByte"];
        const progress = data["progress"];
        const id = data["id"];
        if (totalByte !== undefined) setTotalByte(totalByte);
        if (downloadedByte !== undefined) setByte(downloadedByte);
        if (progress !== undefined) setProgress(progress);
        if (progress === 100) setIsDone(true);
      },
      onclose() {
        console.log("Connection closed");
        resetBtn();
      },
      onerror(err) {
        console.log("error :: {}", err);
        resetBtn();
      },
    });
  };

  // 업로드 취소
  const handleCancel = async () => {
    const json = JSON.stringify({ id: fileDto.id });
    fetch(cancelURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    })
      .then(async (res) => {
        console.log("cancel complete :: {}", res);
        resetBtn();
      })
      .catch((err) => {
        console.error("cancel error :: {}", err);
      });
  };

  useEffect(() => {
    if (file) {
      fileUpload();
    }
  }, [file]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const target = e.target.files[0];
    setFile(target);
    setProgress(0);

    uploadBtn.current?.classList.add("button--loading");
    e.target.value = "";
  };

  const resetBtn = () => {
    uploadBtn.current?.classList.remove("button--loading");
    buttonWrap.current?.classList.remove("on");
  };

  return (
    <>
      <div>
        <h1>File Upload</h1>
        {fileDto.filePath && <Memo id={fileDto.id} filePath={fileDto.filePath} />}
        <div>
          <div className="progress-container">
            <div className="remain-byte">
              {byte} byte / {totalByte} byte
            </div>
            <progress value={progress} max={100} />
          </div>
          <div className="upload-wrap">
            <div className="text-box">
              <span>저장 경로</span>
              <input type="text" onChange={(e) => setFilePath(e.target.value)} />
            </div>
            <p className="file-name">{file && file["name"]}</p>
            <input type="file" ref={fileInput} onChange={onChange} />

            <div className="btn-wrap" ref={buttonWrap}>
              <button className="upload-btn" onClick={() => fileInput.current!.click()} ref={uploadBtn}>
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white svg"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="button__text">Upload File</span>
              </button>
              <button className="cancel-btn" ref={cancelBtn} onClick={handleCancel}>
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfettiComponent isDone={isDone} />
    </>
  );
}

export default App;
