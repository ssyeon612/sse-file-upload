import { IFileDto } from "../App";

function ResultBox({ filePath }: IFileDto) {
  const handleClick = () => {
    navigator.clipboard.writeText(filePath!);
    alert("경로가 복사되었습니다.");
  };
  return (
    <div className="result-container">
      <div className="copy">
        <span onClick={handleClick}>Copy</span>
      </div>
      <p>
        FILE PATH : <span>{filePath}</span>
      </p>
    </div>
  );
}

export default ResultBox;
