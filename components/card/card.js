import Image from "next/image";
import styles from "./card.module.css";
import { useState } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
const Card = ({ imgUrl, size = "medium", id }) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };
  const handleOnError = () => {
    setImgSrc("/static/default_movie.jpg");
  };
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  return (
    <div className={styles.container} key={id}>
      <motion.div
        className={classNames(styles.imgMotionWrapper, classMap[size])}
        whileHover={{
          ...scale,
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Image
          src={imgSrc}
          alt="movie image"
          fill
          className={styles.cardImg}
          onError={handleOnError}
          sizes={size}
          priority
        />
      </motion.div>
    </div>
  );
};

export default Card;
