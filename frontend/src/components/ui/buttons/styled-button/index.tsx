import clsx from "clsx";
import styles from "./main.module.css";

const getBtnStyles = (type: string) => {
  switch (type) {
    case "primary":
      return styles.primaryBtn;
    default:
      return "";
  }
};

const StyledButton = ({
  className = "",
  type = "primary",
  content = "",
  ...btnProps
}) => {
  return (
    <button className={clsx(getBtnStyles(type), className)} {...btnProps}>
      {content}
    </button>
  );
};

export default StyledButton;
