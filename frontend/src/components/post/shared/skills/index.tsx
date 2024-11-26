import StarIcon from "@/components/ui/icons/star";
import { FC } from "react";

import styles from "@/components/post/card/main.module.css";

const Skills: FC<{ skills: string[] }> = ({ skills }) => (
  <div className={styles.contentFieldContainer}>
    <StarIcon alt="skills" />
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-black px-4 py-1 text-white"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);
export default Skills;
