interface LapTimeProps {
  time: number | null;
}

export function LapTime({ time }: LapTimeProps) {
  if (time === null) {
    return <span className="text-slate-600">—</span>;
  }
  return <span className="font-mono tabular-nums">{time.toFixed(3)}</span>;
}
