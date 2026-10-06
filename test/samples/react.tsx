import React, { useState, useEffect } from "react";
import styles from "./Counter.module.css";

type Props = { initial?: number; label: string };

export default function Counter({ initial = 0, label }: Props) {
  const [count, setCount] = useState<number>(initial);

  useEffect(() => {
    document.title = `${label}: ${count}`;
  }, [count, label]);

  return (
    <div className={styles.wrapper} data-count={count}>
      {/* A comment inside JSX */}
      <h1 style={{ color: "#478cbf" }}>{label}</h1>
      <Button variant="primary" onClick={() => setCount((c) => c + 1)} disabled={count > 9}>
        Clicked {count} times
      </Button>
      {count > 5 && <p className="warning">Getting high!</p>}
    </div>
  );
}
