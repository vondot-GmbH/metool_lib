import classNames from "classnames";
import styles from "./wrap.component.module.scss";

interface WrapProps {
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onClick?: () => void;
}

const Wrap = ({
  justifyContent,
  alignItems,
  children,
  className,
  onClick,
}: WrapProps): JSX.Element => {
  const wrapContainerClassName = classNames(styles.wrapContainer, className);

  return (
    <div
      className={wrapContainerClassName}
      style={{ justifyContent, alignItems }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Wrap;
