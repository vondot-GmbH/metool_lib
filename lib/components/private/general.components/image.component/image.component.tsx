import classNames from "classnames";
import styles from "./image.component.module.scss";

interface ImageProps {
  imageUrl?: string;
  rounded?: boolean;
  className?: string;
  size?: "S" | "M" | "L" | "XXL" | "FULL_SIZE";
  empty?: boolean;
}

const Image = ({
  imageUrl,
  rounded = false,
  className,
  size = "S",
  empty = false,
}: ImageProps): JSX.Element => {
  let tableImageClassName = classNames(className, styles.tableImage);

  switch (size) {
    case "S":
      tableImageClassName += ` ${styles.tableImageSmall}`;
      break;
    case "M":
      tableImageClassName += ` ${styles.tableImageMedium}`;
      break;
    case "L":
      tableImageClassName += ` ${styles.tableImageLarge}`;
      break;
    case "XXL":
      tableImageClassName += ` ${styles.tableImageXl}`;
      break;
    case "FULL_SIZE":
      tableImageClassName += ` ${styles.tableImageFullSize}`;
      break;
    default:
      tableImageClassName += ` ${styles.tableImageXl}`;
  }

  if (rounded) {
    tableImageClassName += ` ${styles.roundedImage}`;
  }

  if (empty) {
    tableImageClassName += ` ${styles.tableImageEmpty}`;
  }

  if (!empty) {
    return <img className={tableImageClassName} src={imageUrl} alt="image" />;
  } else {
    return <div className={tableImageClassName}></div>;
  }
};

export default Image;
