import { IFileDto } from "../App";

function Memo({ id, filePath }: IFileDto) {
  return (
    <div className="memo-wrap">
      <p>
        ID : <span>{id}</span>
      </p>
      <p>
        FILE PATH : <span>{filePath}</span>
      </p>
    </div>
  );
}

export default Memo;
