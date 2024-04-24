type Props = {
  byte: number;
  totalByte: number;
  progress: number;
  timer: number;
};

function Progress({ byte, totalByte, progress, timer }: Props) {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        {byte} bytes / {totalByte} bytes
      </div>
      <progress value={progress} max={100} />
      <div className="progress-percent">
        {Math.ceil(progress * 10) / 10}% | {timer}초
      </div>
    </div>
  );
}

export default Progress;
