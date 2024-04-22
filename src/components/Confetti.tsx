import { useEffect, useRef } from "react";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

export default function ConfettiComponent({ isDone }: { isDone: Boolean }) {
  const controller = useRef<any>();

  const onInitHandler = ({ conductor }: any) => {
    controller.current = conductor;
  };

  useEffect(() => {
    setTimeout(() => {
      if (isDone) controller.current?.shoot();
    }, 0);
  }, [isDone]);

  return <Realistic onInit={onInitHandler} />;
}
