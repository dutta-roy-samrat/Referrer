"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import styles from "./main.module.css";
import AnimatedArrowButton from "@/components/ui/button/animated-arrow";
import plusIcon from "@/assets/icons/plus.svg";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";

const ReferralForm = dynamic(() => import("@/components/form/referral"));

export default function AddReferralModal({
  className = "rounded-full",
  iconClass = "rounded-full",
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const renderPlusIcon = () => <Image src={plusIcon} alt="add post" />;
  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger className={styles.triggerBtnPos} asChild>
        <AnimatedArrowButton
          text="Add Post"
          renderIcon={renderPlusIcon}
          className={className}
          iconClass={iconClass}
          onClick={() => setIsDialogOpen(true)}
        />
      </DialogTrigger>
      <DialogContent
        className={styles.dialogContent}
        overlayClassName={styles.dialogOverlay}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            Post New Referral
          </DialogTitle>
        </DialogHeader>
        <ReferralForm setIsFormDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
