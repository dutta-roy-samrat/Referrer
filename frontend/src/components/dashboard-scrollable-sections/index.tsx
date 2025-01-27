import { FC, ReactNode } from "react";

import { PostProps } from "@/components/post/types";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Feed from "@/components/feed";
import NDotsLoader from "@/components/ui/loader/n-dots";

import styles from "./main.module.css";

type DashboardScrollableSectionProps = {
  isLoading: boolean;
  data: PostProps[];
  renderHeaderContent: () => ReactNode;
  renderFallbackContent: () => ReactNode;
  showDeleteBtn?: boolean;
};

const DashboardScrollableSection: FC<DashboardScrollableSectionProps> = ({
  isLoading,
  data,
  renderHeaderContent,
  renderFallbackContent,
  showDeleteBtn,
}) => {
  const renderContent = () =>
    data?.length ? (
      renderScrollSection()
    ) : (
      <div className={styles.fallbackContent}>{renderFallbackContent()}</div>
    );

  const renderLoader = () => (
    <div className={styles.contentLoader}>
      <NDotsLoader
        numOfDots={5}
        animationClass={styles.contentLoaderAnimation}
      />
    </div>
  );

  const renderScrollSection = () => (
    <ScrollArea className={styles.scrollArea}>
      <div className={styles.scrollAreaContentContainer}>
        <Feed
          postList={data}
          showSkills={false}
          showDeleteBtn={showDeleteBtn}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  return (
    <article className={styles.articleContainer}>
      <header className={styles.articleHeaderContainer}>
        {renderHeaderContent()}
      </header>
      {isLoading ? renderLoader() : renderContent()}
    </article>
  );
};

export default DashboardScrollableSection;
