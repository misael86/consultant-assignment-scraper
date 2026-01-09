interface IProperties {
  max: number;
  value: number;
}

export const ProgressBar = ({ max, value }: Readonly<IProperties>) => {
  return (
    <div>
      <progress className="w-full h-5" max={max} value={value} />
    </div>
  );
};
