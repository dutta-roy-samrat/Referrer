import { FC } from "react";

import StarIcon from "@/components/ui/icons/star";

import styles from "./main.module.css";

const Skills: FC<{ skills: string[] }> = ({ skills }) => {
  const renderSkills = () =>
    skills.map((skill) => (
      <span key={skill} className={styles.skillPill}>
        {skill}
      </span>
    ));

  return (
    <div className={styles.contentFieldContainer}>
      <StarIcon alt="skills" />
      <div className={styles.skillsListContainer}>{renderSkills()}</div>
    </div>
  );
};
export default Skills;
