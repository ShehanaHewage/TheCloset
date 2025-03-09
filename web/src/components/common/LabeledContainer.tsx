import React from 'react';

export type LabelContainerProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

const LabeledContainer: React.FC<LabelContainerProps> = (props) => {
  return (
    <div className={props.className}>
      <h6 className="text-sm font-medium mb-1 ml-1">{props.label}</h6>
      {props.children}
    </div>
  );
};

export default LabeledContainer;
