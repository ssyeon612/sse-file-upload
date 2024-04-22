const interfaceProperties = Object.keys({
  id: "",
  totalByte: 0,
  downloadedByte: 0,
  remainByte: 0,
  progress: 0,
  filePath: "",
});

function parseData(input: string) {
  const regex = /\(([^)]+)\)/;
  const matches = regex.exec(input);
  if (!matches || matches.length < 2) return {};

  // 괄호 안의 값을 쉼표로 구분하여 배열로 분리
  const values = matches[1].split(", ");

  // key-value 객체 생성
  const jsonData: { [key: string]: string | number } = {};
  values.forEach((value) => {
    const keyValue = value.split("=");
    if (keyValue.length === 2) {
      const key = keyValue[0].trim();
      const parsedValue = keyValue[1].trim();

      jsonData[key] = parseInt(parsedValue) ? parseInt(parsedValue) : parsedValue;
    }
  });

  // 필요한 값 필터링
  const filteredData = Object.fromEntries(
    Object.entries(jsonData).filter(([key]) => interfaceProperties.includes(key))
  );
  return filteredData;
}

export default parseData;
