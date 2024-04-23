import "./App.css";
import { useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import parseData from "./lib/parseData";
import handleFile from "./lib/handleFile";
import timer from "./lib/timer";

import ConfettiComponent from "./components/Confetti";
import Result from "./components/Result";

export interface IFileDto {
  id?: string;
  totalByte?: number;
  downloadedByte?: number;
  progress?: number;
  filePath?: string | null;
}

const defaultPath = "/work/Graphizer-Global/upload";

const uploadURL = "/api/admin-cms/v1/file/upload2";
// const uploadURL = "/api/admin-cms/v1/file/upload3";
const cancelURL = "/api/admin-cms/v1/file/upload2-cancle";

function App() {
  const [fileDto, setFileDto] = useState<IFileDto>({});
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string>(defaultPath);
  const [progress, setProgress] = useState<number>(0);
  const [byte, setByte] = useState<number>(0);
  const [totalByte, setTotalByte] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const fileInput = useRef<HTMLInputElement>(null);
  const buttonWrap = useRef<HTMLDivElement>(null);
  const uploadBtn = useRef<HTMLButtonElement>(null);
  const cancelBtn = useRef<HTMLButtonElement>(null);

  let tick: any;

  const timerStart = () => (tick = setInterval(countTime, 1000));
  const countTime = () => setTimer((preTimer) => preTimer + 1);

  // 파일 업로드
  const fileUpload = async () => {
    const payload = handleFile({ uploadFile: file, path: filePath });
    buttonWrap.current?.classList.add("on");

    await fetchEventSource(uploadURL, {
      method: "POST",
      headers: { Accept: "text/event-stream" },
      body: payload,
      async onopen(response) {
        console.log("onopen:: {}", response);
        timerStart();
      },
      onmessage(msg) {
        setIsLoading(true);
        const data: IFileDto = parseData(msg.data);
        setFileDto(data);
        const downloadedByte = data["downloadedByte"];
        const totalByte = data["totalByte"];
        let percent = 0;
        if (totalByte !== undefined && downloadedByte !== undefined) {
          percent = (downloadedByte / totalByte) * 100;
          setTotalByte(totalByte);
          setByte(downloadedByte);
          setProgress(percent);
        }
        if (percent === 100) setIsDone(true);
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
    setTimer(0);
    setIsDone(false);
    setFilePath(`${filePath}/${target["name"]}`);

    uploadBtn.current?.classList.add("button--loading");
    e.target.value = "";
  };

  const onChangeFilePath = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(e.target.value);
  };

  const onClickUpload = () => {
    if (!isLoading) {
      fileInput.current!.click();
      setFilePath(defaultPath);
    } else {
      cancelBtn.current!.click();
    }
  };

  const resetBtn = () => {
    // 타이머 종료
    clearInterval(tick);

    // 로딩 종료
    uploadBtn.current?.classList.remove("button--loading");
    buttonWrap.current?.classList.remove("on");
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <h1>File Upload</h1>
        <Result filePath={fileDto.filePath} />
        <div>
          <div className="progress-container">
            <div className="progress-bar">
              {byte} bytes / {totalByte} bytes
            </div>
            <progress value={progress} max={100} />
            <div className="progress-percent">
              {Math.ceil(progress * 10) / 10}% | {timer}초
            </div>
          </div>
          <div className="upload-wrap">
            <div className="form__group field">
              <input
                type="text"
                className="form__field"
                placeholder="저장 경로를 입력해 주세요."
                id="name"
                value={filePath}
                onChange={onChangeFilePath}
              />
              <label htmlFor="name" className="form__label">
                저장 경로
              </label>
            </div>
            <p className="file-name">{file && file["name"]}</p>
            <input type="file" ref={fileInput} onChange={onChange} />

            <div className="btn-wrap" ref={buttonWrap}>
              <button className="upload-btn" onClick={onClickUpload} ref={uploadBtn}>
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
